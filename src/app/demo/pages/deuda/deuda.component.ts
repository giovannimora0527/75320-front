/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Deuda } from 'src/app/models/deuda';
import { DeudaService } from './service/deuda.service';

declare const bootstrap: any;

@Component({
  selector: 'app-deuda',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './deuda.component.html',
  styleUrls: ['./deuda.component.scss'] 
})
export class DeudaComponent {
  msjSpinner: string = "";
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = "";
  deudaSelected: Deuda | null = null;
  deudas: Deuda[] = [];

  form: FormGroup = new FormGroup({});

  constructor(
    private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private deudaService: DeudaService
  ) {
    this.cargarFormulario();
    this.cargarDeudas();
  }

  cargarDeudas() {
    this.deudaService.getlistarDeudas().subscribe({
      next: (data) => {
        this.deudas = data;
      },
      error: (error) => {
        console.error('Error al cargar deudas', error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuario: [''],
      libro: [''],
      fechaPrestamo: [''],
      fechaDevolucion: [''],
      valorMulta: [''],
      metodoPago: ['', Validators.required]
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'P' ? 'Pagar Deuda' : 'Editar Deuda';
    const modalElement = document.getElementById('deudaModal');
    if (modalElement) {
      modalElement.blur();
      modalElement.setAttribute('aria-hidden', 'false');
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModalPago(deuda: Deuda) {
    this.deudaSelected = deuda;
    this.crearModal('P');
  }

  abrirModoEdicion(deuda: Deuda): void {
    this.deudaSelected = deuda;
    this.form.patchValue({
      usuario: deuda.usuario,
      libro: deuda.libro,
      fechaPrestamo: deuda.fechaPrestamo,
      fechaDevolucion: deuda.fechaDevolucion,
      deudaMonto: deuda.monto,
      deudaPagada: deuda.pagada
    });
    this.crearModal('E');
  }

  pagarDeuda() {
    if (this.form.invalid || !this.deudaSelected) return;

    const metodoPago = this.form.get('metodoPago')?.value;

    this.spinner.show();
    this.deudaService.getpagarDeuda(this.deudaSelected.id, metodoPago).subscribe({
      next: () => {
        this.spinner.hide();
        this.cerrarModal();
        this.cargarDeudas();
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al pagar deuda', error);
      }
    });
  }

  cerrarModal() {
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.deudaSelected = null;
  }
}
