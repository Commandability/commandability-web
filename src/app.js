import * as React from "react";

import { useAuth } from "context/auth-provider";
import Spinner from "components/spinner";

const AuthenticatedApp = React.lazy(() => import("authenticated-app.js"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app.js"));

function App() {
  const [user] = useAuth();

  if (user.status === "pending") {
    return <Spinner />;
  } else if (user.status === "error") {
    throw new Error(user.error);
  }

  return (
    <React.Suspense fallback={<Spinner />}>
      {user.current ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export default App;
