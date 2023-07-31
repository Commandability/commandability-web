import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, writeBatch, collection } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { db, storage } from "firebase-config";
import { deleteAllReports } from "@helpers/reports.helpers";

export async function action({ request }) {
  const errors = {};
  const formData = await request.formData();
  const password = formData.get("password");

  const { currentUser } = getAuth();

  const userCredentials = await EmailAuthProvider.credential(
    currentUser.email,
    password
  );
  try {
    await reauthenticateWithCredential(currentUser, userCredentials);
  } catch (error) {
    errors.password = error.code;
    return errors;
  }

  const reportsRef = collection(
    db,
    "users",
    currentUser.uid,
    "reports-metadata"
  );

  if (formData.has("checked-items")) {
    const checkedItems = JSON.parse(formData.get("checked-items"));
    // Remove firestore metadata
    const batch = writeBatch(db);
    checkedItems.forEach((item) => {
      batch.delete(doc(reportsRef, item));
    });
    await batch.commit();
    // Remove files from storage
    for (const item of checkedItems) {
      const itemRef = ref(storage, `users/${currentUser.uid}/reports/${item}`);
      await deleteObject(itemRef);
    }
  } else {
    await deleteAllReports(currentUser.uid);
  }

  return null;
}
