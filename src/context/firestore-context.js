import * as React from "react";
import { onSnapshot } from "firebase/firestore";

const FirestoreContext = React.createContext();
FirestoreContext.displayName = "FirestoreContext";

function FirestoreProvider({ db, refData, snapshotOptions, children }) {
  const [firestore, setFirestore] = React.useState(() => {
    const state = {};
    refData.forEach(
      (refDatum) =>
        (state[refDatum.id] = {
          ref: refDatum.ref,
          snapshotOptions: refDatum.snapshotOptions,
          status: "pending",
          data: null,
          error: null,
        })
    );
    return state;
  });

  React.useEffect(() => {
    const unsubscribes = refData.map((refDatum) => {
      if (!refDatum.ref) return () => {};

      return onSnapshot(
        refDatum.ref,
        { ...refDatum.snapshotOptions },
        (doc) => {
          if (!doc.metadata.hasPendingWrites) {
            setFirestore((prevFirestore) => ({
              ...prevFirestore,
              [refDatum.id]: {
                ...prevFirestore[refDatum.id],
                status: "resolved",
                data: doc.data(),
                error: null,
              },
            }));
          } else {
            setFirestore((prevFirestore) => ({
              ...prevFirestore,
              [refDatum.id]: {
                ...prevFirestore[refDatum.id],
                status: "resolved",
                data: doc.data(),
                error: null,
              },
            }));
          }
        },
        (error) => {
          setFirestore((prevFirestore) => ({
            ...prevFirestore,
            [refDatum.id]: {
              ...prevFirestore[refDatum.id],
              status: "rejected",
              data: null,
              error,
            },
          }));
          throw new Error(error);
        }
      );
    });
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [refData, snapshotOptions]);

  const value = {
    db,
    firestore,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}

function useFirestore() {
  const context = React.useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error(`useFirestore must be used within a FirestoreProvider`);
  }
  return context;
}

export { FirestoreProvider, useFirestore };
