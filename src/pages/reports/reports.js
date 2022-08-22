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
import UnstyledButton from "components/unstyled-button";
import Button from "components/button";

import { QUERIES } from "constants.js";

const selectValues = {
  newest: "newest",
  oldest: "oldest",
};

function Reports() {
  const [select, setSelect] = React.useState(selectValues.newest);

  return (
    <Wrapper>
      <Content>
        <Top>
          <Button theme="light" icon={FiSliders}>
            Filter
          </Button>
          <Select
            select={select}
            onValueChange={(select) => setSelect(select)}
            defaultValue={selectValues.newest}
            label="Sort"
          >
            <SelectItem value={selectValues.newest}>Newest first</SelectItem>
            <SelectItem value={selectValues.oldest}>Oldest first</SelectItem>
          </Select>
        </Top>
        <List></List>
        <Bottom>
          <Button theme="light" icon={FiDownload}>
            Export all
          </Button>
          <Button theme="light" icon={FiTrash2}>
            Delete all
          </Button>
          <UnstyledButton>
            <FiChevronLeft />
          </UnstyledButton>
          <UnstyledButton>
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
  padding: 72px 16px;

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
  height: 100px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 0 48px;
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
