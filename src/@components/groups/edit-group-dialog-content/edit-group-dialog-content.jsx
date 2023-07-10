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

const selectValues = {
  0: "No alert",
  5: "5",
  10: "10",
  15: "15",
  20: "20",
  25: "25",
  30: "30",
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
          select={alertTime}
          label="Alert time"
          onValueChange={(alertTime) => setAlertTime(alertTime)}
          defaultValue={
            groupData.alert ? groupData.alert.toString() : selectValues[0]
          }
          variant="dialog"
          id="alert-time"
        >
          {range(0, 35, 5).map((value, index) => {
            return (
              <Select.Item key={index} value={selectValues[value]}>
                {selectValues[value] ? selectValues[value] : "No alerts"}
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
