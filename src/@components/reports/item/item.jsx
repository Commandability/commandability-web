import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Checkbox from "@components/checkbox";

function Item({
  reportId,
  location,
  startTimestamp,
  checkboxProps: { checked, onCheckedChange },
  ...props
}) {
  return (
    <Wrapper data-checked={checked} {...props}>
      <PositionedCheckbox
        label="Select"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Contents>
        <Group>
          <Location to={`/dashboard/reports/${reportId}`}>{location}</Location>
        </Group>
        <span>
          {startTimestamp.toDate().toLocaleString(navigator.language, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
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
      background-color: var(--selected-background-color);
      color: var(--text-primary);
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

const Location = styled(Link)`
  text-decoration: none;
  color: inherit;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }
`;

export default Item;
