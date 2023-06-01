import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Layout from "@components/layout";
import Home from "@pages/home";
import NotFound from "@pages/not-found";
import PrivacyPolicy from "@pages/privacy-policy";
import Message from "@pages/message";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} errorElement={<NotFound />} />
      <Route element={<Layout type="outlet" />} errorElement={<NotFound />}>
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="message" element={<Message />} />
      </Route>
    </>
  )
);

function UnauthenticatedApp() {
  return <RouterProvider router={router} />;
}

export default UnauthenticatedApp;
