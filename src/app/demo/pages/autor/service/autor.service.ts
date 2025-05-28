import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRq } from 'src/app/models/autor-rq';
import { AutorRs } from 'src/app/models/autor-rs';
import { RespuestaGenerica } from 'src/app/models/respuesta-generica';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) {
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }

  crearAutor(autor: AutorRq): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "guardar", autor);
  }

  actualizarAutor(autor: AutorRq): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "actualizar", autor);
  }

  cargarAutoresDesdeCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.backendService.postFile(
      environment.apiUrlAuth,
      this.api,
      'cargar-autores',
      formData
    );
  }
}
