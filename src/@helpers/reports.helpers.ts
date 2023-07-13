/*
  Reports helper functions
*/

import type { UserInfo } from "firebase/auth";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";

import { db, storage } from "firebase-config";

/**
 * Delete all reports in a user's account
 * @param uid - A firebase userId
 */
export async function deleteAllReports(uid: UserInfo["uid"]) {
  const reportsRef = collection(db, "users", uid, "reports-metadata");
  // Remove firestore metadata
  const batch = writeBatch(db);
  const reportsSnapshot = await getDocs(reportsRef);
  reportsSnapshot.docs.forEach((item) => {
    batch.delete(doc(reportsRef, item.id));
  });
  await batch.commit();

  // Remove files from storage
  const listRef = ref(storage, `users/${uid}/reports/`);
  const listResults = await listAll(listRef);
  const promises = listResults.items.map((itemRef) => {
    return deleteObject(itemRef);
  });
  await Promise.all(promises);
}
