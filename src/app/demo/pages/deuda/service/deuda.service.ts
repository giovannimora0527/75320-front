import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Deuda } from 'src/app/models/deuda';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  private api = 'deuda';

  constructor(private backendService: BackendService) {}

  getlistarDeudas(): Observable<Deuda[]> {
    return this.backendService.get<Deuda[]>(environment.apiUrl, this.api, 'listar');
  }

  getpagarDeuda(id: number, tipoPago: string): Observable<Deuda> {
    return this.backendService.put<Deuda>(
      environment.apiUrl,
      this.api,
      `${id}/pagar`,
      { tipoPago }
    );
  }
}
