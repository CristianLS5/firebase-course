import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthTokenService } from "./auth-token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: AuthTokenService) {}

  //tal como funciona el interceptor, al ser lazy loading, la primera vez que se craera un usuario, el
  //token.authJwtToken estaría vacío, para que no pase, hay que añadir el servicio
  //en la app.component.ts

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //si existe un token de authorizacion, se clona la peticion con el nuevo token
    if (this.token.authJwtToken) {
      const clonedRequest = request.clone({
        headers: request.headers.set("Authorization", this.token.authJwtToken),
      });

      return next.handle(clonedRequest);

      //si no existe un token de authorizacion, el output del interceptor será el token original
    } else {
      next.handle(request);
    }
  }
}
