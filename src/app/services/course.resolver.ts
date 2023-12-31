import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { CoursesService } from "./courses.service";
import { Observable } from "rxjs";
import { Course } from "../model/course";

//se inyecta como un servicio normal aunque se implemente una interfaz (Resolve<Course>)
@Injectable({
  providedIn: "root",
})

//se tiene que añadir "Resolve" para que sea un resolver
export class CourseResolver implements Resolve<Course> {
  constructor(private coursesService: CoursesService) {}

  //el método resolve devolverá un observable tipo COurse
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course> {
    const courseUrl = route.paramMap.get("courseUrl");

    return this.coursesService.findCourseByUrl(courseUrl);
  }
}
