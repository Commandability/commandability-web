import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import { FiArrowLeft, FiEdit, FiSave } from "react-icons/fi";

import { useSnapshots } from "context/snapshot-context";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  unknownToastState,
} from "components/toast";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import TextInput from "components/text-input";
import Button from "components/button";
import VisuallyHidden from "components/visually-hidden";
import Spacer from "components/spacer";

function Person() {
  const { badge: paramBadge } = useParams();
  const { db, snapshots } = useSnapshots();

  const person = snapshots.user.data.personnel.find(
    (person) => person.badge === paramBadge
  );

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
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
    batch.update(snapshots.user.ref, { personnel: arrayRemove(person) });
    batch.update(snapshots.user.ref, {
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
        mergeDuplicates = snapshots.user.data.personnel.some(
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
    <Wrapper>
      <Back to="/dashboard/roster" variant="tertiary" size="large">
        <FiArrowLeft />
        <VisuallyHidden>Back</VisuallyHidden>
      </Back>
      <Name>
        {person.firstName} {person.lastName}
      </Name>
      <Hr />
      <Dialog
        open={editPersonOpen}
        onOpenChange={(editPersonOpen) => {
          setEditPersonOpen(editPersonOpen);

          resetEditPersonInputs();
        }}
      >
        <DialogTrigger asChild>
          <EditButton type="submit">
            <FiEdit />
            <Spacer size={8} axis="horizontal" />
            Edit Person
          </EditButton>
        </DialogTrigger>
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
            <Button type="submit">
              <FiSave />
              <Spacer size={8} axis="horizontal" />
              Save person
            </Button>
          </DialogForm>
        </DialogContent>
      </Dialog>
      <PersonData>
        <Datum>
          <DatumLabel>Shift: </DatumLabel>
          <DatumContent>{person.shift}</DatumContent>
        </Datum>
        <Datum>
          <DatumLabel>Badge: </DatumLabel>
          <DatumContent>{person.badge}</DatumContent>
        </Datum>
      </PersonData>
      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toastState.title}
          content={toastState.message}
        />
        <ToastViewport />
      </ToastProvider>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
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

export default Person;
