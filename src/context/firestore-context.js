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
        (snapshot) => {
          let data;
          if (refDatum.ref.type === "document") {
            data = snapshot.data();
          } else if (refDatum.ref.type === "collection") {
            data = snapshot.docs;
          } else {
            throw new Error(
              "Unexpected ref type. Please pass either a document or a collection."
            );
          }

          if (!snapshot.metadata.hasPendingWrites) {
            setFirestore((prevFirestore) => ({
              ...prevFirestore,
              [refDatum.id]: {
                ...prevFirestore[refDatum.id],
                status: "resolved",
                data,
                error: null,
              },
            }));
          } else {
            setFirestore((prevFirestore) => ({
              ...prevFirestore,
              [refDatum.id]: {
                ...prevFirestore[refDatum.id],
                // Should be pending because changes are local only
                status: "pending",
                data,
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
