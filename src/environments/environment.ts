// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //si useEmulators es true, el entorno se conectará localmente, si es false
  //usará la conexión de firebase cloud
  useEmulators: false,
  //credenciales de firebase para conectarse a la base de datos del servidor cloud (firebase.google)
  firebase: {
    apiKey: "AIzaSyBxR4ZprELbKZ0A7CUlpWD114tmYe_AGJQ",
    authDomain: "fir-course-bcfcb.firebaseapp.com",
    projectId: "fir-course-bcfcb",
    storageBucket: "fir-course-bcfcb.appspot.com",
    messagingSenderId: "296139394309",
    appId: "1:296139394309:web:c9ec151773bd49a5147b6c",
  },
  api: {},
};

//para conectarse a  firebase localmente a través de emulador por comando se usa:
//firebase login --> donde pedirá el correo de gmail
//firebase init --> para iniciar el proceso de creación de la base de datos en local
//se necesita crear un storage si no existe
//----//


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/plugins/zone-error"; // Included with Angular CLI.
