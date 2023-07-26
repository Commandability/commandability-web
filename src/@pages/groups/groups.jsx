import * as React from "react";
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

import { useSnapshots } from "@context/snapshot-context";
import Group from "@components/groups/group";

function Groups() {
  const { snapshots } = useSnapshots();
  const generatePageLocations = () => {
    const numberOfPages = 6;
    const groupsPerPage = 6;

    const generatePageLocationIds = (firstGroupNum) => {
      const groupLocationIds = [];
      for (let groupCount = 0; groupCount < groupsPerPage; groupCount++) {
        groupLocationIds.push(`GROUP_${firstGroupNum + groupCount}`);
      }
      return groupLocationIds;
    };

    const pageLocations = {};

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      pageLocations[`PAGE_${pageNum}`] = {
        pageId: `PAGE_${pageNum}`,
        name: `PAGE ${pageNum}`,
        locationIds: generatePageLocationIds(numberOfPages * (pageNum - 1) + 1),
      };
    }
    return pageLocations;
  };

  let userGroupData = [];
  if (snapshots.configuration.status !== "pending") {
    userGroupData = snapshots.user.data.groups;
  }

  let groupArray = generatePageLocations();
  let groupPage = [];
  let subGroupPage;

  for (let pageNum in groupArray) {
    subGroupPage = [];
    for (let groupNum in groupArray[pageNum].locationIds) {
      subGroupPage.push(groupArray[pageNum].locationIds[groupNum]);
    }
    groupPage.push(subGroupPage);
  }

  let groupPageMap;
  let subGroupPageMap;

  groupPageMap = groupPage.map((pageNum) => {
    subGroupPageMap = pageNum.map((groupNum) => {
      return (
        <Group
          groupData={userGroupData[groupNum] ? userGroupData[groupNum] : null}
          groupId={groupNum}
          userGroupData={userGroupData}
          key={groupNum}
          snapshotStatus={snapshots.configuration.status}
        />
      );
    });
    // eslint-disable-next-line react/jsx-key
    return <GroupPage>{subGroupPageMap}</GroupPage>;
  });

  return (
    <Wrapper defaultValue="PAGE_1" orientation="horizontal">
      <Content>
        <TabContent value="PAGE_1">{groupPageMap[0]}</TabContent>
        <TabContent value="PAGE_2">{groupPageMap[1]}</TabContent>
        <TabContent value="PAGE_3">{groupPageMap[2]}</TabContent>
        <TabContent value="PAGE_4">{groupPageMap[3]}</TabContent>
        <TabContent value="PAGE_5">{groupPageMap[4]}</TabContent>
        <TabContent value="PAGE_6">{groupPageMap[5]}</TabContent>
        <GroupsPageNumbers>
          <PageNumber value="PAGE_1">Page 1</PageNumber>
          <PageNumber value="PAGE_2">Page 2</PageNumber>
          <PageNumber value="PAGE_3">Page 3</PageNumber>
          <PageNumber value="PAGE_4">Page 4</PageNumber>
          <PageNumber value="PAGE_5">Page 5</PageNumber>
          <PageNumber value="PAGE_6">Page 6</PageNumber>
        </GroupsPageNumbers>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled(Tabs.Root)`
  height: 100%;
  padding: 0 120px;
`;

const GroupPage = styled.ol`
  height: 100%;
  width: 100%;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 48px;
  place-items: center;
  padding-left: 0;
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  padding-bottom: 32px;
`;

const TabContent = styled(Tabs.Content)`
  height: 100%;
  width: 100%;
  margin: auto;
`;

const GroupsPageNumbers = styled(Tabs.List)`
  display: flex;
  padding-top: 32px;
  --tab-border-color: var(--text-accent-secondary);
`;

const PageNumber = styled(Tabs.Trigger)`
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: none;
  background-color: var(--color-gray-10);

  &[data-state="active"] {
    color: var(--color-yellow-2);
    border-bottom: solid 2px var(--color-yellow-4);
  }

  &[data-state="inactive"] {
    color: var(--text-secondary);
    border-bottom: solid 1px var(--tab-border-color);
  }
`;

export default Groups;
