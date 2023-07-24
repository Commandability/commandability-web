import styled from "styled-components";

function getDirection({ axis = "vertical" }) {
  return axis === "horizontal" ? "row" : "column";
}

function getGap({ gap, axis }) {
  return gap ? gap : axis === "horizontal" ? 24 : 16;
}

export default styled.span`
  display: flex;
  flex-direction: ${getDirection};
  gap: ${getGap}px;
`;
