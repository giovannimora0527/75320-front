import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LibroService } from '../libro.service';

@Component({
  selector: 'app-crear-libro',
  imports: [],
  templateUrl: './crear-libro.component.html',
  styleUrl: './crear-libro.component.scss'
})
export class CrearLibroComponent {
  libro = {
    titulo: '',
    autor: '',
    anio: null

};
constructor(private libroService: LibroService, private router: Router) {}

  crearLibro() {
    this.libroService.crearLibro(this.libro).subscribe(() => {
      alert('Libro creado exitosamente');
      this.router.navigate(['/libros']);
    });
  }

  }