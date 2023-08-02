import * as React from "react";
import styled from "styled-components";
import { useRouteError } from "react-router-dom";

import Layout from "@components/layout";
import Pill from "@components/pill";
import Stack from "@components/stack";

function RouteError() {
  const error = useRouteError();

  return (
    <Layout>
      <Wrapper>
        <Content>
          <Stack axis="horizontal" gap={16}>
            <Code>{error.status}</Code>
            <Message>{error.statusText}</Message>
          </Stack>
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
  justify-items: center;
  align-content: start;
  gap: 32px;
  --font-size: clamp(${18 / 16}rem, 2vw + 1rem, ${64 / 16}rem);
  color: var(--text-primary-bg-dark);
`;

const Code = styled.span`
  font-size: var(--font-size);
  letter-spacing: 0.05em;
`;

const Message = styled.span`
  font-size: var(--font-size);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export default RouteError;
