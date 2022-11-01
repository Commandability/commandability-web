import * as React from "react";
import { doc, collection } from "firebase/firestore";

import { db } from "firebase.js";
import { FirestoreProvider } from "context/firestore-context";
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

const snapshotOptions = { includeMetadataChanges: true };

function App() {
  const { user } = useAuth();

  return (
    // Load firestore data as soon as a user is available
    <FirestoreProvider
      db={db}
      refData={[
        {
          id: "user",
          ref: user.current ? doc(db, "users", user.current.uid) : null,
          snapshotOptions: { ...snapshotOptions },
        },
        {
          id: "reports",
          ref: user.current
            ? collection(db, "users", user.current.uid, "reports")
            : null,
        },
      ]}
    >
      <React.Suspense fallback={<FireLoader />}>
        {user.current ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    </FirestoreProvider>
  );
}

export default App;
