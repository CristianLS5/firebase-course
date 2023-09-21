import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;

  pictureUrl$: Observable<string>;

  constructor(private afAuth: AngularFireAuth) {
    //para obtener la información del usuario, el JSON Web Token con el "idToken"
    //se puede mirar lo que significa el token con -->  JWT.IO
    afAuth.idToken.subscribe((token) => console.log("jwt: ", token));

    //también se puede obtener información del usuario con el "authState"
    afAuth.authState.subscribe((user) => console.log("auth object: ", user));
  }
}
