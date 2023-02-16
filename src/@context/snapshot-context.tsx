import * as React from "react";
import {
  onSnapshot,
  Firestore,
  DocumentReference,
  Query,
  DocumentData,
  SnapshotListenOptions,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  FirestoreError,
} from "firebase/firestore";

type SnapshotRef = DocumentReference<DocumentData> | Query<DocumentData> | null;

type SnapshotDatum = {
  id: string;
  ref: SnapshotRef;
  options: SnapshotListenOptions;
};

type Snapshot = {
  ref: SnapshotRef;
  options: SnapshotListenOptions;
  status: "pending" | "resolved" | "rejected";
  data: any | null;
  error?: FirestoreError | null;
};

type Snapshots = {
  [index: string]: Snapshot;
};

type SnapshotContext = {
  db: Firestore;
  snapshots: Snapshots;
  setSnapshotData: React.Dispatch<React.SetStateAction<SnapshotDatum[]>> | null;
};

declare module "firebase/firestore" {
  /**
   * An overload of firestore's onSnapshot that supports a union reference parameter
   * @param snapshotRef - The reference to a document or query to listen to.
   * @param options - Options controlling the listen behavior.
   * @param onNext - A callback to be called every time a new `DocumentSnapshot` or `QuerySnapshot` is available.
   * @param onError - A callback to be called if the listen fails or is cancelled. No further callbacks will occur.
   * @param onCompletion - Can be provided, but will not be called since streams are never ending.
   * @returns An unsubscribe function that can be called to cancel the snapshot listener.
   */
  function onSnapshot<T>(
    snapshotRef: SnapshotRef,
    options: SnapshotListenOptions,
    onNext: (snapshot: DocumentSnapshot<T> | QuerySnapshot<T>) => void,
    onError?: (error: FirestoreError) => void,
    onCompletion?: () => void
  ): Unsubscribe;
}

const SnapshotContext = React.createContext<SnapshotContext | null>(null);
SnapshotContext.displayName = "SnapshotContext";

type SnapshotProviderProps = {
  db: Firestore;
  snapshotData: SnapshotDatum[];
  children: React.ReactNode;
};

function SnapshotProvider({
  db,
  snapshotData: initialSnapshotData,
  children,
}: SnapshotProviderProps) {
  const [snapshotData, setSnapshotData] =
    React.useState<SnapshotDatum[]>(initialSnapshotData);
  const [snapshots, setSnapshots] = React.useState<Snapshots>(() => {
    const state: Snapshots = {};
    initialSnapshotData.forEach(
      (snapshotDatum) =>
        (state[snapshotDatum.id] = {
          ref: snapshotDatum.ref,
          options: snapshotDatum.options,
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
        { ...snapshotDatum.options },
        (snapshot) => {
          setSnapshots((prevSnapshot) => ({
            ...prevSnapshot,
            [snapshotDatum.id]: {
              ...prevSnapshot[snapshotDatum.id],
              status: snapshot.metadata.hasPendingWrites
                ? "pending"
                : "resolved",
              data:
                snapshot instanceof DocumentSnapshot
                  ? snapshot.data()
                  : snapshot.docs,
              error: null,
            },
          }));
        },
        (error: FirestoreError) => {
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
  }, [snapshotData]);

  const snapshotContext: SnapshotContext = {
    db,
    snapshots,
    setSnapshotData,
  };

  return (
    <SnapshotContext.Provider value={snapshotContext}>
      {children}
    </SnapshotContext.Provider>
  );
}

function useSnapshots() {
  const context = React.useContext(SnapshotContext);
  if (!context) {
    throw new Error(`useSnapshot must be used within a SnapshotProvider`);
  }
  return context;
}

export { SnapshotProvider, useSnapshots };
