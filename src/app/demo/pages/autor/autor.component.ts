import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Autor } from '../../models/autor.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class AutorComponent {
  autores: Autor[] = [];
  autorForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.autorForm = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  guardarAutor() {
    if (this.autorForm.valid) {
      const autorData = this.autorForm.value;
      if (this.editingIndex !== null) {
        // Actualizar autor existente
        this.autores[this.editingIndex] = autorData;
      } else {
        // Agregar nuevo autor
        autorData.id = this.autores.length + 1;
        this.autores.push(autorData);
      }
      this.cancelarEdicion();
    }
  }

  editarAutor(index: number) {
    this.editingIndex = index;
    this.autorForm.patchValue(this.autores[index]);
  }

  eliminarAutor(index: number) {
    this.autores.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.editingIndex = null;
    this.autorForm.reset();
  }
}
