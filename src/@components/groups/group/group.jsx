import * as React from "react";
import styled, { css } from "styled-components";
import { FiPlus } from "react-icons/fi";
import { updateDoc } from "firebase/firestore";

import * as Dialog from "@components/dialog";
import Spacer from "@components/spacer";
import UnstyledButton from "@components/unstyled-button";
import EditGroupDialogContent from "@components/groups/edit-group-dialog-content";
import { useSnapshots } from "@context/snapshot-context";
import * as Fallback from "@components/fallback";

function Group({
  groupData,
  groupId,
  userGroupData,
  snapshotStatus,
  ...props
}) {
  const { snapshots } = useSnapshots();
  const [editGroupOpen, setEditGroupOpen] = React.useState(false);

  async function handleAddGroup() {
    setEditGroupOpen(true);
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

  if (snapshotStatus === "pending") {
    groupContent = (
      <>
        <GroupFallback />
      </>
    );
  } else {
    if (active === true) {
      groupContent = (
        <>
          <Dialog.Root open={editGroupOpen} onOpenChange={setEditGroupOpen}>
            <Dialog.Trigger asChild>
              <EditGroupButton>
                <Heading>{groupData.name}</Heading>
                <AlertWrapper>
                  <AlertTime>{alertTime === 0 ? "" : alertTime}</AlertTime>
                  <AlertText>
                    {alertTime === 0 ? "No alerts" : "minutes"}
                  </AlertText>
                </AlertWrapper>
              </EditGroupButton>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay>
                <Dialog.Content
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
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      );
    } else if (active === false) {
      groupContent = (
        <AddGroupButton onClick={handleAddGroup}>
          <Text>Add group</Text>
          <Spacer size={6} axis="horizontal" />
          <FiPlus />
        </AddGroupButton>
      );
    }
  }
  return <Wrapper {...props}>{groupContent}</Wrapper>;
}

const Wrapper = styled.li`
  position: relative;
  height: clamp(124px, 45vh - 124px, 1200px);
  width: clamp(192px, 45vw - 192px, 292px);
  display: flex;
  box-shadow: var(--box-shadow);
  background-color: var(--color-white);
  border-radius: var(--border-radius);
  padding: 4px;

  &:hover {
    background-image: linear-gradient(
      135deg,
      var(--color-yellow-3),
      var(--color-yellow-5)
    );
  }
`;

const GroupFallback = styled.div`
  ${Fallback.html}
  height: 324px;
  width: 292px;
  border-radius: var(--border-radius);
`;

const Heading = styled.h1`
  justify-content: center;
  align-items: center;
  color: var(--color-gray-4);
  font-size: ${20 / 16}rem;
`;

const AlertWrapper = styled.dl`
  min-height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
  gap: 6px;
`;

const AlertTime = styled.dd`
  font-size: ${24 / 16}rem;
  font-weight: bold;
  color: var(--color-yellow-3);
`;

const AlertText = styled.dt`
  color: var(--color-gray-4);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  line-height: 36px;
`;

const groupButton = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--border-radius) / 2);
  background-color: var(--color-white);

  & > svg {
    stroke-width: 0.2rem;
    color: var(--color-yellow-3);
  }
`;

const EditGroupButton = styled(UnstyledButton)`
  ${groupButton}
  flex-direction: column;
`;

const AddGroupButton = styled(UnstyledButton)`
  ${groupButton}
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
  font-size: ${16 / 16}rem;
  font-weight: bold;
  color: var(--color-gray-4);
`;

export default Group;
