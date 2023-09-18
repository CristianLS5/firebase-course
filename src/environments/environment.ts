// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/plugins/zone-error"; // Included with Angular CLI.
