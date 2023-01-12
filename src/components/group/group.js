import * as React from "react";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import { updateDoc } from "firebase/firestore";
import { FiChevronRight } from "react-icons/fi";

import Spacer from "components/spacer";
import UnstyledButton from "components/unstyled-button";
import EditGroupDialogContent from "components/edit-group-dialog-content";
import { useSnapshots } from "context/snapshot-context";

function Group({ groupData, groupId, userGroupData }) {
  const { snapshots } = useSnapshots();
  const [editGroupOpen, setEditGroupOpen] = React.useState(false);

  async function handleAddGroup() {
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...userGroupData,
        [groupId]: {
          alert: 15,
          isVisible: true,
          name: groupId.replace("_", " "),
        },
      },
    });
  }

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
        <Dialog open={editGroupOpen} onOpenChange={setEditGroupOpen}>
          <DialogTrigger asChild>
            <EditGroupButton type="button" />
          </DialogTrigger>
          <DialogContent
            header
            title="Edit Group"
            description="Edit the group display name and alert time."
          >
            <EditGroupDialogContent
              groupData={groupData}
              groupId={groupId}
              userGroupData={userGroupData}
              closeDialog={() => setEditGroupOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <ConfigureTab>
          <ConfigureText>configure</ConfigureText>
          <FiChevronRight />
        </ConfigureTab>
      </Content>
    );
  } else if (active === false) {
    groupContent = (
      <AddGroupButton type="button" onClick={handleAddGroup}>
        <Text>Add group</Text>
        <Spacer size={6} axis="horizontal" />
        <FiPlus />
      </AddGroupButton>
    );
  }
  return <Wrapper>{groupContent}</Wrapper>;
}

const Wrapper = styled.li`
  height: 324px;
  width: 292px;
  border-radius: 8px;
  display: flex;
  position: relative;
  box-shadow: var(--box-shadow);
  background-color: var(--color-white);
  overflow: hidden;
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
  justify-content: center;
  align-items: center;
  color: var(--color-gray-4);
  font-size: ${20 / 16}rem;
`;

const AlertWrapper = styled.div`
  display: flex;
  height: 36px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
`;

const AlertTime = styled.h2`
  font-size: ${24 / 16}rem;
  font-weight: bold;
  color: var(--color-yellow-3);
  line-height: 1;
`;

const AlertText = styled.h2`
  color: var(--color-gray-4);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  line-height: 1;
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

const ConfigureTab = styled.div`
  display: flex;
  position: absolute;
  transition: 0.25s;
  bottom: -30px;
  height: 48px;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: var(--color-yellow-3);
  pointer-events: none;
  @media (hover: hover) and (pointer: fine) {
    ${EditGroupButton}:hover ~ & {
      transition: 0.25s;
      bottom: 10px;
    }
  }
`;

const ConfigureText = styled.div`
  font-size: ${16 / 16}rem;
  font-weight: bold;
  text-transform: uppercase;
`;

export default Group;
