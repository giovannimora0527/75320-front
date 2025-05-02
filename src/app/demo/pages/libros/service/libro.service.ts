import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { LibroRq } from 'src/app/models/libro-rq';
import { LibroRs } from 'src/app/models/libro-rs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private api = `libro`;
 
  constructor(private backendService: BackendService) {
    this.testService();
  }
 
  testService() {
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }
 
  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }
 
  crearLibros(libro: LibroRq): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrlAuth,
      this.api, "guardar-libro", libro);
  }
 
  actualizarLibros(libro: Libro): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrlAuth,
      this.api, "actualizar-libro", libro);
  }
}