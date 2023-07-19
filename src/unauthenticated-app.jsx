import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@components/layout";
import Home from "@pages/home";
import NotFound from "@pages/not-found";
import PrivacyPolicy from "@pages/privacy-policy";
import Message from "@pages/message";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
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

function UnauthenticatedApp() {
  return <RouterProvider router={router} />;
}

export default UnauthenticatedApp;
