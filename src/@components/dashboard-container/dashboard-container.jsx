import * as React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

import { QUERIES } from "@constants";

function DashboardContainer() {
  return (
    <Wrapper>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  padding: 32px 16px;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  justify-items: center;
  align-items: center;

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0;
  }
`;

const Content = styled.div`
  width: 1200px;
  height: 800px;
  grid-row: 2;
  background-color: var(--color-gray-10);
  border-radius: var(--border-radius);

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0px 8px;
    border-radius: 0;
  }
`;

export default DashboardContainer;
