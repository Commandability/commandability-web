import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Checkbox from "@components/checkbox";

function Item({
  setCheckedItems,
  checkedAll,
  setCheckedAll,
  person,
  ...props
}) {
  const { status, origin } = checkedAll;

  const [checked, setChecked] = React.useState(false);

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
          <Name to={`/dashboard/roster/${person.badge}`}>
            {person.firstName} {person.lastName}
          </Name>
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
  color: var(--color-gray-3);
  // Prevent height: 1px and position: absolute in VisuallyHidden in CheckBox
  // from stacking outside root html element and causing vertical overflow
  // Also add name pseudo-element containing position
  position: relative;

  --selected-background-color: var(--color-gray-8);

  &[data-checked="true"] {
    background-color: var(--selected-background-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
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

const Name = styled(Link)`
  width: 256px;
  text-decoration: none;
  color: var(--color-gray-3);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }
`;

export default Item;