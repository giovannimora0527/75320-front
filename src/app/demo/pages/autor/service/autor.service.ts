import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

<<<<<<< Updated upstream
  constructor() { }
=======
  // 2. Crear nuevo autor
  crearAutor(autor: Autor): Observable<Autor> {
    return this.backendService.post(environment.apiUrlAuth, this.api, 'guardar-autor', autor);
  }

  // 3. Actualizar autor
  actualizarAutor(autor: Autor):  Observable<Autor> {
      return this.backendService.post(environment.apiUrlAuth, 
        this.api, "actualizar-autor", autor);
  }
>>>>>>> Stashed changes
}
