import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import {
  FiAlertTriangle,
  FiCheck,
  FiArrowLeft,
  FiEdit,
  FiSave,
} from "react-icons/fi";

import { useSnapshots } from "@context/snapshot-context";
import * as Toast from "@components/toast";
import * as Dialog from "@components/dialog";
import TextInput from "@components/text-input";
import Button from "@components/button";
import VisuallyHidden from "@components/visually-hidden";
import * as Fallback from "@components/fallback";

function Person() {
  const { badge: paramBadge } = useParams();
  const {
    db,
    snapshots: { user },
  } = useSnapshots();

  const person =
    user.status === "resolved"
      ? user.data?.personnel.find((person) => person.badge === paramBadge)
      : {};

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

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

  return (
    <Wrapper>
      <Back to="/dashboard/roster" variant="tertiary" size="large">
        <FiArrowLeft />
        <VisuallyHidden>Back</VisuallyHidden>
      </Back>
      <Name>
        {user.status !== "resolved" ? (
          <Fallback.Text style={{ "--text-length": "384px" }} />
        ) : (
          <div>{`${person.firstName} ${person.lastName}`}</div>
        )}
      </Name>
      <Hr />
      <Dialog.Root
        open={editPersonOpen}
        onOpenChange={(editPersonOpen) => {
          setEditPersonOpen(editPersonOpen);

          resetEditPersonInputs();
        }}
      >
        <Dialog.Trigger asChild>
          <EditButton disabled={user.status !== "resolved"}>
            <FiEdit />
            Edit Person
          </EditButton>
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
                    labelText="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    errorText={firstName ? "" : "Please enter a first name"}
                  />
                  <TextInput
                    id="last-name-input"
                    labelText="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    errorText={lastName ? "" : "Please enter a last name"}
                  />
                  <TextInput
                    id="shift-input"
                    labelText="Shift"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                  />
                  <TextInput
                    id="badge-input"
                    labelText="Badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    errorText={badge ? "" : "Please enter a badge"}
                  />
                </DialogInputs>
                <Button type="submit">
                  <FiSave />
                  Save person
                </Button>
              </DialogForm>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <PersonData>
        <Datum>
          <DatumLabel>Shift: </DatumLabel>
          <DatumContent>
            {user.status !== "resolved" ? (
              <Fallback.Text style={{ "--text-length": "96px" }} />
            ) : person.shift ? (
              `${person.shift}`
            ) : (
              <EmptyDatum>unassigned</EmptyDatum>
            )}
          </DatumContent>
        </Datum>
        <Datum>
          <DatumLabel>Badge: </DatumLabel>
          <DatumContent>
            {user.status !== "resolved" ? (
              <Fallback.Text style={{ "--text-length": "96px" }} />
            ) : (
              `${person.badge}`
            )}
          </DatumContent>
        </Datum>
      </PersonData>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 96px 1fr 96px;
  grid-template-rows: 128px 1fr;
  align-items: baseline;
  padding: 48px;
  position: relative;
`;

const Back = styled(Button)`
  position: absolute;
  top: 48px;
  left: calc(48px - 6px);
`;

const Name = styled.span`
  grid-row: 1;
  grid-column: 2;
  font-size: ${72 / 16}rem;
  color: var(--color-gray-4);
`;

const EditButton = styled(Button)`
  grid-row: 1;
  grid-column: 2;
  justify-self: end;
`;

const Hr = styled.hr`
  border-top: 1px solid var(--color-gray-7);
  grid-column: 2 / 3;
  grid-row: 2;
  align-self: start;
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

const PersonData = styled.span`
  grid-row: 2;
  grid-column: 2;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 0;
`;

const Datum = styled.div`
  display: grid;
`;

const DatumLabel = styled.span`
  font-size: ${24 / 16}rem;
  color: var(--color-gray-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DatumContent = styled.span`
  font-size: ${48 / 16}rem;
  color: var(--color-yellow-3);
`;

const EmptyDatum = styled.span`
  color: var(--color-gray-5);
`;

export default Person;
