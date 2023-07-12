import * as React from "react";
import styled from "styled-components";
import { updateDoc } from "firebase/firestore";
import { FiX, FiSave, FiTrash } from "react-icons/fi";

import * as Select from "@components/select";
import TextInput from "@components/text-input";
import { useSnapshots } from "@context/snapshot-context";
import Button from "@components/button";
import * as Dialog from "@components/dialog";
import InputGroup from "@components/input-group";
import { range } from "@utils";

const disabledSelectValue = "No alerts";

function EditGroupDialogContent({
  groupData,
  groupId,
  userGroupData,
  closeDialog,
}) {
  const { snapshots } = useSnapshots();
  const [groupName, setGroupName] = React.useState(groupData.name);
  const [alertTime, setAlertTime] = React.useState(groupData.alert);

  // eslint-disable-next-line no-unused-vars
  const { [groupId]: _, ...newUserGroupData } = userGroupData;

  async function handleRemoveGroup(event) {
    event.preventDefault();
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...newUserGroupData,
      },
    });
    closeDialog();
  }

  async function handleSubmitChanges(event) {
    event.preventDefault();
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...userGroupData,
        [groupId]: {
          alert: alertTime,
          isVisible: true,
          name: groupName,
        },
      },
    });
    closeDialog();
  }

  return (
    <AccountForm
      onSubmit={handleSubmitChanges}
      style={Dialog.contentChildrenStyles}
    >
      <InputGroup>
        <TextInput
          id="group-name"
          labelText="Group name"
          type="text"
          required
          placeholder={groupData.name}
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
        />
        <Select.Root
          id="alert-time"
          value={alertTime ? alertTime.toString() : disabledSelectValue}
          onValueChange={(value) =>
            setAlertTime(
              value === disabledSelectValue ? 0 : parseInt(value, 10)
            )
          }
          label="Alert time"
          variant="dialog"
        >
          {range(0, 31, 5).map((rangeNumber, index) => {
            const value = rangeNumber
              ? rangeNumber.toString()
              : disabledSelectValue;
            return (
              <Select.Item key={index} value={value}>
                {value}
              </Select.Item>
            );
          })}
        </Select.Root>
      </InputGroup>
      <ButtonWrapper>
        <DeleteButton variant="tertiary" onClick={handleRemoveGroup}>
          <FiTrash />
          Delete Group
        </DeleteButton>
        <EditSubmitWrapper>
          <Dialog.Close asChild>
            <Button variant="secondary">
              <FiX />
              Cancel
            </Button>
          </Dialog.Close>
          <Button variant="primary">
            <FiSave />
            Save Changes
          </Button>
        </EditSubmitWrapper>
      </ButtonWrapper>
    </AccountForm>
  );
}

const AccountForm = styled.form`
  width: 576px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteButton = styled(Button)`
  position: relative;
  left: 16px;
`;

const EditSubmitWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

export default EditGroupDialogContent;
