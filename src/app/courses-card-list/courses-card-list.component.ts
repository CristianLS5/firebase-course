import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.css"],
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[];

  @Output()
  courseEdited = new EventEmitter();

  @Output()
  courseDeleted = new EventEmitter<Course>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "400px";

    //se pasan los datos del curso para que sean editados al componente que se encargará de ello
    //en este caso el EditCourseDialogComponent
    dialogConfig.data = course;

    this.dialog
      .open(EditCourseDialogComponent, dialogConfig)
      //se comprueba si después de cerrar el diálogo, se ha modificado el curso
      .afterClosed()
      //en este caso si se recibe cualquier valor, el evento emitirá estos valores con
      // un evento Ouput (courseEdited), usando el EventEmitter. Este evento informará
      //a  cualquier componente que se comunique con "course-card-list", que el cursos
      //se ha editado
      .subscribe((val) => {
        if (val) {
          this.courseEdited.emit();
        }
      });
  }

  //al eliminar un curso, no se eliminan las lessons asociadas al él, ya que no es private
  //del documento, sinó que es una collección
  deleteCourse(course: Course) {
    this.coursesService
      .deleteCourseAndLessons(course.id)
      .pipe(
        tap(() => {
          console.log("Course deleted: ", course);
          this.courseDeleted.emit(course);
        }),
        catchError((error) => {
          console.log("could not be deleted: " + error);
          return throwError(error);
        })
      )
      .subscribe();
  }
}
