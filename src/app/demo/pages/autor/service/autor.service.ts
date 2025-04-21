import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/demo/models/autor.model';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) { }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }

  crearAutor(autor: Autor): Observable<Autor> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<Autor> {
    return this.backendService.put(environment.apiUrlAuth, this.api, "actualizar-autor", autor);
  }
}
