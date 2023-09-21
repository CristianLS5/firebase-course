import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import * as firebaseui from "firebaseui";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  //para el tema de autenticación se usará Firebase authentication usando la librería FireBaseUI

  //internamente, FireBaseUI usa FireBase SDK y para usar la authenticacion hay que
  //esperar que el SDK esté inicializado
  ui: firebaseui.auth.AuthUI;

  //AngularFireAUth es un servicio que permite interactuar con todo lo relacionado
  //con la autenticación de FireBase
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    //la propiedad app es una promesa que se resuelve cuando la libreria FireBase SDK
    //está lista para usarse. Es en este punto donde ya podemos utilizar FireBaseUI
    this.afAuth.app.then((app) => {
      const uiConfig = {
        signInOptions: [
          EmailAuthProvider.PROVIDER_ID,
          GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSucessfull.bind(this),
        },
      };
      //iniciando FireBaseUI, usando el firebase contructor.
      //se necesita un argumento que recibimos de "this.afAuth.app", que sería el "app"
      //desde aquí se llama al método auth
      this.ui = new firebaseui.auth.AuthUI(app.auth());

      this.ui.start("#firebaseui-auth-container", uiConfig);

      //para autologuearte la próxima vez que entras a la aplicacion sin necesidad de
      //pedirte credenciales cada vez
      //en este caso lo ponemos para probar
      this.ui.disableAutoSignIn();
    });
  }

  //se necesita destruir la instancia de FIreBase creada aldestruir el componente de login,
  // cuando se cambia de pantalla (componente)
  ngOnDestroy() {
    this.ui.delete();
  }

  //el metodo lo llamara FireBaseUi cada vez un login se hace correctamente
  //se recibe el resultado desde FireBaseUI. Para que el "this" funcione en
  //el contexto dentro del método hay que ponerlo en el callback, de esta forma
  //se hace refrencia a la instancia del componente LoginComponent
  onLoginSucessfull(result) {
    console.log("firebase UI result: ", result);

    this.router.navigateByUrl("/courses");
  }
}
