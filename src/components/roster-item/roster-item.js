import * as React from "react";
import styled from "styled-components";
import { FiEdit } from "react-icons/fi";
import { arrayUnion, arrayRemove } from "firebase/firestore";

import { useFirestoreUser } from "context/firestore-user-context";
import Checkbox from "components/checkbox";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import TextInput from "components/text-input";
import Button from "components/button";

function RosterItem({
  setCheckedItems,
  checkedAll,
  setCheckedAll,
  person,
  setToastOpen,
  setToastState,
  ...props
}) {
  const { status, origin } = checkedAll;

  const { userRef, firestoreUser, writeBatch } = useFirestoreUser();

  const [checked, setChecked] = React.useState(false);

  const [editPersonOpen, setEditPersonOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState(person.firstName);
  const [lastName, setLastName] = React.useState(person.lastName);
  const [shift, setShift] = React.useState(person.shift);
  const [badge, setBadge] = React.useState(person.badge);

  const unknownToastState = {
    title: "Unknown error",
    message: "Try again later or contact support.",
  };

  function resetEditPersonInputs() {
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setShift(person.shift);
    setBadge(person.badge);
  }

  React.useEffect(() => {
    // Check item when checkedAll is checked
    if (status) {
      setChecked(true);
      setCheckedItems((checkedItems) => [...checkedItems, person]);
      // Uncheck item when checkedAll is unchecked, but not when a single person has been unchecked
    } else if (origin !== "list") {
      setChecked(false);
      setCheckedItems((checkedItems) =>
        checkedItems.filter((item) => item !== person)
      );
    }
  }, [status, origin, setCheckedItems, person]);

  async function editPerson(firstName, lastName, shift, badge) {
    const batch = writeBatch();
    batch.update(userRef, { personnel: arrayRemove(person) });
    batch.update(userRef, {
      personnel: arrayUnion({ firstName, lastName, shift, badge }),
    });
    await batch.commit();
  }

  async function onEditPersonSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !badge) return;

    setEditPersonOpen(false);
    resetEditPersonInputs();

    try {
      // Check if the person and firebase contain any personnel with duplicate badges
      let mergeDuplicates = false;
      if (person.badge !== badge) {
        mergeDuplicates = firestoreUser.data.personnel.some(
          (person) => person.badge === badge
        );
      }

      if (mergeDuplicates) {
        setToastState({
          title: "Failed to edit person",
          message:
            "Make sure there are no other personnel in the roster with the same badge.",
        });
      } else {
        await editPerson(firstName, lastName, shift, badge);
        setToastState({
          title: "Person edited successfully",
          message: "The roster reflects all changes to the selected person.",
        });
      }
    } catch (error) {
      setToastState(unknownToastState);
    }

    setToastOpen(true);
  }

  return (
    <Wrapper data-checked={checked ? "true" : "false"} {...props}>
      <Dialog
        open={editPersonOpen}
        onOpenChange={(editPersonOpen) => {
          setEditPersonOpen(editPersonOpen);

          resetEditPersonInputs();
        }}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          header
          title="Edit person"
          description="Edit the selected person in the roster here."
        >
          <DialogForm onSubmit={onEditPersonSubmit}>
            <DialogInputs>
              <TextInput
                id="first-name-input"
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={firstName ? "" : "Please enter a first name"}
              />
              <TextInput
                id="last-name-input"
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={lastName ? "" : "Please enter a last name"}
              />
              <TextInput
                id="shift-input"
                label="Shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              />
              <TextInput
                id="badge-input"
                label="Badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                error={badge ? "" : "Please enter a badge"}
              />
            </DialogInputs>
            <Button type="submit" theme="light" icon={FiEdit}>
              Edit Person
            </Button>
          </DialogForm>
        </DialogContent>
      </Dialog>
      <Group>
        <Checkbox
          label="Select"
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(checked);

            if (checked) {
              setCheckedItems((checkedItems) => [...checkedItems, person]);
            } else {
              setCheckedItems((checkedItems) =>
                checkedItems.filter((item) => item !== person)
              );

              // Disable checked all when a single person has been unchecked
              setCheckedAll({ status: false, origin: "list" });
            }
          }}
        />
        <Name>
          {person.firstName} {person.lastName}
        </Name>
        {person.shift}
      </Group>
      {person.badge}
    </Wrapper>
  );
}

const Wrapper = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 16px 48px;
  border-bottom: 1px solid var(--color-gray-9);
  background-color: var(--color-white);
  color: var(--color-gray-4);
  // Prevent height: 1px and position: absolute in VisuallyHidden in CheckBox
  // from stacking outside root html element and causing vertical overflow
  position: relative;

  &[data-checked="true"] {
    background-color: var(--color-gray-8);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-gray-8);
    }
  }
`;

const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 32px;
  width: 448px;
  color: var(--color-yellow-2);
`;

const DialogInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Name = styled.div`
  width: 256px;
`;

export default RosterItem;
