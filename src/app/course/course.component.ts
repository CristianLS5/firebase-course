import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { finalize, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  course: Course;

  loading = false;

  displayedColumns = ["seqNo", "description", "duration"];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    //el Resolver permite coger un snapshot en el momento en que se llama al
    //ngOnInit del componente "course.component.ts" del estado del route
    //de esta forma se accede a los datos que haya en ese momento propocionados por
    //el Resolver linkado al componente.
    this.course = this.route.snapshot.data["course"];
  }
}
