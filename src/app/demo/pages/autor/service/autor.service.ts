import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`; // Esto se concatena con los endpoints como "listar", "crear", etc.
  constructor(private backendService: BackendService) { }
 // 1. Obtener listado de autores
  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }

  // 2. Crear nuevo autor
  crearAutor(autor: Autor): Observable<Autor> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'guardar-autor', autor);
  }

  // 3. Actualizar autor
  actualizarAutor(autor: Autor):  Observable<Autor> {
      return this.backendService.post(environment.apiUrlAuth, 
        this.api, "actualizar-autor", autor);
  }
}
