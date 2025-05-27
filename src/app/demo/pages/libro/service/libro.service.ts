import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { Respuesta } from 'src/app/models/respuesta';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly api = `libro`;

  constructor(private readonly backendService: BackendService) {

  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }

  getLibrosDisponiblesForPrestamo(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar-for-prestamo");
  }

  crearLibro(libro: Libro): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "crear-libro", libro);
  }

  actualizarLibro(libro: Libro): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "actualizar-libro", libro);
  }

  cargarLibrosMasivos(libros: Libro[]): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'cargar-masivo', libros);
  }
}