import { onCall, HttpsError } from "firebase-functions/v2/https";

import * as admin from "firebase-admin";

import * as smaregi from "../../functions/smaregi";
import { enforceAppCheck, secretKeys } from "../firebase";

const db = admin.firestore();

export default onCall(
  {
    region: "asia-northeast1",
    memory: "1GiB",
    enforceAppCheck,
    maxInstances: 10,
    secrets: secretKeys,
  },
  async (context) => {
    if (context.app == undefined) {
      throw new HttpsError("failed-precondition", "The function must be called from an App Check verified app.");
    }
    return await smaregi.storeList(db, context.data, context);
  },
);
