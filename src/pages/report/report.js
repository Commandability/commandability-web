import * as React from "react";
import styled from "styled-components";
import { Link, useLoaderData } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { ref, getBlob } from "firebase/storage";

import { storage } from "firebase.js";
import VisuallyHidden from "components/visually-hidden";

export async function reportLoader({ params }) {
  const { currentUser } = getAuth();
  const result = await getBlob(
    ref(storage, `users/${currentUser?.uid}/reports/${params.reportId}`)
  );
  return await result.text();
}

function Report() {
  const report = useLoaderData();

  return (
    <Wrapper>
      <Back to="/dashboard/reports">
        <FiChevronLeft />
        <VisuallyHidden>Back</VisuallyHidden>
      </Back>
      <Contents>{report}</Contents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 48px;
  display: grid;
  grid-template-columns: 96px 1fr 96px;
  grid-template-rows: 1fr;
  position: relative;
`;

const Back = styled(Link)`
  position: absolute;
  top: 32px;
  left: calc(32px - 6px);
  display: grid;
  place-content: center;
  text-decoration: none;
  color: var(--color-yellow-3);
  font-size: ${48 / 16}rem;
  padding: 8px;
  border-radius: 100%;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-yellow-9);
    }
  }
`;

const Contents = styled.div`
  white-space: pre-line;
  grid-column: 2;

  overflow-y: scroll;
  scrollbar-color: var(--color-gray-5) var(--color-gray-10);
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 10px;
    background-color: var(--color-gray-10);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 999999px;
    border: 2px solid var(--color-gray-10);
    background-color: var(--color-gray-5);
  }
  ::-webkit-scrollbar-track {
    margin: 2px 0px;
  }
`;

export default Report;
