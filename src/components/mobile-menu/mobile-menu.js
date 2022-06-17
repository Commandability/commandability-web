/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
import { DialogOverlay, DialogContent } from "@reach/dialog";

import SmoothScrollTo from "components/smooth-scroll-to";

const MobileMenu = ({ isOpen, onDismiss, tabInView }) => {
  return (
    <Overlay isOpen={isOpen} onDismiss={onDismiss}>
      <Content aria-label="Menu">
        <Tab targetId="home" inView={tabInView === "home" ? true : false}>
          Home
        </Tab>
        <Tab
          targetId="features"
          inView={tabInView === "features" ? true : false}
        >
          Features
        </Tab>
        <Tab
          targetId="how-it-works"
          inView={tabInView === "how-it-works" ? true : false}
        >
          How it works
        </Tab>
        <Tab targetId="contact" inView={tabInView === "contact" ? true : false}>
          Contact
        </Tab>
      </Content>
    </Overlay>
  );
};

const Overlay = styled(DialogOverlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-backdrop);
  display: flex;
  justify-content: flex-end;
`;

const Content = styled(DialogContent)`
  background: white;
  width: 300px;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Tab = styled(SmoothScrollTo)`
  color: var(--color-gray-);
  text-decoration: none;
  font-size: 1.125rem;
  text-transform: uppercase;

  &:first-of-type {
    color: var(--color-secondary);
  }
`;

const Filler = styled.div`
  flex: 1;
`;

export default MobileMenu;
