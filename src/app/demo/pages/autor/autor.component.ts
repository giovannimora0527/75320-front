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
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = '';
  autorSelected: Autor;
  autores: Autor[] = [];

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private AutorService: AutorService
  ) {
    this.cargarFormulario();
    this.cargarAutores();
  }

  cargarAutores() {
    this.msjSpinner = 'Cargando autores...';
    this.spinner.show();
    this.AutorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
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
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? 'Crear Autor' : 'Actualizar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue(autor);
    this.crearAutorModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  guardarActualizarAutor() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const autor: Autor = {
      ...this.autorSelected,
      ...this.form.value
    };

    this.spinner.show();
    if (this.modoFormulario === 'C') {
      this.AutorService.crearAutor(autor).subscribe({
        next: () => {
          this.cargarAutores();
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error al crear autor', err);
          this.spinner.hide();
        }
      });
    } else {
      this.AutorService.actualizarAutor(autor).subscribe({
        next: () => {
          this.cargarAutores();
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error al actualizar autor', err);
          this.spinner.hide();
        }
      });
    }
  }
}