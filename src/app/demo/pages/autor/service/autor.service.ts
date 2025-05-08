import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service'; // Asegúrate de que este path sea correcto
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Autor, AutorRq, AutorRs } from 'src/app/models/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private api: string = 'autor'; // Define the 'api' property

  constructor(private backendService: BackendService) {
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }

  crearAutor(autor: AutorRq): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrlAuth,
      this.api, "crear", autor);
  }

  actualizarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.put(environment.apiUrlAuth,
      this.api, "actualizar", autor);
  }
}