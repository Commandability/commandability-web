import React from "react";
import styled from "styled-components";

function AccountOption({ header, children }) {
  return (
    <Wrapper>
      <Header>{header}</Header>
      <Content>{children}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  background-color: var(--color-gray-10);
  border-radius: 8px;
  height: fit-content;
  width: 640px;
  padding: 32px;
`;

const Header = styled.div`
  flex: 1;
  color: var(--color-red-3);
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${20 / 16}rem;
`;

const Content = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default AccountOption;
