import * as React from "react";
import styled from "styled-components";
import {
  FiSliders,
  FiTrash2,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { Select, SelectItem } from "components/select";
import ListCheckbox from "components/list-checkbox";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import SearchInput from "components/search-input";
import { QUERIES } from "constants.js";

const selectValues = {
  newest: "newest",
  oldest: "oldest",
};

function Reports() {
  const [select, setSelect] = React.useState(selectValues.newest);
  const [checked, setChecked] = React.useState(false);

  return (
    <Wrapper>
      <Content>
        <Top>
          <ReportsSearch id="reports-search" placeholder="Location" />
          <Button theme="light" icon={FiSliders}>
            Filter
          </Button>
          <ReportsSelect
            select={select}
            onValueChange={(select) => setSelect(select)}
            defaultValue={selectValues.newest}
            label="Sort"
          >
            <SelectItem value={selectValues.newest}>Newest first</SelectItem>
            <SelectItem value={selectValues.oldest}>Oldest first</SelectItem>
          </ReportsSelect>
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
          <Button theme="light" icon={FiDownload}>
            Export all
          </Button>
          <Button theme="light" icon={FiTrash2}>
            Delete all
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

const ReportsSearch = styled(SearchInput)`
  width: 256px;
`;

const ReportsSelect = styled(Select)`
  width: 160px;
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

export default Reports;
