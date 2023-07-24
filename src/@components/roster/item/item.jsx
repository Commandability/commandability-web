import * as React from "react";
import styled from "styled-components";
import { writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import { FiAlertTriangle, FiCheck, FiX, FiSave } from "react-icons/fi";

import { useSnapshots } from "@context/snapshot-context";
import * as Toast from "@components/toast";
import * as Dialog from "@components/dialog";
import TextInput from "@components/text-input";
import Checkbox from "@components/checkbox";
import Button from "@components/button";
import UnstyledButton from "@components/unstyled-button";
import Stack from "@components/stack";

function Item({
  setCheckedItems,
  checkedAll,
  setCheckedAll,
  person,
  setToastOpen,
  setToastState,
  ...props
}) {
  const { status, origin } = checkedAll;

  const [checked, setChecked] = React.useState(false);

  const {
    db,
    snapshots: { user },
  } = useSnapshots();

  const [editPersonOpen, setEditPersonOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState(person.firstName);
  const [lastName, setLastName] = React.useState(person.lastName);
  const [shift, setShift] = React.useState(person.shift);
  const [badge, setBadge] = React.useState(person.badge);

  function resetEditPersonInputs() {
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setShift(person.shift);
    setBadge(person.badge);
  }

  async function editPerson(firstName, lastName, shift, badge) {
    const batch = writeBatch(db);
    batch.update(user.ref, { personnel: arrayRemove(person) });
    batch.update(user.ref, {
      personnel: arrayUnion({ firstName, lastName, shift, badge }),
    });
    await batch.commit();
  }

  async function onEditPersonSubmit(e) {
    e.preventDefault();

    if (!firstName || !badge) return;

    setEditPersonOpen(false);
    resetEditPersonInputs();

    try {
      // Check if the person and firebase contain any personnel with duplicate badges
      let mergeDuplicates = false;
      if (person.badge !== badge) {
        mergeDuplicates = user.data.personnel.some(
          (person) => person.badge === badge
        );
      }

      if (mergeDuplicates) {
        setToastState({
          title: "Failed to edit person",
          description:
            "Make sure there are no other personnel in the roster with the same badge.",
          icon: <FiAlertTriangle />,
        });
      } else {
        await editPerson(firstName, lastName, shift, badge);
        setToastState({
          title: "Person edited successfully",
          description:
            "The roster reflects all changes to the selected person.",
          icon: <FiCheck />,
        });
      }
    } catch (error) {
      setToastState(Toast.unknownState);
    }

    setToastOpen(true);
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

  return (
    <Wrapper data-checked={checked ? "true" : "false"} {...props}>
      <PositionedCheckbox
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
      <Contents>
        <Group>
          <Dialog.Root
            open={editPersonOpen}
            onOpenChange={(editPersonOpen) => {
              setEditPersonOpen(editPersonOpen);

              resetEditPersonInputs();
            }}
          >
            <Dialog.Trigger asChild>
              <Name>
                {person.firstName} {person.lastName}
              </Name>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay>
                <Dialog.Content
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
                        errorText={firstName ? "" : "Please enter a first name"}
                      />
                      <TextInput
                        id="last-name-input"
                        label="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        errorText={lastName ? "" : "Please enter a last name"}
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
                        errorText={badge ? "" : "Please enter a badge"}
                      />
                    </DialogInputs>
                    <Stack axis="horizontal">
                      <Dialog.Close asChild>
                        <Button variant="secondary">
                          <FiX />
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Button type="submit">
                        <FiSave />
                        Save person
                      </Button>
                    </Stack>
                  </DialogForm>
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Portal>
          </Dialog.Root>
          <span>{person.shift}</span>
        </Group>
        <span>{person.badge}</span>
      </Contents>
    </Wrapper>
  );
}

const Wrapper = styled.li`
  display: flex;
  padding: 16px 48px;
  border-bottom: 1px solid var(--color-gray-9);
  background-color: var(--color-white);
  color: var(--text-secondary);
  // Prevent height: 1px and position: absolute in VisuallyHidden in CheckBox
  // from stacking outside root html element and causing vertical overflow
  // Also add name pseudo-element containing position
  position: relative;

  --selected-background-color: var(--color-gray-9);

  &[data-checked="true"] {
    background-color: var(--selected-background-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--text-primary);
      background-color: var(--selected-background-color);
    }
  }
`;

const PositionedCheckbox = styled(Checkbox)`
  // Move checkbox out of flow and place above after pseudo-element
  position: absolute;
  z-index: 1;
`;

const Contents = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  // Account for width of absolutely positioned checkbox and gap
  padding-left: calc(24px + 32px);
`;

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Name = styled(UnstyledButton)`
  width: 256px;
  text-decoration: none;
  color: inherit;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
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

export default Item;
