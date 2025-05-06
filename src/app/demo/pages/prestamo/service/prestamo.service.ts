import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prestamo } from '../prestamo.model';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'http://localhost:8000/biblioteca/v1/prestamo';  // URL de la API

  constructor(private http: HttpClient) {}

  listarPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/listar`).pipe(
      catchError(error => {
        console.error('Error al listar préstamos:', error);
        return throwError(() => new Error('Error al obtener la lista de préstamos.'));
      })
    );
  }

  crearPrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, prestamo).pipe(
      catchError(error => {
        console.error('Error al crear préstamo:', error);
        return throwError(() => new Error('Error al crear el préstamo.'));
      })
    );
  }

  actualizarPrestamo(id: number, prestamo: Prestamo): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${id}`, prestamo).pipe(
      catchError(error => {
        console.error('Error al actualizar préstamo:', error);
        return throwError(() => new Error('Error al actualizar el préstamo.'));
      })
    );
  }
}
