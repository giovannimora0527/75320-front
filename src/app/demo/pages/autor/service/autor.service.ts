import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private apiUrl = 'https://api.example.com/autores'; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  crearAutor(autor: Autor): Observable<void> {
    return this.http.post<void>(this.apiUrl, autor);
  }

  actualizarAutor(autor: Autor): Observable<void> {
    const url = `${this.apiUrl}/${autor.id}`;
    return this.http.put<void>(url, autor);
  }
}
