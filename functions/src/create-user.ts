import express = require("express");
import * as functions from "firebase-functions";

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

//http methods available: post, get, delete

//esto es un servicio rest implementado como una cloud function de Firebase

createUserApp.post("/", async (request, response) => {
  functions.logger.debug(`Running create user function`);

  try {
    const email = request.body.email,
      password = request.body.password,
      admin = request.body.admin;

    response.status(200).json({ message: "User craeted OK" });
  } catch (error) {
    functions.logger.error(`Could not created user: `, error);
    response.status(500).json({ message: "Could not created user" });
  }
});
