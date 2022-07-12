import * as React from "react";
import styled from "styled-components";

function NotFound() {
  return <Wrapper>404: Not Found</Wrapper>;
}

const Wrapper = styled.div`
  color: var(--color-white);
`;

export default NotFound;
