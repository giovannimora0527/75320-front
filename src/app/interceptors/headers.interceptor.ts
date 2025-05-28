/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';


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