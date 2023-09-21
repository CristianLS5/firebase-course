import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;

  pictureUrl$: Observable<string>;

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
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl("/login");
  }
}
