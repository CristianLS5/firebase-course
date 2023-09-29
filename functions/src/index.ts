import * as functions from "firebase-functions";
import { createUserApp } from "./create-user";

//los contenedores que se crean para ejecutar las cloud functions
//contendrán todas las funciones, independientemente de si se ejecuta una u otra.

export const onAddCourseUpdatePromoCounter = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .firestore.document("courses/{courseId}")
  .onCreate(async (snapshot, context) => {
    //el trigger de esta función es cuando se crea un nuevo documento,
    //se llama a la funcion que esta en el fichero "add-course.ts"
    //como son dos promesas, hay que esperar a que se resuelvan para realizar la siguiente acción
    //en este caso, está la transacción de la creación del documento:
    //.onCreate(async (snapshot, context) => { await (  await import("./promotions-counter/add-course"))
    //y el trigger para aumentar el contador de cursos en promoción que está
    //en el fichero "add-course.ts":
    //export default async (snapshot, context) => { await import("./promotions-counter/add-course")
    //al haber 2 promesas tiene que haber dos esperas (await)
    await (
      await import("./promotions-counter/add-course")
    ).default(snapshot, context);
  });

export const onUpdateCourseUpdatePromoCounter = functions.firestore
  .document("courses/{courseId}")
  .onUpdate(async (change, context) => {
    await (
      await import("./promotions-counter/update-course")
    ).default(change, context);
  });

export const onDeleteCourseUpdatePromoCounter = functions.firestore
  .document("courses/{courseId}")
  .onDelete(async (snapshot, context) => {
    await (
      await import("./promotions-counter/delete-course")
    ).default(snapshot, context);
  });

  //para acceder al endpoint de la funcion se mira al inciializar el emulador
  //en este caso:
  //functions[us-central1-createUser]: http function initialized (http://127.0.0.1:5001/fir-course-bcfcb/us-central1/createUser).
  //se añade al fichero "environments" para tenerla a mano
  export const createUser = functions.https.onRequest(createUserApp);
