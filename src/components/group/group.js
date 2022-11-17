import * as React from "react";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";

import Spacer from "components/spacer";
import UnstyledButton from "components/unstyled-button";

function Group({ groupData }) {
  let active;
  let alertTime = 0;
  if (groupData === null) {
    active = false;
  } else {
    active = groupData.isVisible;
    alertTime = groupData.alert;
  }
  let groupContent;
  if (active === true) {
    groupContent = (
      <Content>
        <Heading>{groupData.name}</Heading>
        <AlertWrapper>
          <AlertTime>{alertTime === 0 ? "" : alertTime}</AlertTime>
          <AlertText>{alertTime === 0 ? "No alerts" : "Minutes"}</AlertText>
        </AlertWrapper>
        <EditGroupButton
          type="button"
          onClick={() => {
            console.log("Edit Group");
          }}
        />
      </Content>
    );
  } else if (active === false) {
    groupContent = (
      <AddGroupButton
        type="button"
        onClick={() => {
          console.log("Add Group");
        }}
      >
        <Text>Add group</Text>
        <Spacer size={6} axis="horizontal" />
        <FiPlus />
      </AddGroupButton>
    );
  }
  return <Wrapper>{groupContent}</Wrapper>;
}

const Wrapper = styled.li`
  height: 268px;
  width: 292px;
  border-radius: 8px;
  display: flex;
  box-shadow: var(--box-shadow);
  background-color: var(--color-white);
  &:hover {
    background-color: var(--color-gray-9);
  }
  & > :active {
    box-shadow: none;
    border-color: red;
  }
`;

const Content = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const Heading = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-gray-4);
  font-size: ${20 / 16}rem;
  text-transform: uppercase;
`;

const AlertWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
`;

const AlertTime = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: bold;
  color: var(--color-yellow-3);
`;

const AlertText = styled.h2`
  color: var(--color-gray-4);
  font-size: ${16 / 16}rem;
  font-weight: bold;
`;

const EditGroupButton = styled(UnstyledButton)`
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const AddGroupButton = styled(UnstyledButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  & > svg {
    stroke-width: 0.2rem;
    color: var(--color-yellow-3);
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
  font-size: ${16 / 16}rem;
  font-weight: bold;
`;

export default Group;
