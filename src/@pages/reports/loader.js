import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
  getDocs,
  where,
  Timestamp,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { defer } from "react-router-dom";

import { db } from "firebase-config";
import { REPORTS_CONFIGURATION, SELECT_VALUES } from "./config";

export async function loader({ request }) {
  const { currentUser } = getAuth();

  const { reportsPerPage, fields } = REPORTS_CONFIGURATION;

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const s = url.searchParams.get("s");
  const p = url.searchParams.get("p");
  const f = url.searchParams.get("f");
  const l = url.searchParams.get("l");
  const urlSearchParams = { q, s, p, f, l };

  const dateTimeStart = Date.parse(q) / 1000;
  let dateTimeEnd = 0;
  if (dateTimeStart) {
    dateTimeEnd = dateTimeStart + 24 * 60 * 60;
  }

  // Create a new Timestamp from the serialized one because
  // JSON.stringify does not serialize prototypes, which are necessary for firebase query cursors
  let rangeQueryParams = [limit(reportsPerPage)];
  if (p === "next" && f && l) {
    rangeQueryParams = [
      limit(reportsPerPage),
      startAfter(new Timestamp(parseInt(l), 0)),
    ];
  } else if (p === "prev" && f && l) {
    rangeQueryParams = [
      limitToLast(reportsPerPage),
      endBefore(new Timestamp(parseInt(f), 0)),
    ];
  }

  let prevDocsQueryParams = [];
  if (f) prevDocsQueryParams = [endBefore(new Timestamp(parseInt(f), 0))];

  let reportsQueryParams;
  if (q && dateTimeStart) {
    reportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports-metadata"),
      where(
        fields.startTimestamp,
        ">=",
        new Timestamp(parseInt(dateTimeStart), 0)
      ),
      where(
        fields.startTimestamp,
        "<",
        new Timestamp(parseInt(dateTimeEnd), 0)
      ),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];
  } else {
    reportsQueryParams = [
      collection(db, "users", currentUser.uid, "reports-metadata"),
      orderBy(
        fields.startTimestamp,
        s === SELECT_VALUES.oldest ? undefined : "desc"
      ),
    ];
  }

  return defer({
    ...urlSearchParams,
    reportsData: Promise.all([
      getDocs(query(...reportsQueryParams, ...rangeQueryParams)),
      getCountFromServer(query(...reportsQueryParams, ...prevDocsQueryParams)),
      getCountFromServer(query(...reportsQueryParams)),
    ]),
  });
}
