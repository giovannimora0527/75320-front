/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ✅ Importación agregada
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { Respuesta } from 'src/app/models/respuesta';

import { Nacionalidad } from 'src/app/models/nacionalidad';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private readonly api = `autor`;
  private readonly apiUrl = `${environment.apiUrl}/autor`; // ✅ Ruta específica para cargue CSV

  constructor(
    private readonly backendService: BackendService,
    private readonly http: HttpClient // ✅ HttpClient agregado
  ) { }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(autor: Autor): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }

  getNacionalidades(): Observable<Nacionalidad[]> {
    return this.backendService.get(environment.apiUrl, 'util', 'listar-nacionalidades');
  }

  // ✅ Lógica agregada para cargue masivo desde archivo CSV
  cargarAutoresCsv(file: File): Observable<{ message: string, data: Autor[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string, data: Autor[] }>(`${this.apiUrl}/cargar-autores`, formData);
  }
}
