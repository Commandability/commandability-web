import React from "react";
import styled from "styled-components";

function AccountOption({ header, children, layout = "vertical" }) {
  return (
    <Wrapper layout={layout}>
      <Header>{header}</Header>
      <Content>{children}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: ${(props) =>
    props.layout === "horizontal" ? "row" : "column"};
  background-color: var(--color-gray-10);
  border-radius: 8px;
  height: fit-content;
  width: 640px;
  padding: 24px;
  gap: 24px;
  align-items: ${(props) =>
    props.layout === "horizontal" ? "baseline" : null};
`;

const Header = styled.header`
  flex: 1;
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${16 / 16}rem;
  color: var(--color-gray-3);
  letter-spacing: 0.05em;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  gap: 16px;
`;

export default AccountOption;
