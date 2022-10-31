import * as React from "react";
import styled from "styled-components";
import { useNavigation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import {
  FiTrash2,
  FiX,
  FiCheck,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { useFirestoreUser } from "context/firestore-user-context";
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
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import Button from "components/button";
import ReportItem from "components/report-item";

const selectValues = {
  newest: "newest",
  oldest: "oldest",
};

function Reports() {
  const navigation = useNavigation();

  const { userRef } = useFirestoreUser();

  const [select, setSelect] = React.useState(selectValues.newest);

  const [removeReportsOpen, setRemoveReportsOpen] = React.useState(false);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const [reports, setReports] = React.useState();

  async function removeReports(checkedItems) {}

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

  React.useEffect(() => {
    const effect = async () => {
      await getDocs(collection(userRef, "reports")).then(
        async (querySnapshot) => {
          setReports(querySnapshot.docs);
        }
      );
    };
    effect();
  }, [userRef]);

  return (
    <Wrapper>
      {navigation.state === "loading" ? <Loading /> : null}
      <Top>
        <ReportsSelect
          select={select}
          onValueChange={(select) => setSelect(select)}
          defaultValue={selectValues.newest}
          label="Sort"
        >
          <SelectItem value={selectValues.newest}>Newest first</SelectItem>
          <SelectItem value={selectValues.oldest}>Oldest first</SelectItem>
        </ReportsSelect>
      </Top>
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
      <List aria-live="polite" aria-atomic="true">
        {reports?.map((report) => {
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
  opacity: 0.25;
  transition: opacity 200ms;
  transition-delay: 200ms;
  background-color: var(--color-gray-3);
  z-index: 2147483647;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 32px 48px;
`;

const ReportsSelect = styled(Select)`
  width: 160px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 48px;
  color: var(--color-gray-2);
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

const List = styled.ul`
  flex: 1;
  width: 100%;
  list-style: none;
  padding-left: 0;

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

const Bottom = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 48px;
`;

export default Reports;
