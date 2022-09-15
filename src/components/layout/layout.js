import * as React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { zeroRightClassName } from "react-remove-scroll-bar";

import MainNav from "components/main-nav";

function Layout() {
  return (
    <Main>
      <MainNav />
      <Background
        /* 
          zeroRightClassName makes sure any fixed position elements have their right position modified
          to match the original right position before the scroll bar is removed
          https://github.com/theKashey/react-remove-scroll-bar#the-right-border
        */
        className={zeroRightClassName}
      />
      <Wrapper>
        <Outlet />
      </Wrapper>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;

const Background = styled.div`
  width: 100%;
  height: calc(100% - 72px);
  position: fixed;
  top: 72px;
  background-image: radial-gradient(
      circle at 104% calc(92% + 72px),
      hsl(360 54% 32% / 0.6),
      hsl(360 48% 32% / 0.6),
      hsl(360 14% 12% / 0.6),
      hsl(360 14% 8% / 0.6),
      hsl(360 8% 2% / 0.6)
    ),
    radial-gradient(
      circle at 104% calc(8% + 72px),
      hsl(15 54% 32%),
      hsl(15 48% 32%),
      hsl(360 14% 12%),
      hsl(360 14% 8%),
      hsl(360 8% 2%)
    );
`;

const Wrapper = styled.div`
  position: relative;
  top: 72px;
  width: 100%;
  height: calc(100% - 72px);
`;

export default Layout;
