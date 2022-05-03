import * as React from "react";

import { useAuth } from "context/auth-provider";
import Spinner from "components/spinner";

const AuthenticatedApp = React.lazy(() => import("authenticated-app.js"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app.js"));

function App() {
  const [currentUser] = useAuth();

  return (
    <React.Suspense fallback={<Spinner />}>
      {currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export default App;
