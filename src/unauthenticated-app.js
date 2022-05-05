import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "components/layout";
import Home from "pages/home";
import NotFound from "pages/not-found";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default UnauthenticatedApp;
