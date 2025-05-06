import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibroService, Libro } from '../libro.service';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.component.html',
  styleUrls: ['./editar-libro.component.css']
})
export class EditarLibroComponent implements OnInit {
  libro: Libro = { id: 0, titulo: '', autor: '', anioPublicacion: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.libroService.obtenerPorId(id).subscribe((data) => {
      this.libro = data;
    });
  }

  guardar(): void {
    this.libroService.actualizar(this.libro.id, this.libro).subscribe(() => {
      this.router.navigate(['/libros']);
    });
  }
}

