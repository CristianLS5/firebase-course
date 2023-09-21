import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "edit-course-dialog",
  templateUrl: "./edit-course-dialog.component.html",
  styleUrls: ["./edit-course-dialog.component.css"],
})
export class EditCourseDialogComponent {
  form: FormGroup;

  course: Course;

  constructor(
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    private fb: FormBuilder,
    //se reciben los datos del curso que se va a editar a través de la dependency
    //Injection que viene dado por el componente "courses-card-list.component"
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService
  ) {
    this.course = course;

    //al ser un formulario de edicion del curso, el formulario contendrá los datos del curso
    //para ello, el diálogo de edición se abrirá modo dependency Injection con los datos
    //@Inject(MAT_DIALOG_DATA)
    this.form = this.fb.group({
      description: [course.description, Validators.required],
      longDescription: [course.longDescription, Validators.required],
      promo: [course.promo],
    });
  }

  save() {
    const changes = this.form.value;

    //esto devolvera un observable, por lo que hay que subscribirse
    this.coursesService.updateCourse(this.course.id, changes).subscribe(() => {
      //para distinguir el cierre del dialogo, de cuando se cierra sin modificar
      //y modificado, se añaden los cambios realizados del curso
      this.dialogRef.close(changes);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
