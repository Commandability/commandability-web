import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@pages/home";
import Account from "@pages/account";
import NotFound from "@pages/not-found";
import PrivacyPolicy from "@pages/privacy-policy";
import Message from "@pages/message";

import Layout from "@components/layout";
import DashboardContainer from "@components/dashboard-container";

import Reports, {
  loader as reportsLoader,
  action as reportsAction,
} from "@pages/reports";
import Roster from "@pages/roster";
import Groups from "@pages/groups";

import Report, { loader as reportLoader } from "@pages/report";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "dashboard",
    element: <Layout type="outlet" />,
    errorElement: <NotFound />,
    children: [
      {
        path: "reports",
        element: <DashboardContainer />,
        children: [
          {
            index: true,
            element: <Reports />,
            loader: reportsLoader,
            action: reportsAction,
          },
          {
            path: ":reportId",
            element: <Report />,
            loader: reportLoader,
          },
        ],
      },
      {
        path: "roster",
        element: <DashboardContainer />,
        children: [
          {
            index: true,
            element: <Roster />,
          },
        ],
      },
      {
        path: "groups",
        element: <DashboardContainer />,
        children: [
          {
            index: true,
            element: <Groups />,
          },
        ],
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
  {
    element: <Layout type="outlet" />,
    errorElement: <NotFound />,
    children: [
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "message",
        element: <Message />,
      },
    ],
  },
]);

function AuthenticatedApp() {
  return <RouterProvider router={router} />;
}

export default AuthenticatedApp;
