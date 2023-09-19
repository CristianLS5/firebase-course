import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map } from "rxjs/operators";
import { convertSnaps } from "./db-utils";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  //se definen los metódos usando la API pública  de FireStore para nuestro servicio

  loadCoursesByCategory(category: string): Observable<Course[]> {
    //FireStore  devuelve valores de tipo "QuerySnapshot" y noostros queremos valores
    //que sean del tipo de modelo "Course"
    return this.db
      .collection("courses", (ref) =>
        //array-contains permite realizar queries en casos donde el contenido sea un array
        ref.where("categories", "array-contains", category).orderBy("seqNo")
      )
      .get()
      .pipe(map((result) => convertSnaps<Course>(result)));
  }
}
