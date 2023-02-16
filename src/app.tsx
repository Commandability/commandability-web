import * as React from "react";
import { collection, doc } from "firebase/firestore";

import { db } from "firebase-config";
import { SnapshotProvider } from "@context/snapshot-context";
import { useAuth } from "@context/auth-context";
import FireLoader from "@components/fire-loader";

const MINIMUM_LOADING_TIME = 200;

const AuthenticatedApp = React.lazy(() => {
  return Promise.all([
    import("authenticated-app.jsx"),
    new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
  ]).then(([moduleExports]) => moduleExports);
});
const UnauthenticatedApp = React.lazy(() => {
  return Promise.all([
    import("unauthenticated-app.jsx"),
    new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
  ]).then(([moduleExports]) => moduleExports);
});

const snapshotOptions = { includeMetadataChanges: true };

function App() {
  const { user } = useAuth();

  return (
    // Load firestore data as soon as a user is available
    <SnapshotProvider
      db={db}
      snapshotData={[
        {
          id: "user",
          ref: user.current ? doc(db, "users", user.current.uid) : null,
          options: { ...snapshotOptions },
        },
        {
          id: "configuration",
          ref: collection(db, "configuration"),
          options: { ...snapshotOptions },
        },
      ]}
    >
      <React.Suspense fallback={<FireLoader />}>
        {user.current ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    </SnapshotProvider>
  );
}

export default App;
