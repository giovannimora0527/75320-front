import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = `prestamo`;

  constructor(private backendService: BackendService) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }
}