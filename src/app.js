import * as React from "react";

import { useAuth } from "context/auth-context";
import FireLoader from "components/fire-loader";

const MINIMUM_LOADING_TIME = 800;

const AuthenticatedApp = React.lazy(() => {
  return Promise.all([
    import("authenticated-app.js"),
    new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
  ]).then(([moduleExports]) => moduleExports);
});
const UnauthenticatedApp = React.lazy(() => {
  return Promise.all([
    import("unauthenticated-app.js"),
    new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
  ]).then(([moduleExports]) => moduleExports);
});

function App() {
  const { user } = useAuth();

  return (
    <React.Suspense fallback={<FireLoader />}>
      {user.current ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export default App;
