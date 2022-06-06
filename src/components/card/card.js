import * as React from "react";
import styled from "styled-components";

import { QUERIES } from "constants.js";

function Card({ subheader, header, backgroundColor, children, className }) {
  return (
    <Article className={className}>
      <Title style={{ "--background-color": backgroundColor }}>
        <Subheader>{subheader}</Subheader>
        <Header>{header}</Header>
      </Title>
      {children}
    </Article>
  );
}

const Article = styled.article`
  display: flex;
  flex-direction: column;
  min-height: 512px;
  max-width: 384px;
  border-radius: 8px;
  box-shadow: 2px 4px 8px hsl(0 0% 0% / 50%);
  background: var(--color-white);

  @media ${QUERIES.laptopAndSmaller} {
    max-width: 768px;
    min-height: 256px;
    flex-direction: row;
  }

  @media ${QUERIES.phoneAndSmaller} {
    min-height: 512px;
    max-width: 384px;
    flex-direction: column;
  }
`;

const Title = styled.div`
  padding: 36px;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--background-color);

  @media ${QUERIES.laptopAndSmaller} {
    border-radius: 8px 0px 0px 8px;
    width: 256px;
  }

  @media ${QUERIES.phoneAndSmaller} {
    border-radius: 8px 8px 0px 0px;
    width: 100%;
  }
`;

const Subheader = styled.h3`
  color: var(--color-yellow-9);
  font-size: ${18 / 16}rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Header = styled.h2`
  font-size: ${20 / 16}rem;
  color: var(--color-white);
  font-weight: bold;
`;

export default Card;
