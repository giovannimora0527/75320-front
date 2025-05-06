import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRq } from 'src/app/models/prestamo-rq';
import { PrestamoEntregaRq } from 'src/app/models/prestamo-entrega-rq';
import { RespuestaGenerica } from 'src/app/models/respuesta-generica';
import { UsuarioDisponible } from 'src/app/models/usuario-disponible';
import { LibroDisponible } from 'src/app/models/libro-disponible';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
 
  private api = 'prestamos';

  constructor(private backendService: BackendService) {}

  listarPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }

  guardarPrestamo(prestamo: PrestamoRq): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'guardar', prestamo);
  }

  registrarEntrega(data: PrestamoEntregaRq): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'actualizar-entrega', data);
  }

  obtenerUsuariosDisponibles(): Observable<UsuarioDisponible[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'usuarios-disponibles');
  }

  obtenerLibrosDisponibles(): Observable<LibroDisponible[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'libros-disponibles');
  }
}