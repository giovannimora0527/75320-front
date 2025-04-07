import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Libro } from '../../models/libro.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class LibroComponent {
  libros: Libro[] = [];
  libroForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      fechaPublicacion: ['', Validators.required]
    });
  }

  guardarLibro() {
    if (this.libroForm.valid) {
      const libroData = this.libroForm.value;
      if (this.editingIndex !== null) {
        // Actualizar libro existente
        this.libros[this.editingIndex] = libroData;
      } else {
        // Agregar nuevo libro
        this.libros.push(libroData);
      }
      this.cancelarEdicion();
    }
  }

  editarLibro(index: number) {
    this.editingIndex = index;
    this.libroForm.patchValue(this.libros[index]);
  }

  eliminarLibro(index: number) {
    this.libros.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.editingIndex = null;
    this.libroForm.reset();
  }
}
