import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  // Método reutilizable para obtener headers con token
  private getAuthHeaders(contentType: string | null = 'application/json'): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = {
      Authorization: token ? `Bearer ${token}` : '',
    };

    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }

    return new HttpHeaders(headersConfig);
  }

  get<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    routerParams?: HttpParams
  ): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.get<T>(`${urlApi}/${endpoint}/${service}`, {
      params: routerParams,
      headers,
      withCredentials: true,
    });
  }

  post<T>(
    urlApi: string,
    endpoint: string,
      service: string,
    data: any
  ): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers,
      withCredentials: true,
    });
  }

  put<T>(
    urlApi: string,
    endpoint: string,
      service: string,
    data: any
  ): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.put<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers,
      withCredentials: true,
    });
    }
  postFile<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    data: FormData
  ): Observable<T> {
    const headers = this.getAuthHeaders(null);
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers,
      withCredentials: true,
    });
  }
}
