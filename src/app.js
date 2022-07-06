import * as React from "react";

import { useAuth } from "context/auth-context";
import FireLoader from "components/fire-loader";

const AuthenticatedApp = React.lazy(() => import("authenticated-app.js"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app.js"));

function App() {
  const { user } = useAuth();

  return (
    <React.Suspense fallback={<FireLoader />}>
      {user.current ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export default App;
