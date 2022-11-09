import * as React from "react";
import styled from "styled-components";
import {
  doc,
  writeBatch,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import {
  defer,
  useLoaderData,
  Await,
  useNavigation,
  useSubmit,
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

import { storage } from "firebase.js";
import { useAuth } from "context/auth-context";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  unknownToastState,
} from "components/toast";
import { Select, SelectItem } from "components/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
} from "components/alert-dialog";
import Checkbox from "components/checkbox";
import SearchInput from "components/search-input";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import ReportItem, { FallbackItem } from "components/report-item";

import { db } from "firebase.js";
import { getAuth } from "firebase/auth";

export const REPORTS_CONFIGURATION = {
  reportsPerPage: 20,
  fields: {
    startTimestamp: "startTimestamp",
    location: "location",
  },
};

const selectValues = {
  newest: "newest",
  oldest: "oldest",
};

export async function reportsLoader({ request }) {
  const { currentUser } = getAuth();

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const s = url.searchParams.get("s");

  if (q) {
    return defer({
      q,
      reports: getDocs(
        query(
          collection(db, "users", currentUser.uid, "reports"),
          limit(REPORTS_CONFIGURATION.reportsPerPage),
          orderBy(REPORTS_CONFIGURATION.fields.location),
          where(REPORTS_CONFIGURATION.fields.location, ">=", q.toLowerCase()),
          where(
            REPORTS_CONFIGURATION.fields.location,
            "<=",
            q.toLowerCase() + "\uf8ff"
          ),
          orderBy(
            REPORTS_CONFIGURATION.fields.startTimestamp,
            s === selectValues.oldest ? undefined : "desc"
          )
        )
      ),
    });
  } else {
    return defer({
      q,
      reports: getDocs(
        query(
          collection(db, "users", currentUser.uid, "reports"),
          limit(REPORTS_CONFIGURATION.reportsPerPage),
          orderBy(
            REPORTS_CONFIGURATION.fields.startTimestamp,
            s === selectValues.oldest ? undefined : "desc"
          )
        )
      ),
    });
  }
}

function Reports() {
  const { user } = useAuth();
  const { q, reports } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const userId = user.current?.uid;

  const reportsRef = collection(db, "users", userId, "reports");

  const [removeReportsOpen, setRemoveReportsOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  React.useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  async function removeReports(checkedItems) {
    // Remove firestore metadata
    const batch = writeBatch(db);
    checkedItems.forEach((item) => {
      batch.delete(doc(reportsRef, item));
    });
    await batch.commit();
    // Remove files from storage
    for (const item of checkedItems) {
      const itemRef = ref(storage, `users/${userId}/reports/${item}`);
      await deleteObject(itemRef);
    }
  }

  async function onRemoveReportsAction() {
    setRemoveReportsOpen(false);
    setCheckedAll(false);

    try {
      await removeReports(checkedItems);
      setCheckedItems([]);
      setToastState({
        title: "Reports deleted successfully",
        message: "The selected reports have been removed the list.",
      });
    } catch (error) {
      setToastState(unknownToastState);
    }

    setToastOpen(true);
  }

  const fallbackList = (
    <>
      <VisuallyHidden>Loading reports</VisuallyHidden>
      <List>
        {Array(REPORTS_CONFIGURATION.reportsPerPage)
          .fill(null)
          .map((_, index) => (
            <FallbackItem key={index} />
          ))}
      </List>
    </>
  );

  return (
    <Wrapper>
      {navigation.state === "loading" ? <Loading /> : null}
      <Top>
        <SearchForm
          id="search-form"
          role="search"
          onChange={(event) => {
            submit(event.currentTarget);
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
                    <AlertDialogAction asChild>
                      <Button onClick={onRemoveReportsAction} icon={FiCheck}>
                        Yes, delete reports
                      </Button>
                    </AlertDialogAction>
                  </AlertOptions>
                </RemoveAlertDialogContent>
              </AlertDialog>
            )}
          </Group>
          {checkedItems.length === 0 ? <span>Timestamp</span> : null}
        </ListHeader>
        <React.Suspense fallback={fallbackList}>
          <Await resolve={reports} errorElement={<p>Error loading reports</p>}>
            {(reports) => (
              <List aria-live="polite" aria-atomic="true">
                {/* Ensure data has loaded */}
                {[...reports.docs].map((report) => {
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
                    />
                  );
                })}
              </List>
            )}
          </Await>
        </React.Suspense>
      </ListArea>
      <Bottom>
        <Button icon={FiDownload}>Export all</Button>
        <Button icon={FiTrash2}>Delete All</Button>
        <UnstyledButton>
          <VisuallyHidden>Page left</VisuallyHidden>
          <FiChevronLeft />
        </UnstyledButton>
        <UnstyledButton>
          <VisuallyHidden>Page right</VisuallyHidden>
          <FiChevronRight />
        </UnstyledButton>
      </Bottom>
      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toastState.title}
          content={toastState.message}
        />
        <ToastViewport />
      </ToastProvider>
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

const Loading = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  transition: opacity 200ms;
  transition-delay: 200ms;
  background-color: var(--color-gray-3);
  z-index: 2147483647;
`;

const Top = styled.div`
  padding: 32px 48px;
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
