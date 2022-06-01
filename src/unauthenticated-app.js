import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "components/layout";
import Home from "pages/home";
import NotFound from "pages/not-found";
import PrivacyPolicy from "pages/privacy-policy";
import TermsOfService from "pages/terms-of-service";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
      </Route>
    </Routes>
  );
}

export default UnauthenticatedApp;
