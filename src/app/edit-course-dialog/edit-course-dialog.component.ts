import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";

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
    @Inject(MAT_DIALOG_DATA) course: Course
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

  close() {
    this.dialogRef.close();
  }
}
