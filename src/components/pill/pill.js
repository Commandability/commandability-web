import * as React from "react";
import styled from "styled-components";

function Pill({children}){
    return(
        <>
            <Button>{children}</Button>
        </>
    );
}

const Button = styled.button`
  background-color: var( --color-yellow-9);
  color: var( --color-yellow-2);
  border-radius: 24px;
  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 24px;
  padding-right: 24px;
  font-weight: bold;
  font-size: 1rem;
`;

export default Pill;