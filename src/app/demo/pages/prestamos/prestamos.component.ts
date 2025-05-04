/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PrestamoService } from './service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import { formatDate } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss'
})
export class PrestamoComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = '';
  prestamoSelected: Prestamo | null = null;
  prestamos: Prestamo[] = [];

  form: FormGroup = new FormGroup({
    fechaEntrega: new FormControl('', [Validators.required])
  });

  constructor(
    private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private prestamoService: PrestamoService
  ) {
    this.cargarFormulario();
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    this.msjSpinner = 'Cargando préstamos...';
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      fechaEntrega: ['', [Validators.required]]
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? 'Crear Prestamo' : 'Actualizar Prestamo';
    const modalElement = document.getElementById('crearPrestamoModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      fechaEntrega: formatDate(prestamo.fechaEntrega || new Date(), 'yyyy-MM-dd', 'en')
    });
    this.crearPrestamoModal('E');
  }


  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  actualizarPrestamo() {
    if (this.form.invalid || !this.prestamoSelected) {
      this.form.markAllAsTouched();
      return;
    }

    const fechaEntrega = this.form.value.fechaEntrega;
    const fechaDevolucion = this.prestamoSelected.fechaDevolucion;
    const fechaActual = new Date();

    if (new Date(fechaEntrega) < fechaActual) {
      alert('La fecha de entrega no puede ser menor al día actual.');
      return;
    }

    let nuevoEstado = 'DEVUELTO';
    if (fechaDevolucion && new Date(fechaEntrega) > new Date(fechaDevolucion)) {
      nuevoEstado = 'VENCIDO';
    }


    const prestamoActualizado: Prestamo = {
      ...this.prestamoSelected,
      fechaEntrega: fechaEntrega,
      estado: nuevoEstado
    };

    this.spinner.show();
    this.prestamoService.actualizarPrestamo(prestamoActualizado).subscribe({
      next: () => {
        this.cargarPrestamos();
        this.cerrarModal();
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al actualizar préstamo', err);
        this.spinner.hide();
      }
    });
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'PRESTADO':
        return 'text-warning';
      case 'VENCIDO':
        return 'text-danger';
      case 'DEVUELTO':
        return 'text-success';
      default:
        return '';
    }
  }
}
