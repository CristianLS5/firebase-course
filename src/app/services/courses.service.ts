import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { Course } from "../model/course";
import { concatMap, map } from "rxjs/operators";
import { convertSnaps } from "./db-utils";
import { Lesson } from "../model/lesson";
import firebase from "firebase";
import OrderByDirection = firebase.firestore.OrderByDirection;

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

  createCourse(newCourse: Partial<Course>, courseId?: string) {
    return this.db
      .collection("courses", (ref) =>
        //antes de crear un curso hay que saber cual es el que tiene el "seqNo" más
        //grande, para poder asignar el ID+1 al nuevo curso
        ref.orderBy("seqNo", "desc").limit(1)
      )
      .get()
      .pipe(
        concatMap((resultOfQuery) => {
          const courses = convertSnaps<Course>(resultOfQuery);
          // "||" significa que si no hay cursos disponibles, se pondria un 0
          //por defecto en lugar de un null
          //el operador  ??  solo considerará  null  o  undefined , no otros valores falsy como  0  o  ""
          //se mira el primer curso del array (courses[0]) ya que anteriormente ya se ha limitado
          //el número de cursos con el (limit(1))
          const lasCourseSeqNo = courses[0]?.seqNo || 0;

          const course = {
            ...newCourse,
            seqNo: lasCourseSeqNo + 1,
          };
          let save$: Observable<any>;
          if (courseId) {
            //si existe la ID  se usa el "set" para sobreescribir cualqueir cosa que hubiera
            //anteriormente bajo ese ID
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
            //si no existe la ID se usa el "add" para añadir un nuevo curso
          } else {
            save$ = from(this.db.collection("courses").add(course));
          }
          //en el caso de guardar un curso sin ID se debe hacer lo siguiente a través de "map"
          return save$.pipe(
            //internamente FireBase crea un ID, pero para poder verlo al guardar el curso,
            //lo mostramos en la response junto con el resto de propiedades del curso
            map((response) => {
              return {
                id: courseId || response.id,
                ...course,
              };
            })
          );
        })
      );
  }
  //devolverá un observable any, ya que sólo nos vale para saber si el curso se ha
  //modificado correctamente o no
  updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    //se añade el operador from, para transformar loque devuelve el update, que es de
    //tipo "Promise" a un observable
    return from(this.db.doc(`courses/${courseId}`).update(changes));
  }

  deleteCourse(courseId: string) {
    return from(this.db.doc(`courses/${courseId}`).delete());
  }

  deleteCourseAndLessons(courseId: string) {
    return this.db
      .collection(`courses/${courseId}/lessons`)
      .get()
      .pipe(
        concatMap((resultOfQuery) => {
          const lessons = convertSnaps<Lesson>(resultOfQuery);
          //se crea un batch write para poder eliminar todas las clases que contiene la
          //colección lessons para luego poder eliminar el documento curso asociado
          const batch = this.db.firestore.batch();

          //para poder eliminar las clases del curso, primeor hay que pillar la referencia
          //del curso que contiene las clases
          const courseRef = this.db.doc(`courses/${courseId}`).ref;

          batch.delete(courseRef);

          for (let lesson of lessons) {
            const lessonRef = this.db.doc(
              `courses/${courseId}/lessons/${lesson.id}`
            ).ref;

            batch.delete(lessonRef);
          }

          return from(batch.commit());
        })
      );
  }

  findCourseByUrl(courseUrl: string): Observable<Course | null> {
    return this.db
      .collection("courses", (ref) => ref.where("url", "==", courseUrl))
      .get()
      .pipe(
        map((resultOfQuery) => {
          //get the list of matching documents (courses)
          const courses = convertSnaps<Course>(resultOfQuery);

          //se comprueba que realmente devuelva un solo curso (url única)
          //si devuelve 1, la posición 0  correspondera al curso que coincide con la url
          //sinó el resultado será inválido
          return courses.length == 1 ? courses[0] : null;
        })
      );
  }

  findLessons(
    courseId: string,
    sortOrder: OrderByDirection = "asc",
    pageNumber = 0,
    pageSize = 3
  ): Observable<Lesson[]> {
    return this.db
      .collection(`courses/${courseId}/lessons`, (ref) =>
        ref
          .orderBy("seqNo", sortOrder)
          //limite de clases a mostrar
          .limit(pageSize)
          //para que empiece la query por el valor que se le inserta
          //en este caso mostraria 3 clases por cada página
          //si fuera pageNumber = 2, se mostrarian las clases 4,5,6, al ser la segunda página
          .startAfter(pageNumber * pageSize)
      )
      .get()
      .pipe(map((resultOfQuery) => convertSnaps<Lesson>(resultOfQuery)));
  }
}
