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
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }

  guardarUsuarioNuevo(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "guardar-usuario", usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "actualizar-usuario", usuario);
  }

  cargarUsuariosMasivos(usuarios: Usuario[]): Observable<Usuario[]> {
    return this.backendService.post(environment.apiUrlAuth, this.api, "cargar-masivo", usuarios);
  }

}