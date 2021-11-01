import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      setHeaders: { "Authorization": "Bearer " + authToken }
    });

    return next.handle(authRequest).pipe(tap(event => {
      //console.log(event);
    }));
  }
}
