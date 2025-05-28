import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRs } from 'src/app/models/usuarioRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = `usuario`;

  constructor(private backendService: BackendService) {
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarUsuarioNuevo(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", usuario);
  }

  //  Lógica agregada para cargue masivo desde archivo CSV
  cargarUsuariosCsv(archivo: File): Observable<UsuarioRs> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.backendService.postFormData(environment.apiUrl, this.api, 'cargar-usuarios', formData);
  }
}
