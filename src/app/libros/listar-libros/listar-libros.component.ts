import { Component, OnInit } from '@angular/core';
import { LibroService, Libro } from 'src/app/servicios/libro.service';

@Component({
  selector: 'app-listar-libros',
  imports: [],
  templateUrl: './listar-libros.component.html',
  styleUrl: './listar-libros.component.scss'
})
export class ListarLibrosComponent implements OnInit {
  libros: Libro[] = [];

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.listar().subscribe(
      data => this.libros = data,
      error => console.error('Error al cargar libros', error)
    );
  }

  }
