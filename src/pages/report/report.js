import * as React from "react";
import styled from "styled-components";
import { useLoaderData } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { ref, getBlob } from "firebase/storage";

import { storage } from "firebase.js";
import Button from "components/button";
import VisuallyHidden from "components/visually-hidden";

export async function loader({ params }) {
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
      <Back to="/dashboard/reports" variant="tertiary" size="large">
        <FiArrowLeft />
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

const Back = styled(Button)`
  position: absolute;
  top: 48px;
  left: calc(48px - 6px);
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
