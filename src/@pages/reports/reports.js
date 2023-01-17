import * as React from "react";
import styled from "styled-components";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
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
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
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
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiHardDrive,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import * as JSZip from "jszip";

import { db, storage } from "firebase-config";
import { debounce, sum } from "@utils";
import { useAuth } from "@context/auth-context";
import { useSnapshots } from "@context/snapshot-context";
import { deleteAllReports } from "@helpers/reports.helpers";
import * as Toast from "@components/toast";
import * as Select from "@components/select";
import * as AlertDialog from "@components/alert-dialog";
import * as Progress from "@components/progress";
import * as Fallback from "@components/fallback";
import FireLoader from "@components/fire-loader";
import Checkbox from "@components/checkbox";
import SearchInput from "@components/search-input";
import TextInput from "@components/text-input";
import Button from "@components/button";
import VisuallyHidden from "@components/visually-hidden";
import ReportItem, { FallbackItem } from "@components/report-item";

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

  let reportsQueryParams;
  if (q) {
    reportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports"),
      orderBy(fields.location),
      where(fields.location, ">=", q.toLowerCase()),
      where(fields.location, "<=", q.toLowerCase() + "\uf8ff"),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];
  } else {
    reportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports"),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];
  }

  return defer({
    ...urlSearchParams,
    reportsData: Promise.all([
      getDocs(query(...reportsQueryParams, ...rangeQueryParams)),
      getCountFromServer(query(...reportsQueryParams, ...prevDocsQueryParams)),
      getCountFromServer(query(...reportsQueryParams)),
    ]),
  });
}

export async function action({ request }) {
  const errors = {};
  const formData = await request.formData();
  const password = formData.get("password");

  const { currentUser } = getAuth();

  const userCredentials = await EmailAuthProvider.credential(
    currentUser.email,
    password
  );
  try {
    await reauthenticateWithCredential(currentUser, userCredentials);
  } catch (error) {
    errors.password = error.code;
    return errors;
  }

  const reportsRef = collection(db, "users", currentUser.uid, "reports");

  if (formData.has("checked-items")) {
    const checkedItems = JSON.parse(formData.get("checked-items"));
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
  } else {
    await deleteAllReports(currentUser.uid);
  }
}

const SEARCH_DEBOUNCE = 400;

const initialBlobsState = {
  status: "idle",
  data: [],
  number: 0,
};

function Reports() {
  const { q, s, p, reportsData } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const { user } = useAuth();

  const {
    snapshots: { configuration },
  } = useSnapshots();

  const reportsConfiguration = configuration.data
    ?.find((doc) => doc.id === "reports")
    .data();

  const errors = fetcher.data;

  const [prevQ, setPrevQ] = React.useState(q);

  const [key, setKey] = React.useState(true);
  const [prevS, setPrevS] = React.useState(s);

  // Don't add new filter to the history stack unless it's the first one
  const isFirstFilter = q === null || s === null;

  const [blobs, setBlobs] = React.useState(initialBlobsState);
  const blobsLoaded = blobs.data.map((datum) => datum.loaded);
  const blobsTotal = blobs.data.map((datum) => datum.total);
  const blobsLoadedSum = sum(blobsLoaded);
  const blobsTotalSum = sum(blobsTotal);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  // Ensure all blob totals have been loaded and their sum is nonzero
  let blobsPercent = 0;
  if (
    blobsTotalSum &&
    blobsTotal.length === blobs.number &&
    // In case the final blobTotal is loaded giving the array the correct length
    // despite the array missing other blobTotals
    !blobsTotal.includes(undefined)
  ) {
    blobsPercent = (blobsLoadedSum * 100) / blobsTotalSum;
  }

  const [downloadStatus, setDownloadStatus] = React.useState({
    text: "",
    timeoutId: undefined,
  });

  const { reportsPerPage } = REPORTS_CONFIGURATION;

  const [removeSelectedReportsOpen, setRemoveSelectedReportsOpen] =
    React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState({
    status: false,
    origin: "",
  });
  const [checkedItems, setCheckedItems] = React.useState([]);

  const [removeAllReportsOpen, setRemoveAllReportsOpen] = React.useState(false);

  const isAnyItemChecked = !!checkedItems.length;

  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const [isRemovingReports, setIsRemovingReports] = React.useState(false);

  // Stop showing fallback when remove action completes
  React.useEffect(() => {
    if (isRemovingReports && fetcher.state === "idle" && !errors?.password) {
      setIsRemovingReports(false);
    }
  }, [isRemovingReports, fetcher.state, errors]);

  React.useEffect(() => {
    if (!errors?.password) setPasswordError("");
    else if (errors.password === "auth/wrong-password")
      setPasswordError("Incorrect password");
    else setPasswordError("Unknown error");
  }, [errors]);

  // Synchronize input values with URL search params
  // Browser navigation changes the URL, but not element values
  React.useEffect(() => {
    // If q changes from any value to undefined, reset q
    if (!q && prevQ) document.getElementById("q").value = q;
    if (!prevQ) setPrevQ(q);
  }, [q, prevQ, setPrevQ]);
  React.useEffect(() => {
    // If s changes from SELECT_VALUES.oldest to undefined, remount
    if (!s && prevS === SELECT_VALUES.oldest) setKey((prevKey) => !prevKey);
    if (prevS !== SELECT_VALUES.oldest) setPrevS(s);
  }, [s, prevS, setKey, setPrevS]);

  // Ensure checkedAll is unchecked even if a delete is unsuccessful
  React.useEffect(() => {
    if (!isAnyItemChecked) setCheckedAll({ status: false, origin: "form" });
  }, [isAnyItemChecked]);

  React.useEffect(() => {
    if (blobsPercent === 100) {
      setBlobs((prevBlobs) => ({ ...prevBlobs, status: "resolved" }));
    }
  }, [blobsPercent]);

  React.useEffect(() => {
    if (blobsPercent === 100 && checkedItems.length === 0) {
      setBlobs(initialBlobsState);
    }
  }, [blobsPercent, checkedItems]);

  React.useEffect(() => {
    if (blobs.status === "idle") {
      clearTimeout(downloadStatus.timeoutId);
      setDownloadStatus({
        text: "",
        timeoutId: undefined,
      });
    } else if (blobs.status === "pending") {
      clearTimeout(downloadStatus.timeoutId);
      setDownloadStatus({
        text: "Downloading reports...",
        timeoutId: undefined,
      });
    } else if (blobs.status === "resolved" && !downloadStatus.timeoutId) {
      const timeoutId = setTimeout(
        () => setDownloadStatus({ text: "Download complete.", timeoutId }),
        Progress.DEFAULT_DURATION
      );
    }
  }, [blobs.status, downloadStatus.timeoutId]);

  async function onRemoveSelectedReports() {
    setRemoveSelectedReportsOpen(false);
    setIsRemovingReports(true);
    setCheckedAll({ status: false, origin: "form" });
    setCheckedItems([]);
  }

  function onRemoveReportsClose() {
    setPassword("");
    setPasswordError("");
  }

  async function onRemoveAllReports() {
    setRemoveAllReportsOpen(false);
    setIsRemovingReports(true);
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

  async function onDownloadReports() {
    setBlobs(() => ({ ...initialBlobsState, status: "pending" }));

    try {
      const zip = new JSZip();

      const urlPromises = checkedItems.map((item) => {
        return getDownloadURL(
          ref(storage, `users/${user.current?.uid}/reports/${item}`)
        );
      });

      const urls = await Promise.all(urlPromises);

      const blobPromises = [];
      urls.forEach((url, index) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        blobPromises[index] = new Promise((resolve) => {
          xhr.addEventListener("load", () => {
            resolve(xhr.response);
          });
        });
        xhr.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            setBlobs((prevBlobs) => {
              // slice(0) is the most performant method of copying an array
              const data = prevBlobs.data.slice(0);
              data[index] = {
                loaded: event.loaded,
                total: event.total,
              };

              return {
                ...prevBlobs,
                status: "pending",
                data,
                number: urls.length,
              };
            });
          }
        });
        xhr.open("GET", url);
        xhr.send();
      });

      const blobs = await Promise.all(blobPromises);

      const dataPromises = blobs.map(async (blob) => {
        return await blob.text();
      });

      const data = await Promise.all(dataPromises);

      data.forEach((datum, index) => {
        zip.file(`${checkedItems[index]}.txt`, datum);
      });

      const base64 = await zip.generateAsync({ type: "base64" });
      const a = document.createElement("a");
      a.download = "reports.zip";
      a.href = "data:application/zip;base64," + base64;
      a.click();
    } catch (error) {
      setToastState(Toast.unknownState);
    }
  }

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

  const fallbackListHeader = (
    <ListHeader>
      <Group>
        <Checkbox label="Select all" checked={checkedAll.status} />
        <Location>Location</Location>
      </Group>
      <span>Timestamp</span>
    </ListHeader>
  );

  const fallbackListArea = (
    <ListArea>
      <VisuallyHidden>Loading reports</VisuallyHidden>
      {fallbackListHeader}
      <ReportsLoader />
    </ListArea>
  );

  const fallbackListAreaError = (
    <ListArea>
      {fallbackListHeader}
      <ReportsError>
        <FiAlertTriangle />
        Error loading reports
      </ReportsError>
    </ListArea>
  );

  const fallbackListFire = (
    <>
      <VisuallyHidden>Loading reports</VisuallyHidden>
      <ReportsLoader />
    </>
  );

  const fallbackListElements = (
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

  const fallbackBottom = (
    <Bottom>
      <Fallback.Text style={{ "--text-length": "192px" }} />
      <Button disabled>
        <FiTrash2 />
        Delete all reports
      </Button>
    </Bottom>
  );

  return (
    <Wrapper aria-live="polite" aria-atomic="true">
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
          <SelectRoot
            id="s"
            name="s"
            defaultValue={SELECT_VALUES.newest}
            label="Sort"
            // Clicking reports in the layout component causes the loader to be called but does not remount the reports page
            // Change the key to remount the select component when the URL has no s query param to synchronize its state with the URL
            key={key}
          >
            <Select.Item value={SELECT_VALUES.newest}>Newest first</Select.Item>
            <Select.Item value={SELECT_VALUES.oldest}>Oldest first</Select.Item>
          </SelectRoot>
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
                      onClick={() => {
                        setCheckedAll({ status: false, origin: "header" });
                        setCheckedItems([]);
                      }}
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
                      onClick={() => {
                        setCheckedAll({ status: false, origin: "header" });
                        setCheckedItems([]);
                      }}
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
      <React.Suspense fallback={fallbackListArea}>
        <Await resolve={reportsData} errorElement={fallbackListAreaError}>
          {(reportsData) => {
            const [reportsDocs] = reportsData;
            return (
              <ListArea>
                <ListHeader>
                  <Group>
                    <Checkbox
                      label="Select all"
                      checked={checkedAll.status}
                      onCheckedChange={(checked) =>
                        setCheckedAll({ status: checked, origin: "header" })
                      }
                    />
                    {checkedItems.length === 0 && !removeSelectedReportsOpen ? (
                      <Location>Location</Location>
                    ) : (
                      <Group>
                        <AlertDialog.Root
                          open={removeSelectedReportsOpen}
                          onOpenChange={setRemoveSelectedReportsOpen}
                        >
                          <AlertDialog.Trigger asChild>
                            <Button
                              variant="tertiary"
                              disabled={blobs.status === "pending"}
                            >
                              <FiTrash2 />
                              Delete reports
                            </Button>
                          </AlertDialog.Trigger>
                          <RemoveAlertDialogContent
                            header
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. This will permanently delete all selected reports from your account."
                            onCloseAutoFocus={onRemoveReportsClose}
                          >
                            <fetcher.Form
                              method="post"
                              onSubmit={onRemoveSelectedReports}
                              style={AlertDialog.contentChildrenStyles}
                            >
                              <TextInput
                                id="current-password"
                                name="password"
                                labelText="Password"
                                errorText={passwordError}
                                variant="password"
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                                value={password}
                              />
                              <AlertOptions>
                                <AlertDialog.Cancel asChild>
                                  <Button type="button" variant="secondary">
                                    <FiX />
                                    Cancel
                                  </Button>
                                </AlertDialog.Cancel>
                                <Button
                                  name="checked-items"
                                  value={JSON.stringify(checkedItems)}
                                >
                                  <FiCheck />
                                  Yes, delete reports
                                </Button>
                              </AlertOptions>
                            </fetcher.Form>
                          </RemoveAlertDialogContent>
                        </AlertDialog.Root>
                        <SubGroup>
                          <Button
                            variant="tertiary"
                            onClick={onDownloadReports}
                          >
                            <FiDownload />
                            Download reports
                          </Button>
                          <ProgressRoot>
                            <Progress.Indicator
                              progress={blobsPercent}
                              // Don't transition resetting the progress bar to 0
                              transition={blobs.number !== 0}
                            />
                          </ProgressRoot>
                          {downloadStatus.text}
                        </SubGroup>
                      </Group>
                    )}
                  </Group>
                  {checkedItems.length === 0 ? <span>Timestamp</span> : null}
                </ListHeader>
                {/* Render fallback for filters */}
                {navigation.location ? (
                  fallbackListElements
                ) : isRemovingReports ? (
                  fallbackListFire
                ) : reportsDocs.docs.length ? (
                  <List>
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
                ) : (
                  <ListMessage>
                    <FiHardDrive />
                    No reports
                  </ListMessage>
                )}
              </ListArea>
            );
          }}
        </Await>
      </React.Suspense>
      <React.Suspense fallback={fallbackBottom}>
        <Await
          resolve={reportsData}
          // Error displayed by reports suspense
          errorElement={<></>}
        >
          {(reportsData) => {
            // eslint-disable-next-line no-unused-vars
            const [reportsDocs, _, allReportsAggregate] = reportsData;
            const allReportsCount = allReportsAggregate?.data().count;

            return (
              <Bottom>
                <Capacity>
                  <Highlight>{allReportsCount}</Highlight>
                  {" of "}
                  <Highlight>{reportsConfiguration.capacity}</Highlight>
                  {" reports saved "}
                </Capacity>
                <AlertDialog.Root
                  open={removeAllReportsOpen}
                  onOpenChange={(removeAllReportsOpen) => {
                    setCheckedAll({ status: false, origin: "form" });
                    setCheckedItems([]);
                    setRemoveAllReportsOpen(removeAllReportsOpen);
                  }}
                >
                  <AlertDialog.Trigger asChild>
                    <Button
                      disabled={
                        fetcher.state !== "idle" || !reportsDocs.docs.length
                      }
                    >
                      <FiTrash2 />
                      Delete all reports
                    </Button>
                  </AlertDialog.Trigger>
                  <RemoveAlertDialogContent
                    header
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete all reports from your account."
                    onCloseAutoFocus={onRemoveReportsClose}
                  >
                    <fetcher.Form
                      method="post"
                      onSubmit={onRemoveAllReports}
                      style={AlertDialog.contentChildrenStyles}
                    >
                      <TextInput
                        id="current-password"
                        name="password"
                        labelText="Password"
                        errorText={passwordError}
                        variant="password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        value={password}
                      />
                      <AlertOptions>
                        <AlertDialog.Cancel asChild>
                          <Button type="button" variant="secondary">
                            <FiX />
                            Cancel
                          </Button>
                        </AlertDialog.Cancel>
                        <Button>
                          <FiCheck />
                          Yes, delete all reports
                        </Button>
                      </AlertOptions>
                    </fetcher.Form>
                  </RemoveAlertDialogContent>
                </AlertDialog.Root>
              </Bottom>
            );
          }}
        </Await>
      </React.Suspense>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </Wrapper>
  );
}

const Wrapper = styled.div`
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

const SelectRoot = styled(Select.Root)`
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

const ListArea = styled.div`
  flex: 1;
  --header-padding-vertical: 16px;
  --header-height: calc(
    var(--header-padding-vertical) * 2 + max(24px, 1rem * var(--line-height))
  );
  overflow-y: auto;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--header-padding-vertical) 48px;
  background-color: var(--color-gray-10);
  color: var(--color-gray-2);
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ListMessage = styled.div`
  // Account for sticky header
  height: calc(100% - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: ${18 / 16}rem;
  color: var(--color-gray-4);

  & > svg {
    font-size: ${24 / 16}rem;
    stroke: var(--color-gray-6);
  }
`;

const ReportsLoader = styled(FireLoader)`
  & > svg {
    ${Fallback.svg}
  }

  // Account for sticky header
  height: calc(100% - var(--header-height));
`;

const ReportsError = styled.div`
  // Account for sticky header
  height: calc(100% - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: ${24 / 16}rem;
  color: var(--color-gray-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  & > svg {
    font-size: ${32 / 16}rem;
    stroke: var(--color-gray-6);
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const SubGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProgressRoot = styled(Progress.Root)`
  width: 128px;
  height: 8px;
`;

const Location = styled.span`
  width: 256px;
`;

const RemoveAlertDialogContent = styled(AlertDialog.Content)`
  width: 512px;
`;

const AlertOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  isolation: isolate;
`;

const Bottom = styled.div`
  min-height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 48px;
`;

const Capacity = styled.div`
  color: var(--color-gray-3);
`;

const Highlight = styled.span`
  color: var(--color-yellow-2);
  font-weight: bold;
`;

export default Reports;
