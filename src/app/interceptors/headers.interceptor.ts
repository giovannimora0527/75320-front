<<<<<<< HEAD
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
>>>>>>> 3098747 (Frontend ultima entrega semestre)


@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });
<<<<<<< HEAD
    const hasContentType = clonedRequest.headers.has('Content-Type');

=======
   
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    return next.handle(clonedRequest);
  }

  addHeaders(request: HttpRequest<unknown>): HttpRequest<any> {
    return (request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    }));
  }
}