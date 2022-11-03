import * as React from "react";
import { onSnapshot } from "firebase/firestore";

const SnapshotContext = React.createContext();
SnapshotContext.displayName = "SnapshotContext";

function SnapshotProvider({
  db,
  snapshotData: initialSnapshotData,
  snapshotOptions,
  children,
}) {
  const [snapshotData, setSnapshotData] = React.useState(initialSnapshotData);
  const [snapshots, setSnapshots] = React.useState(() => {
    const state = {};
    initialSnapshotData.forEach(
      (snapshotDatum) =>
        (state[snapshotDatum.id] = {
          ref: snapshotDatum.ref,
          snapshotOptions: snapshotDatum.snapshotOptions,
          status: "pending",
          data: null,
          error: null,
        })
    );
    return state;
  });

  React.useEffect(() => {
    const unsubscribes = snapshotData.map((snapshotDatum) => {
      if (!snapshotDatum.ref) return () => {};

      return onSnapshot(
        snapshotDatum.ref,
        { ...snapshotDatum.snapshotOptions },
        (snapshot) => {
          let data;
          if (snapshotDatum.ref.type === "document") {
            data = snapshot.data();
          } else if (
            snapshotDatum.ref.type === "collection" ||
            snapshotDatum.ref.type === "query"
          ) {
            data = snapshot.docs;
          } else {
            throw new Error(
              "Unexpected ref type. Please pass either a document, a collection, or a query."
            );
          }

          if (!snapshot.metadata.hasPendingWrites) {
            setSnapshots((prevSnapshot) => ({
              ...prevSnapshot,
              [snapshotDatum.id]: {
                ...prevSnapshot[snapshotDatum.id],
                status: "resolved",
                data,
                error: null,
              },
            }));
          } else {
            setSnapshots((prevSnapshot) => ({
              ...prevSnapshot,
              [snapshotDatum.id]: {
                ...prevSnapshot[snapshotDatum.id],
                // Should be pending because changes are local only
                status: "pending",
                data,
                error: null,
              },
            }));
          }
        },
        (error) => {
          setSnapshots((prevSnapshot) => ({
            ...prevSnapshot,
            [snapshotDatum.id]: {
              ...prevSnapshot[snapshotDatum.id],
              status: "rejected",
              data: null,
              error,
            },
          }));
        }
      );
    });
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [snapshotData, snapshotOptions]);

  const value = {
    db,
    snapshots,
    setSnapshotData,
  };

  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}

function useSnapshots() {
  const context = React.useContext(SnapshotContext);
  if (context === undefined) {
    throw new Error(`useSnapshot must be used within a SnapshotProvider`);
  }
  return context;
}

export { SnapshotProvider, useSnapshots };
