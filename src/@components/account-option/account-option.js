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
  flex-direction: column;
  background-color: var(--color-gray-10);
  border-radius: 8px;
  height: fit-content;
  width: 640px;
  padding: 24px;
`;

const Header = styled.div`
  flex: 1;
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${16 / 16}rem;
  color: var(--color-gray-3);
  margin-bottom: 24px;
  letter-spacing: 0.05em;
`;

const Content = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  gap: 16px;
`;

export default AccountOption;
