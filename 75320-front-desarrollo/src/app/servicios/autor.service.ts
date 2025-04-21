import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';    //Autor Daniel Perez ID: 885394
import { Observable } from 'rxjs';

export interface Autor {        //Autor Daniel Perez ID: 885394
  autorId?: number;                  
  nombre: string;               
  nacionalidad?: string;
  fechaNacimiento?: string;            
}

@Injectable({providedIn: 'root'})
export class AutorService {
  private baseUrl = 'http://localhost:8000/biblioteca/v1/api/autores';    //Autor Daniel Perez ID: 885394
  constructor(private http: HttpClient) { }                 

  listar(): Observable<Autor[]> {                           //Autor Daniel Perez ID: 885394
    return this.http.get<Autor[]>(this.baseUrl);
  }

  obtener(id: number): Observable<Autor> {                   //Autor Daniel Perez ID: 885394
    return this.http.get<Autor>(`${this.baseUrl}/${id}`);
  }

  crear(autor: Autor): Observable<Autor> {                    //Autor Daniel Perez ID: 885394
    return this.http.post<Autor>(this.baseUrl, autor);
  }

  actualizar(id: number, autor: Autor): Observable<any> {     //Autor Daniel Perez ID: 885394
    return this.http.put(`${this.baseUrl}/${id}`, autor);
  }

}
