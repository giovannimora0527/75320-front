/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from './service/libro.service';
import { Libro } from 'src/app/models/libro';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = "Cargando";
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = "";
  libroSelected: Libro;
  libros: Libro[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    anioPublicacion: new FormControl(''),
    autorId: new FormControl(''),
    categoria: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private libroService: LibroService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
    this.cargarLibros();
  }

  cargarLibros() {
    this.spinner.show();
    this.libroService.getLibros().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.libros = data;
          this.spinner.hide();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message, 'error');
          this.spinner.hide();
        }
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      existencias: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? "Crear Libro" : "Actualizar Libro";
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue(libro);
    this.crearModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      titulo: '',
      anioPublicacion: '',
      autorId: '',
      categoria: '',
      existencias: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }

  guardarActualizarLibro() {
    this.msjSpinner = this.modoFormulario === 'C' ? "Creando libro" : "Actualizando libro";
    this.spinner.show();

    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        this.libroService.crearLibros(this.form.getRawValue())
          .subscribe({
            next: (data) => {
              this.cerrarModal();
              this.messageUtils.showMessage("Éxito", data.message, "success");
              this.cargarLibros();
              this.form.reset();
              this.form.markAsPristine();
              this.form.markAsUntouched();
            },
            error: (error) => {
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      } else {
        // Actualizar el libro
        this.libroSelected = {
          ...this.libroSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.libroService.actualizarLibros(this.libroSelected)
          .subscribe({
            next: (data) => {
              this.cerrarModal();
              this.messageUtils.showMessage("Éxito", data.message, "success");
              this.cargarLibros();
              this.form.reset();
              this.form.markAsPristine();
              this.form.markAsUntouched();
            },
            error: (error) => {
              this.messageUtils.showMessage("Error", error.error.message, "warning");
            }
          });
      }
    } else {
      this.spinner.hide();
      this.messageUtils.showMessage("Error", "Por favor complete todos los campos", "warning");
    }
  }
}
