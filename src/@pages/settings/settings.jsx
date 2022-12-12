import * as React from "react";
import styled from "styled-components";

import AccountOption from "components/account-option";

function Settings() {
  return (
    <Wrapper>
      <Header>Account</Header>
      <Options>
        <AccountOption header="General"></AccountOption>
        <AccountOption header="Password"></AccountOption>
        <AccountOption header="Delete"></AccountOption>
      </Options>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const Header = styled.div`
  font-size: ${48 / 16}rem;
  color: var(--color-gray-10);
  width: 640px;
  margin: 48px 0px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default Settings;
