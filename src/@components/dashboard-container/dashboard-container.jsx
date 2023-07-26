import * as React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

function DashboardContainer() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: calc(100% - 64px);
  max-width: 1200px;
  max-height: 800px;
  position: absolute;
  inset: 32px;
  margin: auto;
  background-color: var(--color-gray-10);
  border-radius: var(--border-radius);
`;

export default DashboardContainer;
