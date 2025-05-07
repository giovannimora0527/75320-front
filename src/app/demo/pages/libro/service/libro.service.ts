import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private api = `libro`;

  constructor(private backendService: BackendService) {}

  getLibrosDisponibles(): Observable<Libro[]> {
    if (!environment.apiUrl) {
      console.error('Error: environment.apiUrl no está definido en tus archivos de entorno.');
      throw new Error('La URL base de la API no está configurada.');
    }
    return this.backendService.get<Libro[]>(environment.apiUrl, this.api, 'listar-disponibles');
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get<Libro[]>(environment.apiUrl, this.api, 'listar');
  }
}