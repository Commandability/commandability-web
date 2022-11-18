import * as React from "react";
import styled from "styled-components";

import UnstyledButton from "components/unstyled-button";
import { Select, SelectItem } from "components/select";

const ANIMATION_DURATION = 300;

const selectValues = {
  zero: "No alert",
  five: "5",
  ten: "10",
  fifteen: "15",
  twenty: "20",
  twentyFive: "25",
  thirty: "30",
};

function EditGroupDialogContent({}) {
  const [groupName, setGroupName] = React.useState();
  const [alertTime, setAlertTime] = React.useState();

  return (
    <Container>
      <Content>
        <AccountForm>
          <FormInputs>
            <InputGroup>
              <Label htmlFor="group-name">Group name</Label>
              <Input
                id="group-name"
                type="text"
                required
                placeholder="Firetruck One"
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
                value={groupName}
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="alert-time">Alert time</Label>
              <Select
                select={alertTime}
                onValueChange={(alertTime) => setAlertTime(alertTime)}
                defaultValue={selectValues.zero}
                aria-label="Alert time selector"
              >
                <SelectItem value={selectValues.zero}>No alert</SelectItem>
                <SelectItem value={selectValues.five}>5</SelectItem>
                <SelectItem value={selectValues.ten}>10</SelectItem>
                <SelectItem value={selectValues.fifteen}>15</SelectItem>
                <SelectItem value={selectValues.twenty}>20</SelectItem>
                <SelectItem value={selectValues.twentyFive}>25</SelectItem>
                <SelectItem value={selectValues.thirty}>30</SelectItem>
              </Select>
            </InputGroup>
          </FormInputs>
          <SubmitButton type="submit">Save Changes</SubmitButton>
        </AccountForm>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  height: 256px;
  width: 384px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-gray-10);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`;

const AccountForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FormInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  text-transform: uppercase;
  color: var(--color-yellow-2);
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: solid 1px var(--color-gray-5);
  border-radius: 8px;

  &::placeholder {
    color: var(--color-gray-5);
  }

  &:focus-visible {
    outline: solid 2px var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const SubmitButton = styled(UnstyledButton)`
  padding: 12px;
  background-color: var(--color-yellow-2);
  border-radius: 8px;
  color: var(--color-white);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-yellow-3);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    transition: background-color ${ANIMATION_DURATION}ms;
  }
`;

export default EditGroupDialogContent;
