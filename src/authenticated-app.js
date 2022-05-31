import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "components/layout";
import Report from "components/report";
import Person from "components/person";
import Group from "components/group";
import Home from "pages/home";
import Reports from "pages/reports";
import Roster from "pages/roster";
import Groups from "pages/groups";
import Settings from "pages/settings";
import NotFound from "pages/not-found";
import PrivacyPolicy from "pages/privacy-policy";

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Layout />}>
        <Route path="reports" element={<Reports />}>
          <Route path=":reportId" element={<Report />} />
        </Route>
        <Route path="roster" element={<Roster />}>
          <Route path=":personId" element={<Person />} />
        </Route>
        <Route path="groups" element={<Groups />}>
          <Route path=":groupId" element={<Group />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
}

export default AuthenticatedApp;
