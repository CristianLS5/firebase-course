//para conectarse  a la base de datos, primero hay que importar el admin package
//se usa las credenciales por defecto, ya que son utiles tanto para trabajar
//en local como en producción
const admin = require("firebase-admin");

//se inicializa la conexión. Funciona tanto en local (emulador) como en la consola de Firebase
admin.initializeApp();

//iniciamos conexión con ddbb, se llama a la instancia de admin y a la Firestore ddbb
export const db = admin.firestore();

export const auth = admin.auth();