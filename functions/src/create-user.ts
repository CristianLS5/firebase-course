import express = require("express");
import * as functions from "firebase-functions";
import { auth, db } from "./init";
import { getUserCredentialsMiddleware } from "./auth.middleware";

//bodyparsermiddleware --> is a commonly used express middleware
const bodyParser = require("body-parser");

//para permitir que la creacion del usuario se realice desde el backend
//en otro puerto y que sea reconocido por el frontend,
//hay que decírselo con la librería "cors" de express
const cors = require("cors");

export const createUserApp = express();

createUserApp.use(bodyParser.json());
//de esta forma nuestro endpoint está listo para recibir peticiones HTTP desde el frontal
createUserApp.use(cors({ origin: true }));
createUserApp.use(getUserCredentialsMiddleware);

//http methods available: post, get, delete

//esto es un servicio rest implementado como una cloud function de Firebase

createUserApp.post("/", async (request, response) => {
  functions.logger.debug(`Running create user function`);

  try {
    if (!("uid" in request && "admin" in request)) {
      const message = "Denied access to user creation service";
      functions.logger.debug(message);
      response.status(403).json({ message });
      return;
    }

    const email = request.body.email,
      password = request.body.password,
      admin = request.body.admin;

    const user = await auth.createUser({
      email,
      password,
    });

    await auth.setCustomUserClaims(user.uid, { admin });

    //crear un documento en la colección users
    db.doc(`users/${user.uid}`).set({});

    response.status(200).json({ message: "User craeted OK" });
  } catch (error) {
    functions.logger.error(`Could not created user: `, error);
    response.status(500).json({ message: "Could not created user" });
  }
});
