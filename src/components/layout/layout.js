import * as React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

import MainNav from "components/main-nav";

function Layout() {
  return (
    <Main>
      <MainNav />
      <Wrapper>
        <Outlet />
      </Wrapper>
    </Main>
  );
}

const Main = styled.main`
  min-height: 100%;
  background-image: radial-gradient(
    circle at -8% calc(24% + 72px),
    hsl(360, 8%, 2%),
    hsl(360, 14%, 8%),
    hsl(360, 14%, 12%),
    hsl(15, 48%, 32%),
    hsl(360, 54%, 32%)
  );
`;

const Wrapper = styled.div`
  position: relative;
  top: 72px;
  width: 100%;
`;

export default Layout;
