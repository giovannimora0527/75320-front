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

  constructor(private backendService: BackendService) { }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }
}