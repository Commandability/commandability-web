import * as React from "react";
import styled from "styled-components";
import { updateDoc } from "firebase/firestore";
import { FiX, FiSave, FiTrash } from "react-icons/fi";

import * as Select from "@components/select";
import TextInput from "@components/text-input";
import { useSnapshots } from "@context/snapshot-context";
import Button from "@components/button";
import * as Dialog from "@components/dialog";

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
    closeDialog();
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
        <TextInput
          id="group-name"
          labelText="Group name"
          type="text"
          placeholder={groupData.name}
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
        />
        <Select.Root
          select={alertTime}
          label="Alert time"
          onValueChange={(alertTime) => setAlertTime(alertTime)}
          defaultValue={defaultAlert}
          aria-label="Alert time selector"
          variant="dialog"
        >
          <Select.Item value={selectValues.zero}>No alert</Select.Item>
          <Select.Item value={selectValues.five}>5</Select.Item>
          <Select.Item value={selectValues.ten}>10</Select.Item>
          <Select.Item value={selectValues.fifteen}>15</Select.Item>
          <Select.Item value={selectValues.twenty}>20</Select.Item>
          <Select.Item value={selectValues.twentyFive}>25</Select.Item>
          <Select.Item value={selectValues.thirty}>30</Select.Item>
        </Select.Root>
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditSubmitWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

export default EditGroupDialogContent;
