import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from './Prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = 'http://localhost:8080/api/prestamos';

  constructor(private http: HttpClient) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  crearPrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.post(this.apiUrl, prestamo);
  }

  actualizarPrestamo(id: number, prestamo: Prestamo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, prestamo);
  }

  eliminarPrestamo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
