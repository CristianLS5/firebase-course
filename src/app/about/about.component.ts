import { Component, OnInit } from "@angular/core";

import "firebase/firestore";

import { AngularFirestore } from "@angular/fire/firestore";
import { COURSES, findLessonsForCourse } from "./db-data";

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
}
