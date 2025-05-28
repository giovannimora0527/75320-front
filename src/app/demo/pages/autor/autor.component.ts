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
  archivo: File | null = null;
  erroresCsv: any[] = [];
  modalCargaCsvInstance: any;

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

  validarDelimitador(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const texto = reader.result as string;
        const primeraLinea = texto.split('\n')[0];

        const columnasPorComa = primeraLinea.split(',').length;
        const columnasPorPuntoYComa = primeraLinea.split(';').length;

        // Retorna true si hay más columnas por coma que por punto y coma
        resolve(columnasPorComa >= columnasPorPuntoYComa);
      };

      reader.readAsText(file);
    });
  }

  abrirModalCargaMasiva(): void {
    this.archivo = null;
    this.erroresCsv = [];

    const modalElement = document.getElementById('cargarAutoresCsvModal');
    if (modalElement) {
      this.modalCargaCsvInstance = new bootstrap.Modal(modalElement);
      this.modalCargaCsvInstance.show();
    }
  }

  onArchivoSeleccionado(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const archivoSeleccionado = input.files[0];

      // Valida que sea archivo .csv
      if (!archivoSeleccionado.name.toLowerCase().endsWith('.csv')) {
        this.messageUtils.showMessage('Error', 'El archivo debe tener extensión .csv', 'error');
        this.archivo = null;
        input.value = ''; // Resetear input
        return;
      }

      // Valida que no esté vacío el archivo
      if (archivoSeleccionado.size === 1) {
        this.messageUtils.showMessage('Error', 'El archivo seleccionado está vacío', 'error');
        this.archivo = null;
        input.value = ''; // Resetea el input
        return;
      }

      this.validarDelimitador(archivoSeleccionado).then((esValido) => {
        if (!esValido) {
          this.messageUtils.showMessage(
            'Error',
            'El archivo está delimitado por punto y coma (;) en lugar de coma (,)',
            'error'
          );
          this.archivo = null;
          input.value = '';
          return;
        }

        // Si pasa todas las validaciones, lo asigna
        this.archivo = archivoSeleccionado;

        // Resetea el input para permitir volver a subir el mismo archivo
        input.value = '';

      });
      
    } else {
      this.archivo = null;
    }
  }

  cargarCsv(): void {
    if (!this.archivo) {
      this.messageUtils.showMessage('Error', 'No has seleccionado nada, selecciona un archivo .csv', 'error');
      return;
    }
    
    this.spinnerService.setSpinnerType('ball-clip-rotate');
    this.spinner.show();

    this.autorService.cargarAutoresDesdeCsv(this.archivo).subscribe({
      next: (respuesta) => {
        this.spinner.hide(); 
        this.modalCargaCsvInstance.hide(); 
        this.messageUtils.showMessage('Éxito', respuesta.message, 'success');
        this.cargarAutores(); 
      },
      error: (error) => {
        this.spinner.hide();

        if (Array.isArray(error.error)) {
          this.erroresCsv = error.error; // Muestra errores línea por línea
        } else {
          this.messageUtils.showMessage('Error', 'Error inesperado', 'error');
        }
      }
    });
  }
}
