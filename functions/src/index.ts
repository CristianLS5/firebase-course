/* eslint-disable object-curly-spacing */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// "onRequest" is going to be an endpoint for an htpp get request
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

// "runWith" sirve para estabelecer parametros de confguracion a la hora de
// definir las cloud funtions. Si se hace a través de la API de Firebase local
// hay valores límite, pero que se pueden sobrepasar si se crean las functions
// desde Google Functions Dashboard a través de la consola de Google Cloud
export const onAddCourseUpdatePromoCounter = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .firestore.document("courses/{courseId}")
  // onWrite engloba: onUpdate, onCreate y onDelete
  // el "snapshot" contendrá los datos que van a ser insertados en la bbdd
  // (el nuevo documento). "context" contendrá información del documento que
  // se va a crear, por ejemplo, la variable de la ruta que tendrá el doc
  // se añade el "async" para trabajar más fácilmente con la función, ya que
  // devuelve una promesa
  .onCreate(async (snapshot, context) => {
    functions.logger.debug(
      `Running add course trigger for courseId ${context.params.courseId}`
    );
  });

// hay que usar el comando "npm run build" para obtener la última
// versión de la carpeta "functions"

// ddbb trigger is a logic that we want to trigger on the sever
// side at the level of the Firestore server in response to a
// ddbb event.
