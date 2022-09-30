import * as React from "react";
import styled from "styled-components";

import Checkbox from "components/checkbox";

function RosterItem({ checkedAll, person, ...props }) {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (checkedAll) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [checkedAll]);

  return (
    <Wrapper data-checked={checked ? "true" : "false"} {...props}>
      <Group>
        <Checkbox
          label="Select"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked)}
        />
        <Name>
          <span>{person.firstName}</span>
          <span>{person.lastName}</span>
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

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Name = styled.div`
  width: 256px;
  display: flex;
  gap: 16px;
`;

export default RosterItem;
