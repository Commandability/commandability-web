import * as React from "react";
import styled from "styled-components";
import { Outlet, ScrollRestoration } from "react-router-dom";

import Skip from "components/skip";
import MainNav from "components/main-nav";
import HeroImage from "components/hero-image";

function Layout({ type, children }) {
  return (
    <Wrapper>
      <header>
        <Skip href={"#main"} />
        <MainNav />
      </header>
      <HeroImage blur>
        <Main id="main">{type === "outlet" ? <Outlet /> : children}</Main>
      </HeroImage>
      <ScrollRestoration />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
`;

const Main = styled.main`
  position: relative;
  top: 72px;
  width: 100%;
  height: calc(100% - 72px);
`;

export default Layout;
