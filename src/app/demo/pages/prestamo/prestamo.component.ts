/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoService } from './service/prestamo.service';
declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss']
})
export class PrestamoComponent {
  msjSpinner: string = "";
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = "";
  prestamoSelected: Prestamo | null = null;
  prestamos: Prestamo[] = [];

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    idUsuario: new FormControl(''),
    idLibro: new FormControl(''), // corregido aquí
    fechaPrestamo: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    estado: new FormControl('')
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
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        console.log(data);
        this.prestamos = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      idUsuario: ['', [Validators.required]],
      idLibro: ['', [Validators.required]], // corregido aquí
      fechaPrestamo: [''],
      fechaDevolucion: [''],
      estado: ['', [Validators.required]]
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? 'Crear Préstamo' : 'Actualizar Préstamo';
    const modalElement = document.getElementById('crearModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo; // corregido aquí
    this.form.patchValue(prestamo);   // corregido aquí
    this.crearModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      id: '',
      Usuario: '',
      Libro: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: '',
      fechaEntrega: '',
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }
}
