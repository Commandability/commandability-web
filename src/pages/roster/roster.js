import * as React from "react";
import styled from "styled-components";
import {
  FiUserPlus,
  FiCheckSquare,
  FiArrowRight,
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiUpload,
  FiDownload,
} from "react-icons/fi";
import * as Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { arrayUnion, arrayRemove } from "firebase/firestore";

import { useFirestoreUser } from "context/firestore-user-context";
import { Toast, ToastProvider, ToastViewport } from "components/toast";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
} from "components/alert-dialog";
import { Select, SelectItem } from "components/select";
import RosterItem from "components/roster-item";
import IconItem from "components/icon-item";
import TextInput from "components/text-input";
import Checkbox from "components/checkbox";
import Button from "components/button";
import SearchInput from "components/search-input";
import { QUERIES } from "constants.js";

const selectValues = {
  firstName: "first name",
  lastName: "last name",
  badge: "badge",
};

function sortByFirstName(firstPerson, secondPerson) {
  return firstPerson.firstName.localeCompare(secondPerson.firstName);
}

function sortByLastName(firstPerson, secondPerson) {
  return firstPerson.lastName.localeCompare(secondPerson.lastName);
}

function sortByBadge(firstPerson, secondPerson) {
  return firstPerson.badge.localeCompare(secondPerson.badge);
}

const unknownToastState = {
  title: "Unknown error",
  message: "Try again later or contact support.",
};

function Roster() {
  const { firestoreUser, updateFirestoreUserDoc } = useFirestoreUser();

  const [query, setQuery] = React.useState("");
  function personFilter(person) {
    if (!query) return true;

    const formattedQuery = query.toLowerCase();

    return (
      person.firstName.toLowerCase().startsWith(formattedQuery) ||
      person.lastName.toLowerCase().startsWith(formattedQuery) ||
      person.shift.toLowerCase().startsWith(formattedQuery) ||
      person.badge.toLowerCase().startsWith(formattedQuery)
    );
  }

  const [selectSort, setSelectSort] = React.useState(selectValues.firstName);

  let sortFunction = sortByFirstName;
  if (selectSort === selectValues.lastName) sortFunction = sortByLastName;
  if (selectSort === selectValues.badge) sortFunction = sortByBadge;

  const [removePersonnelOpen, setRemovePersonnelOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  const [addPersonOpen, setAddPersonOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [shift, setShift] = React.useState("");
  const [badge, setBadge] = React.useState("");

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const [importCSVOpen, setImportCSVOpen] = React.useState(false);
  const [importAlertDialogOpen, setImportAlertDialogOpen] =
    React.useState(false);
  const [importStatus, setImportStatus] = React.useState(null);

  const [downloadLink, setDownloadLink] = React.useState();

  function resetAddPersonInputs() {
    setFirstName("");
    setLastName("");
    setShift("");
    setBadge("");
  }

  async function addPersonnel(personnel) {
    await updateFirestoreUserDoc({ personnel: arrayUnion(...personnel) });
  }

  async function onAddPersonSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !badge) return;

    setAddPersonOpen(false);
    resetAddPersonInputs();

    try {
      // Check if the person and firebase contain any personnel with duplicate badges
      const mergeDuplicates = firestoreUser.data.personnel.some(
        (person) => person.badge === badge
      );
      if (mergeDuplicates) {
        setToastState({
          title: "Failed to add person",
          message:
            "Make sure there are no other personnel in the roster with the same badge.",
        });
      } else {
        await addPersonnel([{ firstName, lastName, shift, badge }]);
        setToastState({
          title: "Person added successfully",
          message: "The person has been added to the roster.",
        });
      }
    } catch (error) {
      setToastState(unknownToastState);
    }

    setToastOpen(true);
  }

  async function removePersonnel(personnel) {
    await updateFirestoreUserDoc({ personnel: arrayRemove(...personnel) });
  }

  async function onRemovePersonnelAction() {
    setRemovePersonnelOpen(false);

    try {
      await removePersonnel(checkedItems);
      setCheckedItems([]);
      setToastState({
        title: "Personnel deleted successfully",
        message: "The selected personnel have been removed the roster.",
      });
    } catch (error) {
      setToastState(unknownToastState);
    }

    setToastOpen(true);
  }

  async function importCSVOnClick() {
    setImportCSVOpen(false);

    try {
      const options = {
        types: [
          {
            description: "CSV Files",
            accept: {
              "text/csv": [".csv"],
            },
          },
        ],
      };
      const fileHandles = await window.showOpenFilePicker(options);

      const file = await fileHandles[0].getFile();
      const contents = await file.text();
      const personnel = await Papa.parse(contents, {
        header: true,
        skipEmptyLines: true,
      });

      if (personnel.errors?.length) {
        setImportStatus({
          parseErrors: personnel.errors.map((error) => ({
            ...error,
            id: uuidv4(),
          })),
          title: "Failed to import personnel",
          description:
            "No personnel were imported. Resolve all formatting issues in the CSV file.",
        });
      } else {
        // Check if the imported file contains any personnel with duplicate badges
        const importDuplicates =
          new Set(personnel.data.map((person) => person.badge)).size <
          personnel.data.length;
        // Check if the imported file and firebase contain any personnel with duplicate badges
        const mergeDuplicates = personnel.data.some((importedPerson) =>
          firestoreUser.data.personnel.some(
            (firebasePerson) => firebasePerson.badge === importedPerson.badge
          )
        );
        if (importDuplicates || mergeDuplicates) {
          setImportStatus({
            title: "Failed to import personnel",
            description:
              "No personnel were imported. Resolve all badge conflicts in both the CSV file and roster.",
          });
        } else {
          addPersonnel(personnel.data);
          setImportStatus({
            title: "Personnel imported successfully",
            description:
              "All personnel were successfully imported to the roster.",
          });
        }
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      setImportStatus({
        title: "Failed to import personnel",
        description: "Try again later or contact support.",
      });
    }

    setImportAlertDialogOpen(true);
  }

  React.useEffect(() => {
    const effect = async () => {
      const personnelCSV = await Papa.unparse(
        {
          fields: ["firstName", "lastName", "shift", "badge"],
          data: firestoreUser.data.personnel,
        },
        {
          header: true,
          skipEmptyLines: true,
        }
      );
      const data = new Blob([personnelCSV], {
        type: "text/csv",
      });
      setDownloadLink(window.URL.createObjectURL(data));
    };
    effect();
  }, [firestoreUser.data.personnel]);

  return (
    <Wrapper>
      <Content>
        <Top>
          <RosterSearch
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="roster-search"
            placeholder="name, badge, shift"
          />
          <RosterSelect
            select={selectSort}
            onValueChange={(select) => setSelectSort(select)}
            defaultValue={selectValues.firstName}
            label="Sort"
          >
            <SelectItem value={selectValues.firstName}>First name</SelectItem>
            <SelectItem value={selectValues.lastName}>Last name</SelectItem>
            <SelectItem value={selectValues.badge}>Badge</SelectItem>
          </RosterSelect>
          <Dialog open={addPersonOpen} onOpenChange={setAddPersonOpen}>
            <DialogTrigger asChild>
              <Button theme="light" icon={FiUserPlus}>
                Add person
              </Button>
            </DialogTrigger>
            <DialogContent
              header
              title="Add person"
              description="Add a new person to the roster here."
            >
              <DialogForm onSubmit={onAddPersonSubmit}>
                <DialogInputs>
                  <TextInput
                    id="first-name-input"
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={firstName ? "" : "Please enter a first name"}
                  />
                  <TextInput
                    id="last-name-input"
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={lastName ? "" : "Please enter a last name"}
                  />
                  <TextInput
                    id="shift-input"
                    label="Shift"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                  />
                  <TextInput
                    id="badge-input"
                    label="Badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    error={badge ? "" : "Please enter a badge"}
                  />
                </DialogInputs>
                <Button
                  type="submit"
                  onClick={onAddPersonSubmit}
                  theme="light"
                  icon={FiUserPlus}
                >
                  Add Person
                </Button>
              </DialogForm>
            </DialogContent>
          </Dialog>
        </Top>
        <ListHeader aria-live="polite" aria-atomic="true">
          <Group>
            <Checkbox
              label="Select all"
              checked={checkedAll.status}
              onCheckedChange={(checked) =>
                setCheckedAll({ status: checked, origin: "header" })
              }
            />
            {checkedItems.length === 0 ? (
              <Name>Name</Name>
            ) : (
              <AlertDialog
                open={removePersonnelOpen}
                onOpenChange={setRemovePersonnelOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button type="text">Delete</Button>
                </AlertDialogTrigger>
                <RemoveAlertDialogContent
                  header
                  title="Are you absolutely sure?"
                  description="This action cannot be undone. This will permanently delete the selected personnel from your account."
                >
                  <AlertOptions>
                    <AlertDialogCancel asChild>
                      <Button icon={FiX} theme="light">
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        onClick={onRemovePersonnelAction}
                        icon={FiCheck}
                        theme="light"
                      >
                        Yes, delete personnel
                      </Button>
                    </AlertDialogAction>
                  </AlertOptions>
                </RemoveAlertDialogContent>
              </AlertDialog>
            )}
            {checkedItems.length === 0 ? <span>Shift</span> : null}
          </Group>
          {checkedItems.length === 0 ? <span>Badge</span> : null}
        </ListHeader>
        <List aria-live="polite" aria-atomic="true">
          {[...firestoreUser.data.personnel]
            .filter((person) => personFilter(person))
            .sort((firstPerson, secondPerson) =>
              sortFunction(firstPerson, secondPerson)
            )
            .map((person) => (
              <RosterItem
                key={person.badge}
                setCheckedItems={setCheckedItems}
                checkedAll={checkedAll}
                setCheckedAll={setCheckedAll}
                person={person}
              />
            ))}
        </List>
        <Bottom>
          <Dialog open={importCSVOpen} onOpenChange={setImportCSVOpen}>
            <DialogTrigger asChild>
              <Button theme="light" icon={FiUpload}>
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent
              header
              title="Import CSV"
              description="Add personnel from a file here."
            >
              <DialogContainer>
                <UnorderedList>
                  <IconItem icon={FiCheckSquare}>
                    The file should be a Comma Separated Value (CSV) file
                  </IconItem>
                  <IconItem icon={FiCheckSquare}>
                    The first line in the file should be a comma-separated
                    header with columns labeled:
                    <CodeBlock>firstName,lastName,shift,badge</CodeBlock>
                  </IconItem>
                  <IconItem icon={FiCheckSquare}>
                    All other lines should contain comma-separated personnel
                    data corresponding to the columns in the header
                  </IconItem>
                </UnorderedList>
                <DialogActions>
                  <Button
                    onClick={importCSVOnClick}
                    theme="light"
                    icon={FiArrowRight}
                  >
                    Continue
                  </Button>
                </DialogActions>
              </DialogContainer>
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={importAlertDialogOpen}
            onOpenChange={setImportAlertDialogOpen}
          >
            <ImportAlertDialogContent
              header
              title={importStatus?.title}
              description={importStatus?.description}
            >
              {importStatus?.parseErrors?.length ? (
                <DialogScrollContainer>
                  <UnorderedList>
                    {importStatus.parseErrors.map((error) => (
                      <IconItem
                        key={error.id}
                        icon={FiAlertTriangle}
                      >{`Row ${error.row} - ${error.message}`}</IconItem>
                    ))}
                  </UnorderedList>
                </DialogScrollContainer>
              ) : null}
              <DialogActions>
                <AlertDialogAction asChild>
                  <Button
                    onClick={() => setImportStatus(null)}
                    icon={FiCheck}
                    theme="light"
                  >
                    Ok
                  </Button>
                </AlertDialogAction>
              </DialogActions>
            </ImportAlertDialogContent>
          </AlertDialog>
          <Button
            theme="light"
            icon={FiDownload}
            download="personnel.csv"
            href={downloadLink}
          >
            Export CSV
          </Button>
        </Bottom>
      </Content>
      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toastState.title}
          content={toastState.message}
        />
        <ToastViewport />
      </ToastProvider>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 32px 16px;

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  background-color: var(--color-gray-10);
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0px 8px;
    border-radius: 0;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 32px 48px;
`;

const RosterSearch = styled(SearchInput)`
  width: 256px;
`;

const RosterSelect = styled(Select)`
  width: 208px;
`;

const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 32px;
  width: 448px;
  color: var(--color-yellow-2);
`;

const DialogInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 512px;
`;

const DialogScrollContainer = styled.div`
  width: 544px;
  max-height: 200px;
  overflow-y: auto;
  padding: 16px 0px;

  scrollbar-color: var(--color-gray-5) var(--color-gray-10);
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 10px;
    background-color: var(--color-gray-10);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 999999px;
    border: 2px solid var(--color-gray-10);
    background-color: var(--color-gray-5);
  }
  ::-webkit-scrollbar-track {
    margin: 2px 0px;
  }
`;

const UnorderedList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  color: var(--color-gray-2);
  padding: 0 32px;
`;

const CodeBlock = styled.div`
  padding-left: 16px;
  color: var(--color-yellow-2);
`;

const DialogActions = styled.div`
  align-self: stretch;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 48px;
  color: var(--color-gray-2);
`;

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Name = styled.span`
  width: 256px;
`;

const List = styled.ul`
  flex: 1;
  width: 100%;
  list-style: none;
  padding-left: 0;

  overflow-y: scroll;
  scrollbar-color: var(--color-gray-5) var(--color-gray-10);
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 10px;
    background-color: var(--color-gray-10);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 999999px;
    border: 2px solid var(--color-gray-10);
    background-color: var(--color-gray-5);
  }
  ::-webkit-scrollbar-track {
    margin: 2px 0px;
  }
`;

const RemoveAlertDialogContent = styled(AlertDialogContent)`
  width: 512px;
`;

const ImportAlertDialogContent = styled(AlertDialogContent)`
  min-width: 384px;
  max-width: 640px;
`;

const AlertOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const Bottom = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 48px;
`;

export default Roster;
