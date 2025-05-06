import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private api = 'prestamo';

  constructor(private backendService: BackendService) {}

  getPrestamos(): Observable<any[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar-prestamo');
  }

  crearPrestamo(data: any): Observable<any> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'crear-prestamo', data);
  }

  actualizarPrestamo(data: any): Observable<any> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'actualizar-entrega', data);
  }

  actualizarFechaEntrega(idPrestamo: number, fechaEntrega: string): Observable<any> {
    const params = new HttpParams()
      .set('idPrestamo', idPrestamo.toString())
      .set('fechaEntrega', fechaEntrega);
  
    return this.backendService.put(environment.apiUrlAuth, this.api, 'actualizar-entrega', { params });
  }

  getUsuarios(): Observable<any[]> {
    return this.backendService.get(environment.apiUrlAuth, 'usuario', 'listar');
  }

  getLibros(): Observable<any[]> {
    return this.backendService.get(environment.apiUrlAuth, 'libro', 'listar');
  }
}
