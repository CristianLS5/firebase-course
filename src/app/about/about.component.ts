import { Component, OnInit } from "@angular/core";

import "firebase/firestore";

import { AngularFirestore } from "@angular/fire/firestore";
import { COURSES, findLessonsForCourse } from "./db-data";
import { take } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent {
  //Ventajas de Firebase (noSQL database)
  //Flexibilidad: Puedes almacenar datos con diferentes estructuras
  //en la misma base de datos Firebase sin necesidad de modificar un esquema
  //Menos Overhead: No tienes que preocuparte por administrar tablas, índices
  //o relaciones complejas como en una base de datos relacional
  //Sincronización en Tiempo Real: Firebase es capaz de manejar la
  //sincronización en tiempo real de datos
  //Scheamless, great scalabality, don't need to bring down the database
  //can cause problems if some of the fields are mandatory or
  //if they can only have certain values
  //-------------
  //a COLLECTION is a queryable group of DOCUMENTS
  //the DOCUMENT cannot exist without the collection
  //nested COLLECTIONS are inside other COLLECTIONS for organization puproses
  //but if you query a collection you will only get the DOCUMENTS
  //if you want to query a COLLECTION inside another COLLECTION to get the documents you need
  //to specify the path for that COLLECTION. Example:
  ///COLLECTION_1/ID of the document in COLLECTION_1/COLLECTION_2
  //this way you are specifying a unique document that contains the collection

  constructor(private db: AngularFirestore) {}

  async uploadData() {
    const coursesCollection = this.db.collection("courses");
    const courses = await this.db.collection("courses").get();
    for (let course of Object.values(COURSES)) {
      const newCourse = this.removeId(course);
      const courseRef = await coursesCollection.add(newCourse);
      const lessons = await courseRef.collection("lessons");
      const courseLessons = findLessonsForCourse(course["id"]);
      console.log(`Uploading course ${course["description"]}`);
      for (const lesson of courseLessons) {
        const newLesson = this.removeId(lesson);
        delete newLesson.courseId;
        await lessons.add(newLesson);
      }
    }
  }

  removeId(data: any) {
    const newData: any = { ...data };
    delete newData.id;
    return newData;
  }

  onReadDocument() {
    this.db
      .doc("/courses/EGl3xkjxrJSYFYWC1vVM")
      .get()
      .subscribe((snapshot) => {
        console.log(snapshot.id);
        console.log(snapshot.data());
      });
  }

  onReadCollection() {
    // this.db
    //   .collection("/courses/GcErGoIrF3BI5asAecfe/lessons", (collecRef) =>
    //     collecRef.where("seqNo", "<=", 8).orderBy("seqNo")
    //   )
    //si un campo en particular de un documento contiene demasiada información y puede provocar problemas
    //de performance, se puede poner en la lista de excepciones para que FireStore
    //no indexe ese campo en particular. Se hace desde Indice --> Excepciones
    //---//
    //para realizar queries que incluyen dos o más campos, hay que crear el índice manualmente
    //en FireStore
    //--//
    //FireStore gana en performance porqué no puede realizar queries complejas como una base de datos normal
    this.db
      .collection("courses", (collecRef) =>
        collecRef
          .where("seqNo", "<=", 20)
          .where("url", "==", "angular-forms-course")
          .orderBy("seqNo")
      )
      .get()
      .subscribe((snapshots) => {
        snapshots.forEach((snapshot) => {
          console.log(snapshot.id);
          console.log(snapshot.data());
        });
      });
  }

  //se puede obtener un grupo de documentos de una COLLECTION entro de otra COLLECTION
  //para ello FireStore pedirá realizar otro índice para poder lanzar la query
  onReadCollectionGroup() {
    this.db
      .collectionGroup("lessons", (collecGrpRef) =>
        collecGrpRef.where("seqNo", "==", 1)
      )
      .get()
      .subscribe((snapshots) => {
        snapshots.forEach((snapshot) => {
          console.log(snapshot.id);
          console.log(snapshot.data());
        });
      });
  }

  //para que los cambios se puedan ver en tiempo real se usa el  .snapshotChanges()
  //de esta forma la observable recibe los cambios en tiempo real

  onChangeReadDocument() {
    this.db
      .doc("/courses/M22edM1UXCYUUkAgC0bw")
      //the client that uses the FireBase SDK and AngularFire is going to open a WebSocket
      //connection against the FireStore backend server and via that connection,
      //we can get in real time, new version of that document
      .snapshotChanges()
      .subscribe((snapshot) => {
        console.log(snapshot.payload.id);
        console.log(snapshot.payload.data());
      });
  }

  onChangeReadCollection() {
    this.db
      .collection("courses", (collecRef) =>
        collecRef
          .where("seqNo", "<=", 20)
          .where("url", "==", "angular-security-course")
          .orderBy("seqNo")
      )
      .snapshotChanges()
      .subscribe((snapshots) => {
        snapshots.forEach((snapshot) => {
          console.log(snapshot.payload.doc.id);
          console.log(snapshot.payload.doc.data());
        });
      });
  }

  onValueChangeReadDocument() {
    this.db
      .doc("/courses/EGl3xkjxrJSYFYWC1vVM")
      //con el valueChanges se recibe los datos directamente, sin ser snapshot, sin el identificador
      //para casos donde el id no es necesario, ya que se proporciona en la misma llamada
      //a la API de FireStore
      //valueChanges y snapshotChanges son observables que se mantienen abiertas
      //hasta que no se cierran explícitamente "unsubscribe()"
      //se puede usar el take() o el first)(), el first daría error si el observable se completa
      //antes de que hubiera datos y el take, se espera hasta coger el primer valor emitido, "take(1)"
      .valueChanges()
      //.pipe(take(1))
      .subscribe((course) => {
        console.log(course);
      });
  }
}
