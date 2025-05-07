import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from '../../models/prestamo.model';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'https://api.example.com/prestamos'; // Reemplaza con tu URL real

  constructor(private http: HttpClient) {}

  obtenerPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  crearPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }

  actualizarPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${prestamo.id}`, prestamo);
  }
}