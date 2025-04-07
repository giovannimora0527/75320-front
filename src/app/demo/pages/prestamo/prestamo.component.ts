import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prestamo } from '../../models/prestamo.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];
  prestamoForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.prestamoForm = this.fb.group({
      libroId: ['', Validators.required],
      usuarioId: ['', Validators.required],
      fechaPrestamo: ['', Validators.required],
      fechaDevolucion: [''],
      estado: ['Activo', Validators.required]
    });
  }

  guardarPrestamo() {
    if (this.prestamoForm.valid) {
      const prestamoData = this.prestamoForm.value;
      if (this.editingIndex !== null) {
        // Actualizar préstamo existente
        this.prestamos[this.editingIndex] = prestamoData;
      } else {
        // Agregar nuevo préstamo
        prestamoData.id = this.prestamos.length + 1;
        this.prestamos.push(prestamoData);
      }
      this.cancelarEdicion();
    }
  }

  editarPrestamo(index: number) {
    this.editingIndex = index;
    this.prestamoForm.patchValue(this.prestamos[index]);
  }

  eliminarPrestamo(index: number) {
    this.prestamos.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.editingIndex = null;
    this.prestamoForm.reset({ estado: 'Activo' });
  }
}
