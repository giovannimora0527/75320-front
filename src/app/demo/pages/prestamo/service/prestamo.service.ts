import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { PrestamoRq } from 'src/app/models/prestamo-rq';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = 'prestamo';

  constructor(private backendService: BackendService) {}

  // Listar todos los préstamos
  listarPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }

  // Obtener préstamo por ID
  obtenerPrestamoPorId(id: number): Observable<Prestamo> {
    const params = new HttpParams().set('prestamoId', id.toString());
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar-prestamo-id', params);
  }

  // Crear un nuevo préstamo
  crearPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'crear-prestamo', prestamo);
  }

  // Guardar (actualizar) un préstamo: solo fechaEntrega
  guardarPrestamo(prestamoRq: PrestamoRq): Observable<any> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'guardar-prestamo', prestamoRq);
  }
}
