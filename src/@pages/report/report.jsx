import * as React from "react";
import styled from "styled-components";
import { defer, useLoaderData, useNavigate, Await } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiAlertTriangle } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { ref, getBlob } from "firebase/storage";

import { storage } from "firebase-config";
import FireLoader from "@components/fire-loader";
import * as Fallback from "@components/fallback";
import Button from "@components/button";
import VisuallyHidden from "@components/visually-hidden";

async function getReport(uid, reportId) {
  const blob = await getBlob(ref(storage, `users/${uid}/reports/${reportId}`));
  return await blob.text();
}

const HEADER_LINES = 2;
const LINE_DELIMITER = ": ";

function getLineLog(line) {
  return line.substring(line.indexOf(LINE_DELIMITER) + LINE_DELIMITER.length);
}

export async function loader({ params }) {
  const { currentUser } = getAuth();

  return defer({ report: getReport(currentUser?.uid, params.reportId) });
}

function Report() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

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

  const fallbackReportArea = (
    <ReportArea>
      <Header>
        <DatumList>
          <DatumTerm>Location:</DatumTerm>
          <DatumDetails>
            <Fallback.Text style={{ "--text-length": "256px" }} />
          </DatumDetails>
        </DatumList>
        <DatumList>
          <DatumTerm>Description: </DatumTerm>
          <DatumDetails>
            <Fallback.Text style={{ "--text-length": "384px" }} />
          </DatumDetails>
        </DatumList>
      </Header>
      <Entries>
        <ReportLoader />
      </Entries>
    </ReportArea>
  );

  const errorReportArea = (
    <ReportArea>
      <Header>
        <DatumList>
          <DatumTerm>Location:</DatumTerm>
          <DatumDetails data-default="true">Unknown</DatumDetails>
        </DatumList>
        <DatumList>
          <DatumTerm>Description: </DatumTerm>
          <DatumDetails data-default="true">Unknown</DatumDetails>
        </DatumList>
      </Header>
      <Entries>
        <ReportError>
          <FiAlertTriangle />
          Error loading report
        </ReportError>
      </Entries>
    </ReportArea>
  );

  return (
    <Wrapper>
      <Back onClick={() => navigate(-1)} variant="tertiary" size="large">
        <FiArrowLeft />
        <VisuallyHidden>Back</VisuallyHidden>
      </Back>
      <React.Suspense fallback={fallbackReportArea}>
        <Await resolve={loaderData.report} errorElement={errorReportArea}>
          {(report) => {
            const reportLines = report.split("\n");
            const [location, description] = reportLines.slice(0, HEADER_LINES);
            const locationLog = getLineLog(location);
            const descriptionLog = getLineLog(description);
            const content = reportLines.slice(HEADER_LINES);

            return (
              <ReportArea>
                <Header>
                  <DatumList>
                    <DatumTerm>Location: </DatumTerm>
                    <DatumDetails>{locationLog}</DatumDetails>
                  </DatumList>
                  <DatumList>
                    <DatumTerm>Description: </DatumTerm>
                    <DatumDetails
                      data-default={
                        descriptionLog === "none" ? "true" : "false"
                      }
                    >
                      {descriptionLog}
                    </DatumDetails>
                  </DatumList>
                </Header>
                <Entries>
                  {content.map((line, index) => {
                    const dateTime = line.substring(
                      0,
                      line.indexOf(LINE_DELIMITER)
                    );
                    const log = line.substring(
                      line.indexOf(LINE_DELIMITER) + 1
                    );
                    return (
                      <Entry key={line}>
                        <LineNumber>{index + 1}</LineNumber>
                        <span>
                          {dateTime}
                          {LINE_DELIMITER}
                          <Highlight>{log}</Highlight>
                        </span>
                      </Entry>
                    );
                  })}
                </Entries>
              </ReportArea>
            );
          }}
        </Await>
      </React.Suspense>
      <Bottom>
        <Button
          download="report.txt"
          href={downloadLink}
          disabled={downloadLink ? false : true}
        >
          <FiDownload />
          Download report
        </Button>
      </Bottom>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Back = styled(Button)`
  position: absolute;
  top: 48px;
  left: calc(48px - 6px);
`;

const ReportLoader = styled(FireLoader)`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: grid;
  place-content: center;

  & > svg {
    ${Fallback.svg}
  }
`;

const ReportError = styled.div`
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  display: grid;
  grid-auto-flow: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  font-size: ${18 / 16}rem;
  color: var(--text-secondary);

  & > svg {
    font-size: ${24 / 16}rem;
    stroke: var(--text-accent-primary);
  }
`;

const ReportArea = styled.div`
  flex: 1;
  --col-width: 144px;
  --grid-columns: var(--col-width) 1fr var(--col-width);
  --gap: 16px;
  display: grid;
  grid-template-columns: var(--grid-columns);
  grid-template-rows: max-content 1fr;
  column-gap: var(--gap);
  overflow: hidden;
`;

const Header = styled.div`
  grid-row: 1;
  grid-column: 2 / 3;
  padding: 32px 0;
  display: grid;
  gap: 16px;
`;

const DatumList = styled.dl`
  display: grid;
`;

const DatumTerm = styled.dt`
  font-size: ${16 / 16}rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DatumDetails = styled.dd`
  font-size: ${16 / 16}rem;
  color: var(--color-yellow-1);

  &[data-default="true"] {
    color: var(--text-secondary);
  }
`;

const Entries = styled.ul`
  grid-row: 2 / 3;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: var(--grid-columns);
  grid-template-rows: repeat(auto-fill, calc(1rem * var(--line-height)));
  column-gap: var(--gap);
  align-content: start;
  list-style: none;
  padding: 16px 0;
  padding-left: 0;
  overflow-y: auto;
  background-color: var(--color-white);
  color: var(--text-secondary);
  margin-left: -2ch;
`;

const Entry = styled.li`
  grid-column: 2 / 3;
  display: grid;
  grid-template-columns: 3ch max-content;
  gap: 32px;
  justify-items: end;
`;

const LineNumber = styled.span`
  color: var(--text-secondary);
`;

const Highlight = styled.span`
  color: var(--color-yellow-1);
`;

const Bottom = styled.div`
  min-height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 48px;
`;

export default Report;
