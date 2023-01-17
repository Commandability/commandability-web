import styled from "styled-components/macro";

export default styled.button`
  display: ${(props) => props.display || "block"};
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: ${(props) => (props.disabled ? "auto" : "pointer")};
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  font: inherit;
  color: inherit;

  &:focus {
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
