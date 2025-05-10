import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRs } from 'src/app/models/prestamo-rs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = 'prestamo';

  constructor(private backendService: BackendService) { }

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }

  guardarPrestamo(prestamo: Prestamo): Observable<PrestamoRs> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "prestar", prestamo)
  }

  actualizarPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'actualizar-prestamo', prestamo);
  }


}
