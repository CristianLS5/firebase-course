import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserRoles } from "../model/user-roles";

@Injectable({
  providedIn: "root",
})
export class UserService {
  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;

  pictureUrl$: Observable<string>;

  roles$: Observable<UserRoles>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // //para obtener la información del usuario, el JSON Web Token con el "idToken"
    // //se puede mirar lo que significa el token con -->  JWT.IO
    // afAuth.idToken.subscribe((token) => console.log("jwt: ", token));

    // //también se puede obtener información del usuario con el "authState"
    // afAuth.authState.subscribe((user) => console.log("auth object: ", user));

    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));

    this.isLoggedOut$ = afAuth.authState.pipe(map((isLoggedIn) => !isLoggedIn));

    this.pictureUrl$ = afAuth.authState.pipe(
      map((user) => (user ? user.photoURL : null))
    );

    //idTokenResult devuelve un objeto con el payload del JWT
    //idToken devuelve el JWT en formato string, en este caso nos interesa el primero
    this.roles$ = this.afAuth.idTokenResult.pipe(
      //se devuelven los custom claims que contienen los roles del usuario
      //si no contiene ninguno, se setea el valor de "admin" a false
      map((token) => <any>token?.claims ?? { admin: false })

      //con esto consigues que se muestren o escondan varios elementos de la
      //aplicación basado en el tipo de rol, pero el nivel de seguridad se hace
      //en la parte de "firestore.rules", aquí sólo se hace a nivel visual
    );
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl("/login");
  }
}
