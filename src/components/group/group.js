import * as React from "react";
import styled from "styled-components";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import { updateDoc } from "firebase/firestore";

import Spacer from "components/spacer";
import UnstyledButton from "components/unstyled-button";
import EditGroupDialogContent from "components/edit-group-dialog-content";
import { useSnapshots } from "context/snapshot-context";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
} from "components/alert-dialog";

function Group({ groupData, groupId, userGroupData }) {
  const { snapshots } = useSnapshots();
  const [editGroupOpen, setEditGroupOpen] = React.useState(false);
  const [removeGroupOpen, setRemoveGroupOpen] = React.useState(false);
  const { [groupId]: _, ...newUserGroupData } = userGroupData;

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

  async function handleRemoveGroup(event) {
    event.preventDefault();
    console.log(newUserGroupData);
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...newUserGroupData,
      },
    });
    setRemoveGroupOpen(false);
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
        <AlertDialog open={removeGroupOpen} onOpenChange={setRemoveGroupOpen}>
          <AlertDialogTrigger asChild>
            <CloseButton>
              <VisuallyHidden>Close</VisuallyHidden>
              <FiX />
            </CloseButton>
          </AlertDialogTrigger>
          <GroupRemoveAlertDialogContent
            header
            title="Remove selected group?"
            description="This action cannot be undone. This will remove the currently selected group."
          >
            <AlertOptions>
              <AlertDialogCancel asChild>
                <Button icon={FiX} variant="secondary">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button type="submit" icon={FiCheck} onClick={handleRemoveGroup}>
                Yes, delete group
              </Button>
            </AlertOptions>
          </GroupRemoveAlertDialogContent>
        </AlertDialog>
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

const CloseButton = styled(UnstyledButton)`
  display: none;
  position: absolute;
  // The icon is 16px but its width and height are 24px for the hover circle size, so remove 8px to align with 24px padding
  top: calc(24px - 8px);
  right: calc(24px - 8px);
  width: 24px;
  height: 24px;
  border-radius: 100%;
  place-content: center;
  color: var(--color-yellow-2);
  @media (hover: hover) and (pointer: fine) {
    ${EditGroupButton}:hover+& {
      display: grid;
    }
    &:hover {
      display: grid;
      background-color: var(--color-yellow-9);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const GroupRemoveAlertDialogContent = styled(AlertDialogContent)`
  width: 512px;
`;

const AlertOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;
export default Group;
