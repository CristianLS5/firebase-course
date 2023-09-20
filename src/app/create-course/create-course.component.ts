import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Course } from "../model/course";
import { catchError, concatMap, last, map, take, tap } from "rxjs/operators";
import { from, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "create-course",
  templateUrl: "create-course.component.html",
  styleUrls: ["create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  courseId: string;

  form = this.fb.group({
    description: ["", Validators.required],
    category: ["BEGINNER", Validators.required],
    url: ["", Validators.required],
    longDescription: ["", Validators.required],
    promo: [false],
    promoStartAt: [null],
  });

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    //in order to generate an unique identifier for the course into FireStore we need
    //to use the AngularFire service
    private afService: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    //client side generated ID using the AngularFire API
    this.courseId = this.afService.createId();
  }

  onCreateCourse() {
    //al ser "category" un array de valores, no se puede coger los datos del formulario a pelo
    // const newCourse = {
    //   ...this.form.value,
    // } as Course;

    const val = this.form.value;
    //is  a partial course because we don't have the ID
    const newCourse: Partial<Course> = {
      description: val.description,
      url: val.url,
      longDescription: val.longDescription,
      promo: val.promo,
      categories: [val.category],
      promoStartAt: val.promoStartAt,
    };

    //we need to modify the timestamp from the form to a firestore timestamp
    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);

    console.log(newCourse);

    this.coursesService
      .createCourse(newCourse, this.courseId)
      .pipe(
        tap((course) => {
          console.log("course created", course);
          this.router.navigateByUrl("/courses");
        }),
        catchError((error) => {
          console.log("error creating the course");
          return throwError(error);
        })
      )
      .subscribe();
  }
}
