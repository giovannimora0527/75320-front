import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AutorRq } from 'src/app/models/autor-rq';
import { AutorRs } from 'src/app/models/autor-rs';
import { AutorService } from './service/autor.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Autor } from 'src/app/models/autor';

declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  autorSelected: AutorRq;
  accion: string = '';
  msjSpinner: string = 'Cargando';

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    nacionalidad: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService
  ) {
    this.cargarAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      nombreOriginal: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarAutores() {
    this.spinnerService.setSpinnerType('ball-spin-clockwise');
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  crearAutorModal(modo: string) {
    this.modoFormulario = modo;
    this.accion = modo == 'C' ? 'Crear Autor' : 'Actualizar Autor';

    if (this.modoFormulario === 'C') {
      this.form.reset(); // Limpia todos los campos
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.autorSelected = null; // Asegura que no se cargue ningún autor anterior
    }

    const modalElement = document.getElementById('crearAutorModal');
    modalElement.setAttribute('aria-hidden', 'false');
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
    this.modalInstance.show();
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      fechaNacimiento: autor.fechaNacimiento,
      nacionalidad: autor.nacionalidad,
      nombreOriginal: autor.nombre
    });
    this.crearAutorModal('E');
  }

  guardarActualizarAutor() {
    this.spinnerService.setSpinnerType('ball-clip-rotate');
    this.spinner.show();

    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        this.autorService.crearAutor(this.form.getRawValue()).subscribe({
          next: (res) => {
            this.messageUtils.showMessage('Éxito', res.message, 'success');
            this.cargarAutores();
            this.cerrarModal();
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.messageUtils.showMessage('Error', err.error.message, 'error');
          }
        });
      } else {
        this.autorService.actualizarAutor(this.form.getRawValue()).subscribe({
          next: (res) => {
            this.messageUtils.showMessage('Éxito', res.message, 'success');
            this.cargarAutores();
            this.cerrarModal();
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.messageUtils.showMessage('Error', err.error.message, 'error');
          }
        });
      }
    } else {
      this.spinner.hide();
    }
  }
}
