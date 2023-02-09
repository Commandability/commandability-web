import * as React from "react";
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

import { useSnapshots } from "@context/snapshot-context";
import Group from "@components/group";

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

  let userGroupData = snapshots.user.data.groups;

  let groupArray = generatePageLocations();
  let groupPage = new Map();
  let subGroupPage;
  let groupNumIndex = [];

  for (let pageNum in groupArray) {
    subGroupPage = new Map();
    for (let groupNum in groupArray[pageNum].locationIds) {
      subGroupPage.set(
        pageNum + groupNum,
        <Group
          groupData={
            userGroupData[groupArray[pageNum].locationIds[groupNum]]
              ? userGroupData[groupArray[pageNum].locationIds[groupNum]]
              : null
          }
          groupId={groupArray[pageNum].locationIds[groupNum]}
          userGroupData={userGroupData}
          key={pageNum + groupNum}
        />
      );
      groupNumIndex.push(groupNum);
    }
    groupPage.set(
      pageNum,
      <TabsContent>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[0])}</PlainOl>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[1])}</PlainOl>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[2])}</PlainOl>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[3])}</PlainOl>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[4])}</PlainOl>
        <PlainOl>{subGroupPage.get(pageNum + groupNumIndex[5])}</PlainOl>
      </TabsContent>
    );
  }

  return (
    <Wrapper defaultValue="PAGE_1" orientation="horizontal">
      <Content>
        <GroupTab value="PAGE_1">{groupPage.get("PAGE_1")}</GroupTab>
        <GroupTab value="PAGE_2">{groupPage.get("PAGE_2")}</GroupTab>
        <GroupTab value="PAGE_3">{groupPage.get("PAGE_3")}</GroupTab>
        <GroupTab value="PAGE_4">{groupPage.get("PAGE_4")}</GroupTab>
        <GroupTab value="PAGE_5">{groupPage.get("PAGE_5")}</GroupTab>
        <GroupTab value="PAGE_6">{groupPage.get("PAGE_6")}</GroupTab>
        <GroupsPageNumbers>
          <div
            style={{ borderBottom: "1px solid var(--color-gray-1)", flex: 1 }}
          />
          <PageNumber value="PAGE_1">Page 1</PageNumber>
          <PageNumber value="PAGE_2">Page 2</PageNumber>
          <PageNumber value="PAGE_3">Page 3</PageNumber>
          <PageNumber value="PAGE_4">Page 4</PageNumber>
          <PageNumber value="PAGE_5">Page 5</PageNumber>
          <PageNumber value="PAGE_6">Page 6</PageNumber>
          <div
            style={{ borderBottom: "1px solid var(--color-gray-1)", flex: 1 }}
          />
        </GroupsPageNumbers>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled(Tabs.Root)`
  height: 100%;
`;

const PlainOl = styled.ol`
  list-style: none;
  padding-left: 0;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  padding-top: 64px;
  padding-bottom: 32px;
`;

const GroupTab = styled(Tabs.Content)`
  height: 100%;
`;

const TabsContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 0fr 1fr;
  grid-template-rows: auto;
  grid-row-gap: 48px;
  place-items: center;
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
    border-bottom: solid 1px var(--color-gray-1);
  }
`;

export default Groups;
