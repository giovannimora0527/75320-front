import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Prestamo } from 'src/app/models/prestamo.model';
import { Libro } from 'src/app/models/libro';
import { Usuario } from 'src/app/models/usuario';
import { Respuesta } from 'src/app/models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private api = 'prestamo';

  constructor(private backendService: BackendService) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar-prestamo');
  }

  crearPrestamo(data: any): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'crear-prestamo', data);
  }

  actualizarPrestamo(data: any): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'actualizar-entrega', data);
  }

  actualizarFechaEntrega(idPrestamo: number, fechaEntrega: string): Observable<any> {
    const params = new HttpParams()
      .set('idPrestamo', idPrestamo.toString())
      .set('fechaEntrega', fechaEntrega);
  
    return this.backendService.put(environment.apiUrlAuth, this.api, 'actualizar-entrega', { params });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrlAuth, 'usuario', 'listar');
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, 'libro', 'listar');
  }
}
