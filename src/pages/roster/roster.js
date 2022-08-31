import * as React from "react";
import styled from "styled-components";
import {
  FiUserPlus,
  FiUpload,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import { Select, SelectItem } from "components/select";
import TextInput from "components/text-input";
import Checkbox from "components/checkbox";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import SearchInput from "components/search-input";
import { QUERIES } from "constants.js";

const selectValues = {
  alphabetical: "alphabetical",
  badgeNumber: "badge number",
};

function Roster() {
  const [select, setSelect] = React.useState(selectValues.newest);
  const [checked, setChecked] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [shift, setShift] = React.useState("");
  const [badge, setBadge] = React.useState("");

  function addPersonSubmit(e) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <Wrapper>
      <Content>
        <Top>
          <RosterSearch id="roster-search" placeholder="Name, badge, shift" />
          <RosterSelect
            select={select}
            onValueChange={(select) => setSelect(select)}
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
          <Dialog open={open} onOpenChange={setOpen}>
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
            checked={checked}
            onCheckedChange={(checked) => setChecked(checked)}
          />
        </ListHeader>
        <List></List>
        <Bottom>
          <Button theme="light" icon={FiUpload}>
            Import
          </Button>
          <Button theme="light" icon={FiDownload}>
            Export all
          </Button>
          <UnstyledButton>
            <VisuallyHidden>Page left</VisuallyHidden>
            <FiChevronLeft />
          </UnstyledButton>
          <UnstyledButton>
            <VisuallyHidden>Page right</VisuallyHidden>
            <FiChevronRight />
          </UnstyledButton>
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
`;

const DialogInputs = styled.div`
  display: flex;
  flex-direction: column;
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
