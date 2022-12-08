import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Checkbox from "components/checkbox";
import * as Fallback from "components/fallback";
import { getRandomInt } from "utils";

export function FallbackItem() {
  // Only generate one random length per mount as opposed to on every render
  const [textLength] = React.useState(getRandomInt(64, 256));
  return (
    <FallbackWrapper>
      <FallbackCheckbox />
      <FallbackContents>
        <Fallback.Text style={{ "--text-length": `${textLength}px` }} />
        <Fallback.Text style={{ "--text-length": "144px" }} />
      </FallbackContents>
    </FallbackWrapper>
  );
}

function ReportItem({
  reportId,
  location,
  startTimestamp,
  checkedAll,
  setCheckedAll,
  setCheckedItems,
  isAnyItemChecked,
  ...props
}) {
  const { status, origin } = checkedAll;

  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    // Check item when checkedAll is checked
    if (status) {
      setChecked(true);
      setCheckedItems((checkedItems) => [...checkedItems, reportId]);
      // Uncheck item when checkedAll is unchecked, but not when a single person has been unchecked
    } else if (origin !== "list-item") {
      setChecked(false);
      setCheckedItems((checkedItems) =>
        checkedItems.filter((item) => item !== reportId)
      );
    }
  }, [status, origin, setCheckedItems, reportId]);

  // Ensure the item is unchecked even if a delete is unsuccessful
  React.useEffect(() => {
    if (!isAnyItemChecked) setChecked(false);
  }, [isAnyItemChecked]);

  return (
    <Wrapper data-checked={checked ? "true" : "false"} {...props}>
      <PositionedCheckbox
        label="Select"
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked);

          if (checked) {
            setCheckedItems((checkedItems) => [...checkedItems, reportId]);
          } else {
            setCheckedItems((checkedItems) =>
              checkedItems.filter((item) => item !== reportId)
            );

            // Disable checked all when a single person has been unchecked
            setCheckedAll({ status: false, origin: "list-item" });
          }
        }}
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
  color: var(--color-gray-3);
  // Prevent height: 1px and position: absolute in VisuallyHidden in CheckBox
  // from stacking outside root html element and causing vertical overflow
  // Also add name pseudo-element containing position
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
  color: var(--color-gray-3);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }
`;

const FallbackWrapper = styled.li`
  display: flex;
  padding: 16px 48px;
  border-bottom: 1px solid var(--color-gray-9);
  background-color: var(--color-white);
  color: var(--color-gray-3);
`;

const FallbackCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--color-gray-9);
  z-index: 1;
`;

const FallbackContents = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding-left: 32px;
  align-items: center;
`;

export default ReportItem;
