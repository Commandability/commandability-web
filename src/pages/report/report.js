import * as React from "react";
import styled from "styled-components";
import { defer, useLoaderData, Await } from "react-router-dom";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { ref, getBlob } from "firebase/storage";

import { storage } from "firebase.js";
import FireLoader from "components/fire-loader";
import * as Fallback from "components/fallback";
import Button from "components/button";
import VisuallyHidden from "components/visually-hidden";
import Spacer from "components/spacer";

async function getReport(uid, reportId) {
  const blob = await getBlob(ref(storage, `users/${uid}/reports/${reportId}`));
  return await blob.text();
}

export async function loader({ params }) {
  const { currentUser } = getAuth();

  return defer({ report: getReport(currentUser?.uid, params.reportId) });
}

function Report() {
  const loaderData = useLoaderData();

  const [downloadLink, setDownloadLink] = React.useState("");

  React.useEffect(() => {
    async function effect() {
      const data = await loaderData;
      const report = await data.report;
      const blob = new Blob([report], {
        type: "text/plain",
      });
      setDownloadLink(window.URL.createObjectURL(blob));
    }

    effect();
  }, [loaderData]);

  return (
    <Wrapper>
      <Back to="/dashboard/reports" variant="tertiary" size="large">
        <FiArrowLeft />
        <VisuallyHidden>Back</VisuallyHidden>
      </Back>
      <ExportButton
        download="report.txt"
        href={downloadLink}
        disabled={downloadLink ? false : true}
      >
        <FiDownload />
        <Spacer size={8} axis="horizontal" />
        Download report
      </ExportButton>
      <Contents>
        <React.Suspense fallback={<ReportsLoader />}>
          <Await
            resolve={loaderData.report}
            // Error displayed by reports suspense
            errorElement={<></>}
          >
            {(report) => {
              return <>{report}</>;
            }}
          </Await>
        </React.Suspense>
      </Contents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 48px;
  display: grid;
  grid-template-columns: 96px 1fr 96px;
  grid-template-rows: 128px 1fr;
  position: relative;
`;

const ReportsLoader = styled(FireLoader)`
  & > svg {
    ${Fallback.svg}
  }
`;

const Back = styled(Button)`
  position: absolute;
  top: 48px;
  left: calc(48px - 6px);
`;

const ExportButton = styled(Button)`
  grid-column: 2;
  justify-self: flex-start;
  align-self: center;
`;

const Contents = styled.div`
  white-space: pre-line;
  grid-row: 2;
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
    margin: 2px 0;
  }
`;

export default Report;
