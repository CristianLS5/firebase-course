import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../init";

export default async (change: any, context: any) => {
  //para prevenir un loop infinito donde la función se ejecute infinitamente
  //por ir updateando el contador del documento "stats" después de crear un curso
  //con el parametro "promo" = true
  //se crea un IF para no tener en cuenta el documento "stats"
  if (context.params.courseId === "stats") {
    return;
  }

  functions.logger.debug(
    `Running update course trigger for courseId ${context.params.courseId}`
  );

  //para acceder a los datos antes del Update
  const oldData = change.before.data();

  //para acceder a los datos después del Update
  const newData = change.after.data();

  let promoCount = 0;
  //para determinar cuando aumentar o disminuir el contador de cursos en promocion

  if (!oldData.promo && newData.promo) {
    promoCount = 1;
  } else if (oldData.promo && !newData.promo) {
    promoCount = -1;
  }

  if (promoCount == 0) {
    return;
  }

  return db.doc("courses/stats").update({
    totalPromo: FieldValue.increment(promoCount),
  });
};
