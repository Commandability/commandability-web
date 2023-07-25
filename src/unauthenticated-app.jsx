import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@components/layout";
import Home from "@pages/home";
import RouteError from "@pages/route-error";
import PrivacyPolicy from "@pages/privacy-policy";
import Message from "@pages/message";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteError />,
  },
  {
    element: <Layout type="outlet" />,
    errorElement: <RouteError />,
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

function UnauthenticatedApp() {
  return <RouterProvider router={router} />;
}

export default UnauthenticatedApp;
