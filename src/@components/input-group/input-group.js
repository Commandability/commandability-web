import * as React from "react";
import styled from "styled-components";

function InputGroup({ children }) {
  return <InputWrapper>{children}</InputWrapper>;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default InputGroup;
