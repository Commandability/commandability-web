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
} from "react-icons/fi";

import { db } from "firebase.js";
import { debounce } from "utils.js";
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
import IconButton from "components/icon-button";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import ReportItem, { FallbackItem } from "components/report-item";

export const REPORTS_CONFIGURATION = {
  reportsPerPage: 5,
  fields: {
    startTimestamp: "startTimestamp",
    location: "location",
  },
};
const selectValues = {
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

  const reportsQueryParams = [
    collection(db, "users", currentUser.uid, "reports"),
    orderBy(
      fields.startTimestamp,
      s === selectValues.oldest ? undefined : "desc"
    ),
  ];

  if (q) {
    return defer({
      q,
      reports: getDocs(
        query(
          collection(db, "users", currentUser.uid, "reports"),
          orderBy(fields.location),
          where(fields.location, ">=", q.toLowerCase()),
          where(fields.location, "<=", q.toLowerCase() + "\uf8ff"),
          orderBy(
            fields.startTimestamp,
            s === selectValues.oldest ? undefined : "desc"
          ),
          limit(reportsPerPage)
        )
      ),
    });
  } else {
    return defer({
      q,
      p,
      reportsData: Promise.all([
        getDocs(query(...reportsQueryParams, ...rangeQueryParams)),
        getCountFromServer(
          query(...reportsQueryParams, ...prevDocsQueryParams)
        ),
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
  const { q, p, reportsData } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const { reportsPerPage } = REPORTS_CONFIGURATION;

  const [removeReportsOpen, setRemoveReportsOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  const isAnyItemChecked = !!checkedItems.length;

  React.useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  async function onRemoveReports() {
    setRemoveReportsOpen(false);
    setCheckedAll(false);
    setCheckedItems([]);
  }

  const handleSearchChange = React.useMemo(
    () =>
      debounce((currentTarget) => {
        const isFirstSearch = q === null;

        submit(currentTarget, {
          replace: !isFirstSearch,
        });
      }, SEARCH_DEBOUNCE),
    [q, submit]
  );

  // Ensure checkedAll is unchecked even if a delete is unsuccessful
  React.useEffect(() => {
    if (!isAnyItemChecked) setCheckedAll({ status: false, origin: "form" });
  }, [isAnyItemChecked]);

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
      <Top>
        <SearchForm
          id="search-form"
          role="search"
          onChange={(event) => {
            if (event.target.name === "q") {
              handleSearchChange(event.currentTarget);
            } else {
              const isFirstSearch = q === null;

              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }
          }}
        >
          <ReportsSearch
            id="q"
            name="q"
            defaultValue={q}
            placeholder="location"
          />
          <ReportsSelect
            id="s"
            name="s"
            defaultValue={selectValues.newest}
            label="Sort"
          >
            <SelectItem value={selectValues.newest}>Newest first</SelectItem>
            <SelectItem value={selectValues.oldest}>Oldest first</SelectItem>
          </ReportsSelect>
        </SearchForm>
        <React.Suspense>
          <Await resolve={reportsData}>
            {(reportsData) => {
              const [reportsDocs, prevReportsCount] = reportsData;

              let displayCount = prevReportsCount.data().count;
              // If the displayed reports are a page forward from the previous first displayed report
              if (p === "next") displayCount += reportsPerPage;
              // If the displayed reports are a page backward from the previous first displayed report
              else if (p === "prev") displayCount -= reportsPerPage;
              else displayCount = 0;

              return (
                <Pagination>
                  {displayCount} - {displayCount + reportsPerPage}
                  <PaginationForm id="pagination-form">
                    <IconButton
                      type="submit"
                      name="p"
                      value={"prev"}
                      disabled={displayCount === 0}
                    >
                      <VisuallyHidden>Previous page</VisuallyHidden>
                      <FiChevronLeft />
                    </IconButton>
                    <IconButton
                      type="submit"
                      name="p"
                      value={"next"}
                      disabled={reportsDocs.docs.length < reportsPerPage}
                    >
                      <VisuallyHidden>Next page</VisuallyHidden>
                      <FiChevronRight />
                    </IconButton>
                    <input
                      type="hidden"
                      name="f"
                      // The first displayed report's timestamp's seconds
                      value={reportsDocs.docs[0].data().startTimestamp.seconds}
                    />
                    <input
                      type="hidden"
                      name="l"
                      // The last displayed report's timestamp's seconds
                      value={
                        reportsDocs.docs[reportsDocs.docs.length - 1].data()
                          .startTimestamp.seconds
                      }
                    />
                  </PaginationForm>
                </Pagination>
              );
            }}
          </Await>
        </React.Suspense>
      </Top>
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
                  <Button variant="tertiary" icon={FiTrash2}>
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
                      <Button icon={FiX} variant="secondary">
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <fetcher.Form method="post" onSubmit={onRemoveReports}>
                      <Button
                        type="submit"
                        name="checked-items"
                        value={JSON.stringify(checkedItems)}
                        icon={FiCheck}
                      >
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
        {searching || fetcher.state !== "idle" ? (
          fallbackList
        ) : (
          <React.Suspense fallback={fallbackList}>
            <Await
              resolve={reportsData}
              errorElement={<p>Error loading reports</p>}
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
        <Button icon={FiDownload}>Export all</Button>
        <Button icon={FiTrash2}>Delete All</Button>
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

const Top = styled.div`
  padding: 32px 48px;
  display: flex;
  justify-content: space-between;
`;

const SearchForm = styled(Form)`
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

const PaginationForm = styled(Form)`
  display: flex;
  gap: 8px;
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
