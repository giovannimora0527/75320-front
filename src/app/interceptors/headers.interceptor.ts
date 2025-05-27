import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let clonedRequest = req;

    if (!(req.body instanceof FormData)) {
      clonedRequest = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      clonedRequest = req.clone({
        setHeaders: {} // Puedes añadir otros headers aquí si son comunes a FormData y no JSON, ej. Authorization
      });
    }

    return next.handle(clonedRequest);
  }
}