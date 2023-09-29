import * as functions from "firebase-functions";
import { auth } from "./init";

//middleware function always has 3 parameters: request, response, next
//next --> allows the request to go thorugh the rest of the middleware chain

//this function is only to extract the credentials if exists
export function getUserCredentialsMiddleware(
  request: any,
  response: any,
  next: any
) {
  functions.logger.debug(`Extracting user credentials from request`);

  const jwt = request.headers.authorization;

  if (jwt) {
    auth
      .verifyIdToken(jwt)
      .then((jwtPayload: any) => {
        request["uid"] = jwtPayload.uid;
        request["admin"] = jwtPayload.admin;

        functions.logger.debug(
          `Credentals: uid=${jwtPayload.uid}, admin=${jwtPayload.admin}`
        );
        next();
      })
      .catch((error: Error) => {
        console.log("Error ocurred while validating the JWT: ", error);
        next();
      });
  } else {
    //if the credentials doesn't exist, calling the next method will allow the request to
    //go thorugh the rest of the middleware chain.
    //The responsability of reject the request is on the endpoint, not the middleware
    next();
  }
}
