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
    return <TabsContent>{subGroupPageMap}</TabsContent>;
  });

  return (
    <Wrapper defaultValue="PAGE_1" orientation="horizontal">
      <Content>
        <GroupTab value="PAGE_1">{groupPageMap[0]}</GroupTab>
        <GroupTab value="PAGE_2">{groupPageMap[1]}</GroupTab>
        <GroupTab value="PAGE_3">{groupPageMap[2]}</GroupTab>
        <GroupTab value="PAGE_4">{groupPageMap[3]}</GroupTab>
        <GroupTab value="PAGE_5">{groupPageMap[4]}</GroupTab>
        <GroupTab value="PAGE_6">{groupPageMap[5]}</GroupTab>
        <GroupsPageNumbers>
          <div
            style={{ borderBottom: "1px solid var(--color-gray-6)", flex: 1 }}
          />
          <PageNumber value="PAGE_1">Page 1</PageNumber>
          <PageNumber value="PAGE_2">Page 2</PageNumber>
          <PageNumber value="PAGE_3">Page 3</PageNumber>
          <PageNumber value="PAGE_4">Page 4</PageNumber>
          <PageNumber value="PAGE_5">Page 5</PageNumber>
          <PageNumber value="PAGE_6">Page 6</PageNumber>
          <div
            style={{ borderBottom: "1px solid var(--color-gray-6)", flex: 1 }}
          />
        </GroupsPageNumbers>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled(Tabs.Root)`
  height: 100%;
`;

const TabsContent = styled.ol`
  height: 100%;
  width: 100%;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-column-gap: 48px;
  grid-row-gap: 48px;
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

const GroupTab = styled(Tabs.Content)`
  height: 100%;
  width: fit-content;
  margin: auto;
`;

const GroupsPageNumbers = styled(Tabs.List)`
  display: flex;
  padding-top: 32px;
`;

const PageNumber = styled(Tabs.Trigger)`
  flex: 2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  background-color: var(--color-gray-10);
  &[data-state="active"] {
    font-weight: bold;
    color: var(--color-yellow-3);
    border-bottom: solid 3px var(--color-yellow-3);
  }
  &[data-state="inactive"] {
    color: var(--color-gray-3);
    border-bottom: solid 1px var(--color-gray-6);
  }
  cursor: pointer;
`;

export default Groups;
