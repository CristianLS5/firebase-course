import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../init";

export default async (snapshot: any, context: any) => {
  functions.logger.debug(
    `Running delete course trigger for courseId ${context.params.courseId}`
  );

  const course = snapshot.data();

  if (!course.promo) {
    return;
  }

  return db.doc("courses/stats").update({
    totalPromo: FieldValue.increment(-1),
  });
};
