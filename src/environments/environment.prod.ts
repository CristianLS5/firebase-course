//en este caso la config es la misma para dev que para PRD, pero en un caso real
//habría que ir a la config del pryecto, y dentro del proyecto, mirar
//Configuración del SDK --> Config

export const environment = {
  production: true,
  useEmulators: false,
  firebase: {
    apiKey: "AIzaSyBxR4ZprELbKZ0A7CUlpWD114tmYe_AGJQ",
    authDomain: "fir-course-bcfcb.firebaseapp.com",
    projectId: "fir-course-bcfcb",
    storageBucket: "fir-course-bcfcb.appspot.com",
    messagingSenderId: "296139394309",
    appId: "1:296139394309:web:c9ec151773bd49a5147b6c",
  },
  api: {
    //para PRD: se añadirá la URL resultante de ejecutar firebase deploy
    createUser: "",
  },
};


//para verificar la integridad de los archivos para PRD
//ng build --configuration production
//verificar que se ha deployado la última version de las functions con npm run build
//para deployar a PRD
//firebase deploy