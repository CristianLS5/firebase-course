import * as functions from "firebase-functions";
import { db } from "./init";

import { FieldValue } from "firebase-admin/firestore";

export const onAddCourseUpdatePromoCounter = 
//aquí hay dos transacciones
//la primera que se ejecuta al añadir un nuevo documento
functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .firestore.document("courses/{courseId}")
  .onCreate(async (snapshot, context) => {
    //la segunda que se ejecuta si el curso tiene el campo "promo" a true
    functions.logger.debug(
      `Running add course trigger for courseId ${context.params.courseId}`
    );

    const course = snapshot.data();

    if (course.promo) {
      return db.doc("courses/stats").update({
        totalPromo: FieldValue.increment(1),
      });
    }
  });
