import * as React from "react";
import styled from "styled-components";
import {
  FiUserPlus,
  FiSave,
  FiCheckSquare,
  FiTrash2,
  FiArrowRight,
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiUpload,
  FiDownload,
} from "react-icons/fi";
import * as Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import { useSnapshots } from "context/snapshot-context";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  unknownToastState,
} from "components/toast";
import * as Dialog from "components/dialog";
import * as AlertDialog from "components/alert-dialog";
import { Select, SelectItem } from "components/select";
import IconItem, { ItemContents } from "components/icon-item";
import TextInput from "components/text-input";
import Checkbox from "components/checkbox";
import Button from "components/button";
import VisuallyHidden from "components/visually-hidden";
import Spacer from "components/spacer";
import SearchInput from "components/search-input";
import RosterItem, { FallbackItem } from "components/roster-item";

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

function Roster() {
  const {
    snapshots: { user },
  } = useSnapshots();

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
    await updateDoc(user.ref, {
      personnel: arrayUnion(...personnel),
    });
  }

  async function onAddPersonSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !badge) return;

    setAddPersonOpen(false);
    resetAddPersonInputs();

    try {
      // Check if the person and firebase contain any personnel with duplicate badges
      const mergeDuplicates = user.data.personnel.some(
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
    await updateDoc(user.ref, {
      personnel: arrayRemove(...personnel),
    });
  }

  async function onRemovePersonnelAction() {
    setRemovePersonnelOpen(false);
    setCheckedAll(false);

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

  const openCSVFile = async () => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "text/csv";
      input.addEventListener("change", () => {
        resolve(input.files[0]);
      });
      input.click();
    });
  };

  async function importCSVOnClick() {
    setImportCSVOpen(false);

    try {
      const file = await openCSVFile();

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
          user.data.personnel.some(
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
          data: user.data?.personnel,
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
  }, [user]);

  const fallbackList = (
    <>
      <VisuallyHidden>Loading reports</VisuallyHidden>
      <List>
        {Array(25)
          .fill(null)
          .map((_, index) => (
            <FallbackItem key={index} />
          ))}
      </List>
    </>
  );

  return (
    <Wrapper>
      <Top>
        <RosterSearch
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="roster-search"
          placeholder="name, badge, shift"
          role="search"
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
        <Dialog.Root open={addPersonOpen} onOpenChange={setAddPersonOpen}>
          <Dialog.Trigger asChild>
            <Button>
              <FiUserPlus />
              <Spacer size={8} axis="horizontal" />
              Add person
            </Button>
          </Dialog.Trigger>
          <Dialog.Content
            header
            title="Add person"
            description="Add a new person to the roster here."
          >
            <DialogForm onSubmit={onAddPersonSubmit}>
              <DialogInputs>
                <TextInput
                  id="first-name-input"
                  labelText="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  errorText={firstName ? "" : "Please enter a first name"}
                />
                <TextInput
                  id="last-name-input"
                  labelText="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  errorText={lastName ? "" : "Please enter a last name"}
                />
                <TextInput
                  id="shift-input"
                  labelText="Shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                />
                <TextInput
                  id="badge-input"
                  labelText="Badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  errorText={badge ? "" : "Please enter a badge"}
                />
              </DialogInputs>
              <Button type="submit">
                <FiSave />
                <Spacer size={8} axis="horizontal" />
                Save person
              </Button>
            </DialogForm>
          </Dialog.Content>
        </Dialog.Root>
      </Top>
      <ListArea>
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
              <AlertDialog.Root
                open={removePersonnelOpen}
                onOpenChange={setRemovePersonnelOpen}
              >
                <AlertDialog.Trigger asChild>
                  <Button variant="tertiary">
                    <FiTrash2 />
                    <Spacer size={8} axis="horizontal" />
                    Delete personnel
                  </Button>
                </AlertDialog.Trigger>
                <RemoveAlertDialogContent
                  header
                  title="Are you absolutely sure?"
                  description="This action cannot be undone. This will permanently delete the selected personnel from your account."
                >
                  <AlertOptions>
                    <AlertDialog.Cancel asChild>
                      <Button variant="secondary">
                        <FiX />
                        <Spacer size={8} axis="horizontal" />
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button onClick={onRemovePersonnelAction}>
                        <FiCheck />
                        <Spacer size={8} axis="horizontal" />
                        Yes, delete personnel
                      </Button>
                    </AlertDialog.Action>
                  </AlertOptions>
                </RemoveAlertDialogContent>
              </AlertDialog.Root>
            )}
            {checkedItems.length === 0 ? <span>Shift</span> : null}
          </Group>
          {checkedItems.length === 0 ? <span>Badge</span> : null}
        </ListHeader>
        <List aria-live="polite" aria-atomic="true">
          {user.status === "resolved"
            ? [...user.data.personnel]
                .filter((person) => personFilter(person))
                .sort((firstPerson, secondPerson) =>
                  sortFunction(firstPerson, secondPerson)
                )
                .map((person) => (
                  <RosterItem
                    key={person.badge}
                    person={person}
                    checkedAll={checkedAll}
                    setCheckedAll={setCheckedAll}
                    setCheckedItems={setCheckedItems}
                  />
                ))
            : fallbackList}
        </List>
      </ListArea>
      <Bottom>
        <Dialog.Root open={importCSVOpen} onOpenChange={setImportCSVOpen}>
          <Dialog.Trigger asChild>
            <Button>
              <FiUpload />
              <Spacer size={8} axis="horizontal" />
              Import CSV
            </Button>
          </Dialog.Trigger>
          <Dialog.Content
            header
            title="Import CSV"
            description="Add personnel from a file here."
          >
            <DialogContainer>
              <UnorderedList>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    The file should be a Comma Separated Value (CSV) file
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    The first line in the file should be a comma-separated
                    header with columns labeled:
                    <CodeBlock>firstName,lastName,shift,badge</CodeBlock>
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    All other lines should contain comma-separated personnel
                    data corresponding to the columns in the header
                  </ItemContents>
                </IconItem>
              </UnorderedList>
              <DialogActions>
                <Button onClick={importCSVOnClick}>
                  <FiArrowRight />
                  <Spacer size={8} axis="horizontal" />
                  Continue
                </Button>
              </DialogActions>
            </DialogContainer>
          </Dialog.Content>
        </Dialog.Root>
        <AlertDialog.Root
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
                    <IconItem key={error.id}>
                      <FiAlertTriangle />
                      <ItemContents>{`Row ${error.row} - ${error.message}`}</ItemContents>
                    </IconItem>
                  ))}
                </UnorderedList>
              </DialogScrollContainer>
            ) : null}
            <DialogActions>
              <AlertDialog.Action asChild>
                <Button onClick={() => setImportStatus(null)}>
                  <FiCheck />
                  <Spacer size={8} axis="horizontal" />
                  Ok
                </Button>
              </AlertDialog.Action>
            </DialogActions>
          </ImportAlertDialogContent>
        </AlertDialog.Root>
        <Button download="personnel.csv" href={downloadLink}>
          <FiDownload />
          <Spacer size={8} axis="horizontal" />
          Export CSV
        </Button>
      </Bottom>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

const ListArea = styled.div`
  flex: 1;

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

const ListHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px 48px;
  background-color: var(--color-gray-10);
  color: var(--color-gray-2);
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Name = styled.span`
  width: 256px;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  isolation: isolate;
`;

const RemoveAlertDialogContent = styled(AlertDialog.Content)`
  width: 512px;
`;

const ImportAlertDialogContent = styled(AlertDialog.Content)`
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
  min-height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 48px;
`;

export default Roster;
