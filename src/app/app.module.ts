import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from "@angular/fire/auth";
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from "@angular/fire/firestore";
import {
  AngularFireFunctionsModule,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
} from "@angular/fire/functions";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { EditCourseDialogComponent } from "./edit-course-dialog/edit-course-dialog.component";
import { LoginComponent } from "./login/login.component";
import { CoursesCardListComponent } from "./courses-card-list/courses-card-list.component";
import { AppRoutingModule } from "./app-routing.module";
import { CourseComponent } from "./course/course.component";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CreateUserComponent } from "./create-user/create-user.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatNativeDateModule } from "@angular/material/core";
import { AuthInterceptor } from "./services/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    CourseComponent,
    CoursesCardListComponent,
    EditCourseDialogComponent,
    LoginComponent,
    CreateCourseComponent,
    CreateUserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    //se inicializa la app de Firebase con las credenciales de las
    //variables de entorno que se encuentran en "environment.ts"
    AngularFireModule.initializeApp(environment.firebase),
    //sirve para conectarse a Firestore usando AngularFire
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
  ],
  providers: [
    //para que funciona el emulador de FireStore
    //to test predefined users connected to the database with different roles
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators ? ["localhost", 9099] : undefined,
    },
    //este emulador nos da una versión local de la base de datos FireStore
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ["localhost", 8080] : undefined,
    },
    //to run FireBase Cloud funtions locally
    {
      provide: USE_FUNCTIONS_EMULATOR,
      useValue: environment.useEmulators ? ["localhost", 5001] : undefined,
    },
    //para iniciar SÓLO la parte de FireStore
    ////firebase emulator:start --only firestore////
    //es una base de datos temporal que se usa para pruebas
    //si cierras la conexión local, los datos que hay en FireStore se borran
    //para exportar los datos que se han creado en el emulador de FireStore
    /////firebase emulators:export NOMBRE_DE_LA_CARPETA ///
    //para importar los datos creados al emulador, y no tene que crearlos cada vez
    //firebase emulators:start --only firestore --import NOMBRE_DE_LA_CARPETA
    //---//
    //para no tener que escribir el comando entero cada vez se puede poner en una
    //"npm command" para acortarlo, en este caso se va al fichero package.json
    //en scripts: ejemplo -->
    //"local-dev-firebase": "firebase emulators:start --only firestore,auth,functions --import test-data",
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
