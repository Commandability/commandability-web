import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} errorElement={<NotFound />} />
      <Route
        path="dashboard"
        element={<Layout type="outlet" />}
        errorElement={<NotFound />}
      >
        <Route path="reports" element={<Reports />}>
          <Route path=":reportId" element={<Report />} />
        </Route>
        <Route path="roster" element={<Roster />}>
          <Route path=":badge" element={<Person />} />
        </Route>
        <Route path="groups" element={<Groups />}>
          <Route path=":groupId" element={<Group />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route element={<Layout type="outlet" />} errorElement={<NotFound />}>
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </>
  )
);

function AuthenticatedApp() {
  return <RouterProvider router={router} />;
}

export default AuthenticatedApp;
