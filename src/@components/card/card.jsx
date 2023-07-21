import * as React from "react";
import styled from "styled-components";

import { QUERIES } from "@constants";

function Card({ subheader, header, children, ...props }) {
  return (
    <Wrapper {...props}>
      <Content>
        <Title>
          <Subheader>{subheader}</Subheader>
          <Header>{header}</Header>
        </Title>
        {children}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.article`
  display: flex;
  min-height: 448px;
  max-width: 384px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  background-image: linear-gradient(
    135deg,
    var(--accent-color-1),
    var(--accent-color-2)
  );

  @media ${QUERIES.laptopAndSmaller} {
    max-width: 768px;
    min-height: 256px;
  }

  @media ${QUERIES.phoneAndSmaller} {
    min-height: 512px;
    max-width: 384px;
  }
`;

const Content = styled.div`
  flex: 1;
  margin: 4px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: var(--color-white);
  border-radius: calc(var(--border-radius) / 2);

  @media ${QUERIES.laptopAndSmaller} {
    flex-direction: row;
  }

  @media ${QUERIES.phoneAndSmaller} {
    flex-direction: column;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;

  @media ${QUERIES.laptopAndSmaller} {
    width: 256px;
  }

  @media ${QUERIES.phoneAndSmaller} {
    width: revert;
  }
`;

const Subheader = styled.h3`
  font-size: ${18 / 16}rem;
  color: var(--accent-color-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Header = styled.h2`
  font-size: ${20 / 16}rem;
  color: var(--color-gray-1);
  font-weight: normal;
`;

export default Card;
