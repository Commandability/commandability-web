import * as React from "react";
import styled from "styled-components";
import { updateDoc } from "firebase/firestore";
import { FiX, FiSave, FiTrash } from "react-icons/fi";

import * as Select from "components/select";
import { useSnapshots } from "context/snapshot-context";
import Button from "components/button";
import * as Dialog from "components/dialog";

const selectValues = {
  zero: "No alert",
  five: "5",
  ten: "10",
  fifteen: "15",
  twenty: "20",
  twentyFive: "25",
  thirty: "30",
};

function EditGroupDialogContent({
  groupData,
  groupId,
  userGroupData,
  closeDialog,
}) {
  const { snapshots } = useSnapshots();
  const [groupName, setGroupName] = React.useState(groupData.name);
  const [alertTime, setAlertTime] = React.useState(groupData.alert);

  let defaultAlert = selectValues.zero;
  if (groupData.alert !== 0) {
    defaultAlert = groupData.alert.toString();
  }

  const { [groupId]: _, ...newUserGroupData } = userGroupData;

  async function handleRemoveGroup(event) {
    event.preventDefault();
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...newUserGroupData,
      },
    });
  }

  async function handleSubmitChanges(event) {
    event.preventDefault();
    let alertSubmit = 0;
    if (alertTime !== "No alert") {
      alertSubmit = parseInt(alertTime, 10);
    }
    await updateDoc(snapshots.user.ref, {
      groups: {
        ...userGroupData,
        [groupId]: {
          alert: alertSubmit,
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
      <FormInputs>
        <InputGroup>
          <Label htmlFor="group-name">Group name</Label>
          <Input
            id="group-name"
            type="text"
            required
            placeholder={groupData.name}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            value={groupName}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="alert-time">Alert time</Label>
          <div style={{ width: "280px" }}>
            <Select.Root
              select={alertTime}
              onValueChange={(alertTime) => setAlertTime(alertTime)}
              defaultValue={defaultAlert}
              aria-label="Alert time selector"
            >
              <Select.Item value={selectValues.zero}>No alert</Select.Item>
              <Select.Item value={selectValues.five}>5</Select.Item>
              <Select.Item value={selectValues.ten}>10</Select.Item>
              <Select.Item value={selectValues.fifteen}>15</Select.Item>
              <Select.Item value={selectValues.twenty}>20</Select.Item>
              <Select.Item value={selectValues.twentyFive}>25</Select.Item>
              <Select.Item value={selectValues.thirty}>30</Select.Item>
            </Select.Root>
          </div>
        </InputGroup>
      </FormInputs>
      <ButtonWrapper>
        <Button variant="tertiary" onClick={handleRemoveGroup}>
          <FiTrash />
          Delete Group
        </Button>
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

const FormInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 16px;
`;

const Label = styled.label`
  color: var(--color-yellow-2);
`;

const Input = styled.input`
  padding: 8px 12px;
  border: solid 1px var(--color-gray-5);
  border-radius: 8px;
  width: 280px;

  &::placeholder {
    color: var(--color-gray-5);
  }

  &:focus-visible {
    outline: solid 2px var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditSubmitWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

export default EditGroupDialogContent;
