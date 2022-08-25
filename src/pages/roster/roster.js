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
import LabelInput from "components/label-input";
import ListCheckbox from "components/list-checkbox";
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

  const [name, setName] = React.useState("");

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
          <Dialog>
            <DialogTrigger asChild>
              <Button theme="light" icon={FiUserPlus}>
                Add Person
              </Button>
            </DialogTrigger>
            <DialogContent
              title="Add person"
              description="Add a new person to the roster here."
            >
              <DialogForm>
                <DialogLabelInput
                  id="name-input"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </DialogForm>
            </DialogContent>
          </Dialog>
        </Top>
        <ListHeader>
          <ListCheckbox
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
  justify-content: flex-end;
  width: 448px;
`;

const DialogLabelInput = styled(LabelInput)`
  width: 384px;
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
