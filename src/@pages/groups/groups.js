import * as React from "react";
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

import { useFirestoreUser } from "context/firestore-user-context";
import Group from "components/group";

function Groups() {
  const { firestoreUser } = useFirestoreUser();
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

  console.log(firestoreUser.data.groups);

  let userGroupData = firestoreUser.data.groups;

  let groupArray = generatePageLocations();
  let groupPage = [];
  for (let pageNum in groupArray) {
    groupPage.push(
      <TabsContent value={pageNum}>
        <GroupWrapper>
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[0]]
                ? userGroupData[groupArray[pageNum].locationIds[0]]
                : null
            }
          />
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[1]]
                ? userGroupData[groupArray[pageNum].locationIds[1]]
                : null
            }
          />
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[2]]
                ? userGroupData[groupArray[pageNum].locationIds[2]]
                : null
            }
          />
        </GroupWrapper>
        <GroupWrapper>
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[3]]
                ? userGroupData[groupArray[pageNum].locationIds[3]]
                : null
            }
          />
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[4]]
                ? userGroupData[groupArray[pageNum].locationIds[4]]
                : null
            }
          />
          <Group
            groupData={
              userGroupData[groupArray[pageNum].locationIds[5]]
                ? userGroupData[groupArray[pageNum].locationIds[5]]
                : null
            }
          />
        </GroupWrapper>
      </TabsContent>
    );
  }

  return (
    <Wrapper defaultValue="PAGE_1" orientation="horizontal">
      <Content>
        <>{groupPage[0]}</>
        <>{groupPage[1]}</>
        <>{groupPage[2]}</>
        <>{groupPage[3]}</>
        <>{groupPage[4]}</>
        <>{groupPage[5]}</>
        <GroupsPageNumbers>
          <div
            style={{ borderBottom: "1px solid var(--color-gray-1)", flex: 1 }}
          />
          <PageNumber value="PAGE_1">Page 1</PageNumber>
          <PageNumber value="PAGE_2">Page 2</PageNumber>
          <PageNumber value="PAGE_ 3">Page 3</PageNumber>
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
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  padding-top: 64px;
  padding-bottom: 32px;
`;

const TabsContent = styled(Tabs.Content)`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

const GroupWrapper = styled.ol`
  display: flex;
  justify-content: space-between;
  padding: 0px 80px;
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
