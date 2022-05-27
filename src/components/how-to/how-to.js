import * as React from "react";
import styled from "styled-components";

import { FiCheckSquare } from "react-icons/fi";
import { QUERIES } from "constants.js";

function HowTo({ step, heading, children }) {
  let littleSteps = children.split(".");
  return (
    <Article Offset={step}>
      <Header Step={step}>
        <BigStep>Step {step}</BigStep>
        <Heading>{heading}</Heading>
      </Header>
      <List>
        <LittleStep>
          <FiCheckSquare />
          <Content>{littleSteps[0]}</Content>
        </LittleStep>
        <LittleStep>
          <FiCheckSquare />
          <Content>{littleSteps[1]}</Content>
        </LittleStep>
        <LittleStep>
          <FiCheckSquare />
          <Content>{littleSteps[2]}</Content>
        </LittleStep>
      </List>
    </Article>
  );
}

const Article = styled.article`
  position: block;
  display: flex;
  flex-direction: column;
  min-height: 512px;
  max-width: 384px;
  border-radius: 8px;
  box-shadow: 2px 4px 8px hsl(0 0% 0% / 50%);
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

const Header = styled.div`
  padding: 36px;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${QUERIES.laptopAndSmaller} {
    border-radius: 8px 0px 0px 8px;
    width: 256px;
  }
  @media ${QUERIES.phoneAndSmaller} {
    border-radius: 8px 8px 0px 0px;
    width: 100%;
  }
  ${(props) =>
    props.Step === "1"
      ? `
         background-color: var(--color-red-3); 
    `
      : null}
  ${(props) =>
    props.Step === "2"
      ? `
         background-color: var(--color-red-2);
    `
      : null}
    ${(props) =>
    props.Step === "3"
      ? `
         background-color: var(--color-red-1);
    `
      : null}
`;

const BigStep = styled.div`
  color: var(--color-yellow-9);
  font-size: ${18 / 16}rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Heading = styled.div`
  font-size: ${20 / 16}rem;
  color: var(--color-white);
  font-weight: bold;
`;

const List = styled.div`
  flex: 1;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LittleStep = styled.div`
  display: flex;
  gap: 16px;
  font-size: ${18 / 16}rem;
  align-items: flex-start;
  & > svg {
    stroke-width: 0.175rem;
    color: var(--color-yellow-3);
    position: relative;
    top: 5px;
  }
`;

const Content = styled.div`
  flex: 1;
`;

export default HowTo;
