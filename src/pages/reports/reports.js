import * as React from "react";
import styled from "styled-components";
import {
  FiSliders,
  FiTrash2,
  FiX,
  FiCheck,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

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
import TextInput from "components/text-input";

const selectValues = {
  newest: "newest",
  oldest: "oldest",
};

function Reports() {
  const [select, setSelect] = React.useState(selectValues.newest);
  const [checked, setChecked] = React.useState(false);

  const [openAlertDialog, setAlertDialogOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");

  function onAlertDialogAction(e) {
    e.preventDefault();
    setAlertDialogOpen(false);
  }

  return (
    <Wrapper>
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
        <Button theme="light" icon={FiSliders}>
          Filter
        </Button>
      </Top>
      <ListHeader>
        <Checkbox
          label="Select all"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked)}
        />
      </ListHeader>
      <List></List>
      <Bottom>
        <Button theme="light" icon={FiDownload}>
          Export all
        </Button>
        <AlertDialog open={openAlertDialog} onOpenChange={setAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button theme="light" icon={FiTrash2}>
              Delete All
            </Button>
          </AlertDialogTrigger>
          <DeleteAllAlertDialogContent
            header
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete all reports from your account."
          >
            <TextInput
              type="password"
              id="password-input"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Options>
              <AlertDialogCancel asChild>
                <Button icon={FiX} theme="light">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={onAlertDialogAction}
                  icon={FiCheck}
                  theme="light"
                >
                  Yes, Delete All Reports
                </Button>
              </AlertDialogAction>
            </Options>
          </DeleteAllAlertDialogContent>
        </AlertDialog>
        <UnstyledButton>
          <VisuallyHidden>Page left</VisuallyHidden>
          <FiChevronLeft />
        </UnstyledButton>
        <UnstyledButton>
          <VisuallyHidden>Page right</VisuallyHidden>
          <FiChevronRight />
        </UnstyledButton>
      </Bottom>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  padding: 8px 48px;
`;

const List = styled.div`
  flex: 1;
  width: 100%;
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

const DeleteAllAlertDialogContent = styled(AlertDialogContent)`
  width: 512px;
`;

const Options = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export default Reports;
