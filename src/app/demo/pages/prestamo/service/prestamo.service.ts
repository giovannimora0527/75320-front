import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { Respuesta } from 'src/app/models/respuesta';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly api = `prestamo`;

  constructor(private readonly backendService: BackendService) {}

  listarPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  guardarPrestamo(prestamo: Prestamo): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrl, this.api, 'crear', prestamo);
  }

  entregarLibro(prestamo: Prestamo): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrl, this.api, 'actualizar', prestamo);
  }
}
