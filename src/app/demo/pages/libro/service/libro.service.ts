import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
<<<<<<< HEAD
=======
import { LibroRs } from 'src/app/models/libro-rs';
import { Respuesta } from 'src/app/models/respuesta';
>>>>>>> 3098747 (Frontend ultima entrega semestre)
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly api = `libro`;
<<<<<<< HEAD
  
  constructor(private readonly backendService: BackendService) { 
   
=======

  constructor(private readonly backendService: BackendService) {

>>>>>>> 3098747 (Frontend ultima entrega semestre)
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
<<<<<<< HEAD
  getLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-disponibles");
  }
}
=======

  getLibrosDisponiblesForPrestamo(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-for-prestamo");
  }

  crearLibro(libro: Libro): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrl, this.api, "crear-libro", libro);
  }

  actualizarLibro(libro: Libro): Observable<Respuesta> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-libro", libro);
  }

  //  Lógica agregada para cargue masivo desde archivo CSV
  cargarLibrosCsv(archivo: File): Observable<LibroRs> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.backendService.postFormData(environment.apiUrl, this.api, 'cargar-libros', formData);
  }
}
>>>>>>> 3098747 (Frontend ultima entrega semestre)
