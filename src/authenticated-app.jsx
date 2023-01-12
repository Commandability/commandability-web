import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Home from "@pages/home";
import Account from "@pages/account";
import NotFound from "@pages/not-found";
import PrivacyPolicy from "@pages/privacy-policy";

import Layout from "@components/layout";
import DashboardContainer from "@components/dashboard-container";

import Reports, {
  loader as reportsLoader,
  action as reportsAction,
} from "@pages/reports";
import Roster from "@pages/roster";
import Groups from "@pages/groups";

import Report, { loader as reportLoader } from "@pages/report";
import Person from "@pages/person";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} errorElement={<NotFound />} />
      <Route
        path="dashboard"
        element={<Layout type="outlet" />}
        errorElement={<NotFound />}
      >
        <Route path="reports" element={<DashboardContainer />}>
          <Route
            index
            element={<Reports />}
            loader={reportsLoader}
            action={reportsAction}
          />
          <Route path=":reportId" element={<Report />} loader={reportLoader} />
        </Route>
        <Route path="roster" element={<DashboardContainer />}>
          <Route index element={<Roster />} />
          <Route path=":badge" element={<Person />} />
        </Route>
        <Route path="groups" element={<DashboardContainer />}>
          <Route index element={<Groups />} />
        </Route>
        <Route path="account" element={<Account />} />
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
