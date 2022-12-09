import * as React from "react";
import styled from "styled-components";
import { getAuth } from "firebase/auth";
import {
  doc,
  writeBatch,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
  getDocs,
  where,
  Timestamp,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  defer,
  useLoaderData,
  Await,
  useNavigation,
  useSubmit,
  useFetcher,
  Form,
} from "react-router-dom";
import {
  FiTrash2,
  FiX,
  FiCheck,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";

import { db } from "firebase.js";
import { debounce } from "utils";
import { storage } from "firebase.js";
import { Select, SelectItem } from "components/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
} from "components/alert-dialog";
import Checkbox from "components/checkbox";
import SearchInput from "components/search-input";
import Button from "components/button";
import VisuallyHidden from "components/visually-hidden";
import Spacer from "components/spacer";
import ReportItem, { FallbackItem } from "components/report-item";
import * as Fallback from "components/fallback";

export const REPORTS_CONFIGURATION = {
  reportsPerPage: 20,
  fields: {
    startTimestamp: "startTimestamp",
    location: "location",
  },
};
const SELECT_VALUES = {
  newest: "newest",
  oldest: "oldest",
};
const SEARCH_DEBOUNCE = 400;

export async function loader({ request }) {
  const { currentUser } = getAuth();

  const { reportsPerPage, fields } = REPORTS_CONFIGURATION;

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const s = url.searchParams.get("s");
  const p = url.searchParams.get("p");
  const f = url.searchParams.get("f");
  const l = url.searchParams.get("l");
  const urlSearchParams = { q, s, p, f, l };

  // Create a new Timestamp from the serialized one because
  // JSON.stringify does not serialize prototypes, which are necessary for firebase query cursors
  let rangeQueryParams = [limit(reportsPerPage)];
  if (p === "next" && f && l) {
    rangeQueryParams = [
      limit(reportsPerPage),
      startAfter(new Timestamp(parseInt(l), 0)),
    ];
  } else if (p === "prev" && f && l) {
    rangeQueryParams = [
      limitToLast(reportsPerPage),
      endBefore(new Timestamp(parseInt(f), 0)),
    ];
  }

  let prevDocsQueryParams = [];
  if (f) prevDocsQueryParams = [endBefore(new Timestamp(parseInt(f), 0))];

  if (q) {
    const filteredReportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports"),
      orderBy(fields.location),
      where(fields.location, ">=", q.toLowerCase()),
      where(fields.location, "<=", q.toLowerCase() + "\uf8ff"),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];

    return defer({
      ...urlSearchParams,
      reportsData: Promise.all([
        getDocs(query(...filteredReportsQueryParams, ...rangeQueryParams)),
        getCountFromServer(
          query(...filteredReportsQueryParams, ...prevDocsQueryParams)
        ),
        getCountFromServer(query(...filteredReportsQueryParams)),
      ]),
    });
  } else {
    const reportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports"),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];

    return defer({
      ...urlSearchParams,
      reportsData: Promise.all([
        getDocs(query(...reportsQueryParams, ...rangeQueryParams)),
        getCountFromServer(
          query(...reportsQueryParams, ...prevDocsQueryParams)
        ),
        getCountFromServer(query(...reportsQueryParams)),
      ]),
    });
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  if (formData.has("checked-items")) {
    const checkedItems = JSON.parse(formData.get("checked-items"));

    const { currentUser } = getAuth();
    const reportsRef = collection(db, "users", currentUser.uid, "reports");

    // Remove firestore metadata
    const batch = writeBatch(db);
    checkedItems.forEach((item) => {
      batch.delete(doc(reportsRef, item));
    });
    await batch.commit();
    // Remove files from storage
    for (const item of checkedItems) {
      const itemRef = ref(storage, `users/${currentUser.uid}/reports/${item}`);
      await deleteObject(itemRef);
    }
  }
}

function Reports() {
  const { q, s, p, reportsData } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const [key, setKey] = React.useState(true);
  const [prevS, setPrevS] = React.useState(s);

  // Don't add new search to the history stack unless it's the first one
  const isFirstFilter = q === null || s === null;

  const { reportsPerPage } = REPORTS_CONFIGURATION;

  const [removeReportsOpen, setRemoveReportsOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  const isAnyItemChecked = !!checkedItems.length;

  // Synchronize input values with URL search params
  // Browser navigation changes the URL, but not element values
  React.useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  React.useEffect(() => {
    // If s changes from SELECT_VALUES.oldest to undefined, remount
    if (!s && prevS === SELECT_VALUES.oldest) setKey((prevKey) => !prevKey);
    if (prevS !== SELECT_VALUES.oldest) setPrevS(s);
  }, [s, prevS, setKey, setPrevS]);

  // Ensure checkedAll is unchecked even if a delete is unsuccessful
  React.useEffect(() => {
    if (!isAnyItemChecked) setCheckedAll({ status: false, origin: "form" });
  }, [isAnyItemChecked]);

  async function onRemoveReports() {
    setRemoveReportsOpen(false);
    setCheckedAll(false);
    setCheckedItems([]);
  }

  const handleSearchChange = React.useMemo(
    () =>
      debounce((currentTarget) => {
        submit(currentTarget, {
          replace: !isFirstFilter,
        });
      }, SEARCH_DEBOUNCE),
    [isFirstFilter, submit]
  );

  const fallbackPagination = (
    <Pagination>
      <Fallback.Text style={{ "--text-length": "96px" }} />
      <PaginationButtons>
        <Button disabled={true} variant="tertiary" size="medium">
          <FiChevronLeft />
          <VisuallyHidden>Previous page</VisuallyHidden>
        </Button>
        <Button disabled={true} variant="tertiary" size="medium">
          <FiChevronRight />
          <VisuallyHidden>Next page</VisuallyHidden>
        </Button>
      </PaginationButtons>
    </Pagination>
  );

  const fallbackList = (
    <>
      <VisuallyHidden>Loading reports</VisuallyHidden>
      <List>
        {Array(reportsPerPage)
          .fill(null)
          .map((_, index) => (
            <FallbackItem key={index} />
          ))}
      </List>
    </>
  );

  return (
    <Wrapper>
      <ReportsForm
        id="reports-form"
        onChange={(event) => {
          if (event.target.name === "q") {
            handleSearchChange(event.currentTarget);
          } else {
            submit(event.currentTarget, {
              replace: !isFirstFilter,
            });
          }
        }}
      >
        <Filter>
          <ReportsSearch
            id="q"
            name="q"
            defaultValue={q}
            placeholder="location"
          />
          <ReportsSelect
            id="s"
            name="s"
            defaultValue={SELECT_VALUES.newest}
            label="Sort"
            // Clicking reports in the layout component causes the loader to be called but does not remount the reports page
            // Change the key to remount the select component when the URL has no s query param to synchronize its state with the URL
            key={key}
          >
            <SelectItem value={SELECT_VALUES.newest}>Newest first</SelectItem>
            <SelectItem value={SELECT_VALUES.oldest}>Oldest first</SelectItem>
          </ReportsSelect>
        </Filter>
        <React.Suspense fallback={fallbackPagination}>
          <Await
            resolve={reportsData}
            // Error displayed by reports suspense
            errorElement={<></>}
          >
            {(reportsData) => {
              const [reportsDocs, prevReportsAggregate, allReportsAggregate] =
                reportsData;

              let prevReportsCount = prevReportsAggregate?.data().count;
              // If the displayed reports are a page forward from the previous first displayed report
              if (p === "next") prevReportsCount += reportsPerPage;
              // If the displayed reports are a page backward from the previous first displayed report
              else if (p === "prev") prevReportsCount -= reportsPerPage;
              else prevReportsCount = 0;

              const allReportsCount = allReportsAggregate?.data().count;

              const firstDisplayedReport = reportsDocs.docs[0]?.data();
              const lastDisplayedReport =
                reportsDocs.docs[reportsDocs.docs.length - 1]?.data();

              return (
                <Pagination>
                  {`${prevReportsCount} - ${
                    prevReportsCount + reportsDocs.docs.length
                  } of ${allReportsCount}`}
                  <PaginationButtons>
                    <Button
                      type="submit"
                      name="p"
                      value={"prev"}
                      disabled={prevReportsCount === 0}
                      variant="tertiary"
                      size="medium"
                    >
                      <FiChevronLeft />
                      <VisuallyHidden>Previous page</VisuallyHidden>
                    </Button>
                    <Button
                      type="submit"
                      name="p"
                      value={"next"}
                      disabled={reportsDocs.docs.length < reportsPerPage}
                      variant="tertiary"
                      size="medium"
                    >
                      <FiChevronRight />
                      <VisuallyHidden>Next page</VisuallyHidden>
                    </Button>
                    <input
                      type="hidden"
                      name="f"
                      // The first displayed report's timestamp's seconds
                      value={
                        firstDisplayedReport
                          ? firstDisplayedReport.startTimestamp.seconds.toString()
                          : ""
                      }
                    />
                    <input
                      type="hidden"
                      name="l"
                      // The last displayed report's timestamp's seconds
                      value={
                        lastDisplayedReport
                          ? lastDisplayedReport.startTimestamp.seconds.toString()
                          : ""
                      }
                    />
                  </PaginationButtons>
                </Pagination>
              );
            }}
          </Await>
        </React.Suspense>
      </ReportsForm>
      <ListArea>
        <ListHeader aria-live="polite" aria-atomic="true">
          <Group>
            <Checkbox
              label="Select all"
              checked={checkedAll.status}
              onCheckedChange={(checked) =>
                setCheckedAll({ status: checked, origin: "header" })
              }
            />
            {checkedItems.length === 0 ? (
              <Location>Location</Location>
            ) : (
              <AlertDialog
                open={removeReportsOpen}
                onOpenChange={setRemoveReportsOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="tertiary">
                    <FiTrash2 />
                    <Spacer size={8} axis="horizontal" />
                    Delete reports
                  </Button>
                </AlertDialogTrigger>
                <RemoveAlertDialogContent
                  header
                  title="Are you absolutely sure?"
                  description="This action cannot be undone. This will permanently delete the selected reports from your account."
                >
                  <AlertOptions>
                    <AlertDialogCancel asChild>
                      <Button variant="secondary">
                        <FiX />
                        <Spacer size={8} axis="horizontal" />
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <fetcher.Form method="post" onSubmit={onRemoveReports}>
                      <Button
                        type="submit"
                        name="checked-items"
                        value={JSON.stringify(checkedItems)}
                      >
                        <FiCheck />
                        <Spacer size={8} axis="horizontal" />
                        Yes, delete reports
                      </Button>
                    </fetcher.Form>
                  </AlertOptions>
                </RemoveAlertDialogContent>
              </AlertDialog>
            )}
          </Group>
          {checkedItems.length === 0 ? <span>Timestamp</span> : null}
        </ListHeader>
        {navigation.location || fetcher.state !== "idle" ? (
          fallbackList
        ) : (
          <React.Suspense fallback={fallbackList}>
            <Await
              resolve={reportsData}
              errorElement={
                <ErrorElement>
                  <FiAlertTriangle />
                  Error loading reports
                </ErrorElement>
              }
            >
              {(reportsData) => {
                const [reportsDocs] = reportsData;
                return (
                  <List aria-live="polite" aria-atomic="true">
                    {/* Ensure data has loaded */}
                    {[...reportsDocs.docs].map((report) => {
                      const { location, startTimestamp } = report.data();
                      return (
                        <ReportItem
                          key={report.id}
                          reportId={report.id}
                          location={location}
                          startTimestamp={startTimestamp}
                          checkedAll={checkedAll}
                          setCheckedAll={setCheckedAll}
                          setCheckedItems={setCheckedItems}
                          isAnyItemChecked={isAnyItemChecked}
                        />
                      );
                    })}
                  </List>
                );
              }}
            </Await>
          </React.Suspense>
        )}
      </ListArea>
      <Bottom>
        <Button>
          <FiDownload />
          <Spacer size={8} axis="horizontal" />
          Export all
        </Button>
        <Button>
          <FiTrash2 />
          <Spacer size={8} axis="horizontal" />
          Delete All
        </Button>
      </Bottom>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ReportsForm = styled(Form)`
  padding: 32px 48px;
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

const ReportsSearch = styled(SearchInput)`
  width: 256px;
`;

const ReportsSelect = styled(Select)`
  width: 160px;
`;

const Pagination = styled.div`
  // Align to baseline of search form
  position: relative;
  top: 0.8rem;
  display: flex;
  gap: 32px;
  align-items: center;
  color: var(--color-gray-4);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 24px;
`;

const ListHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px 48px;
  background-color: var(--color-gray-10);
  color: var(--color-gray-2);
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ErrorElement = styled.div`
  height: calc(100% - (24px + 16px * 2));
  display: grid;
  place-content: center;
  text-transform: uppercase;
  color: var(--color-gray-4);
  letter-spacing: 0.05em;
  font-size: ${20 / 16}rem;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Group = styled.div`
  display: flex;
  gap: 32px;
`;

const Location = styled.span`
  width: 256px;
`;

const RemoveAlertDialogContent = styled(AlertDialogContent)`
  width: 512px;
`;

const AlertOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const ListArea = styled.div`
  flex: 1;

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

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  isolation: isolate;
`;

const Bottom = styled.div`
  width: 100%;
  min-height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 48px;
`;

export default Reports;
