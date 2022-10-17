import * as React from "react";
import styled from "styled-components";

import Layout from "components/layout";

function NotFound() {
  return (
    <Layout>
      <Wrapper>
        <Text>404: Not Found</Text>
      </Wrapper>
    </Layout>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
`;

const Text = styled.div`
  font-size: ${72 / 16}rem;
  color: var(--color-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default NotFound;
