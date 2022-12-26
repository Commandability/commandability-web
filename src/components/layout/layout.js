import * as React from "react";
import styled from "styled-components";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { zeroRightClassName } from "react-remove-scroll-bar";

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
      <PositionedHeroImage blur className={zeroRightClassName} />
      <Main id="main">{type === "outlet" ? <Outlet /> : children}</Main>
      <ScrollRestoration />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
`;

const PositionedHeroImage = styled(HeroImage)`
  position: fixed;
  width: 100%;
`;

const Main = styled.main`
  position: relative;
  top: 72px;
  width: 100%;
  height: calc(100% - 72px);
`;

export default Layout;
