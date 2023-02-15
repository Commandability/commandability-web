import * as React from "react";
import styled from "styled-components";

import Layout from "@components/layout";
import Pill from "@components/pill";
import Spacer from "@components/spacer";

function NotFound() {
  return (
    <Layout>
      <Wrapper>
        <Content>
          <Code>404</Code>
          <Message>Page not found</Message>
          <Spacer axis="vertical" size={64} />
          <Pill to="/" theme="light" angle>
            Go home
          </Pill>
        </Content>
      </Wrapper>
    </Layout>
  );
}

const Wrapper = styled.div`
  height: 100%;
  padding: 0 48px;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  justify-content: center;
`;

const Content = styled.div`
  grid-row: 2;
  display: grid;
  justify-items: start;
`;

const Code = styled.div`
  display: grid;
  font-size: clamp(${32 / 16}rem, 8vw + 1rem, ${96 / 16}rem);
  letter-spacing: 0.1em;
  color: var(--color-yellow-9);
`;

const Message = styled.div`
  display: grid;
  font-size: clamp(${24 / 16}rem, 2vw + 1rem, ${48 / 16}rem);
  color: var(--color-white);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default NotFound;
