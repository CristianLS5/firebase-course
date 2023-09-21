import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { finalize, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  course: Course;

  lessons: Lesson[];

  loading = false;

  //para saber en que página se encuentra el usuario al apretar el boton
  //de loadMore se crea una variable que hará de tracking de la última
  //página cargada
  lastPageLoaded = 0;

  displayedColumns = ["seqNo", "description", "duration"];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    //el Resolver permite coger un snapshot en el momento en que se llama al
    //ngOnInit del componente "course.component.ts" del estado del route
    //de esta forma se accede a los datos que haya en ese momento propocionados por
    //el Resolver linkado al componente.
    this.course = this.route.snapshot.data["course"];

    this.loading = true;

    //se subscribe a la APi para recibir el array de clases,
    // se iguala lo que se recibe con la variable this.lessons para poder usarla luego
    this.coursesService
      .findLessons(this.course.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((lessons) => (this.lessons = lessons));
  }

  loadMoreLessons() {
    this.lastPageLoaded++;

    this.loading = true;

    this.coursesService
      .findLessons(this.course.id, "asc", this.lastPageLoaded)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        //para ir mostrando más cursos, se concatena, la página actual con la
        //nueva página recibida
        (lessons) => (this.lessons = this.lessons.concat(lessons))
      );
  }
}
