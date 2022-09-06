import * as React from "react";
import styled from "styled-components";
import {
  FiUserPlus,
  FiUpload,
  FiCheckSquare,
  FiArrowRight,
  FiAlertTriangle,
  FiCheck,
  FiDownload,
} from "react-icons/fi";
import * as Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";

import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
} from "components/alert-dialog";
import { Select, SelectItem } from "components/select";
import IconItem from "components/icon-item";
import TextInput from "components/text-input";
import Checkbox from "components/checkbox";
import Button from "components/button";
import SearchInput from "components/search-input";
import { QUERIES } from "constants.js";

const selectValues = {
  alphabetical: "alphabetical",
  badgeNumber: "badge number",
};

function Roster() {
  const [selectSort, setSelectSort] = React.useState(selectValues.newest);
  const [checkedAll, setCheckedAll] = React.useState(false);

  const [addPersonOpen, setAddPersonOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [shift, setShift] = React.useState("");
  const [badge, setBadge] = React.useState("");

  const [importCSVOpen, setImportCSVOpen] = React.useState(false);
  const [importAlertDialogOpen, setImportAlertDialogOpen] =
    React.useState(false);
  const [importStatus, setImportStatus] = React.useState(null);

  function onImportAlertDialogActionClick() {
    setImportStatus(null);
  }

  function addPersonnel(personnelList) {}

  function addPersonSubmit(e) {
    e.preventDefault();
    addPersonnel();
    setAddPersonOpen(false);
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
      const personnelList = await Papa.parse(contents, {
        header: true,
        skipEmptyLines: true,
      });

      if (personnelList.errors?.length) {
        setImportStatus({
          parseErrors: personnelList.errors.map((error) => ({
            ...error,
            id: uuidv4(),
          })),
          title: "Import failed",
          description: "Resolve all formatting issues in the CSV file.",
        });
      } else {
        addPersonnel(personnelList);
        setImportStatus({
          title: "Import successful",
          description: "All CSV files were successfully imported.",
        });
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      setImportStatus({
        title: "Import failed",
        description: "Try again later or contact support.",
      });
    }

    setImportAlertDialogOpen(true);
  }

  async function parseCSVAndExport(personnelList) {}

  return (
    <Wrapper>
      <Content>
        <Top>
          <RosterSearch id="roster-search" placeholder="name, badge, shift" />
          <RosterSelect
            select={selectSort}
            onValueChange={(select) => setSelectSort(select)}
            defaultValue={selectValues.alphabetical}
            label="Sort"
          >
            <SelectItem value={selectValues.alphabetical}>
              Alphabetical (a-z)
            </SelectItem>
            <SelectItem value={selectValues.badgeNumber}>
              Badge Number
            </SelectItem>
          </RosterSelect>
          <Dialog open={addPersonOpen} onOpenChange={setAddPersonOpen}>
            <DialogTrigger asChild>
              <Button theme="light" icon={FiUserPlus}>
                Add Person
              </Button>
            </DialogTrigger>
            <DialogContent
              title="Add person"
              description="Add a new person to the roster here."
            >
              <DialogForm onSubmit={addPersonSubmit}>
                <DialogInputs>
                  <TextInput
                    id="first-name-input"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextInput
                    id="last-name-input"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  />
                </DialogInputs>
                <Button
                  type="submit"
                  onClick={addPersonSubmit}
                  theme="light"
                  icon={FiUserPlus}
                >
                  Add Person
                </Button>
              </DialogForm>
            </DialogContent>
          </Dialog>
        </Top>
        <ListHeader>
          <Checkbox
            label="Select all"
            checked={checkedAll}
            onCheckedChange={(checked) => setCheckedAll(checked)}
          />
        </ListHeader>
        <List></List>
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
                    header with columns labeled:{" "}
                    <Highlight>LAST_NAME,FIRST_NAME,SHIFT,BADGE</Highlight>
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
            <AlertDialogContent
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
                    onClick={onImportAlertDialogActionClick}
                    icon={FiCheck}
                    theme="light"
                  >
                    Ok
                  </Button>
                </AlertDialogAction>
              </DialogActions>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={parseCSVAndExport} theme="light" icon={FiDownload}>
            Export CSV
          </Button>
        </Bottom>
      </Content>
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

  scrollbar-color: var(--color-gray-5) var(--color-white);
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 10px;
    background-color: var(--color-white);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 999999px;
    border: 2px solid var(--color-white);
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

const Highlight = styled.span`
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
  padding: 8px 48px;
`;

const List = styled.div`
  flex: 1;
  width: 100%;
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
