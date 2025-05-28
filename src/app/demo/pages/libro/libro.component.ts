/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { MessageUtils } from 'src/app/utils/message-utils';
declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = "";
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = "";
  libroSelected: Libro;
  libros: Libro[] = [];
  archivo: File | null = null;
  erroresCsv: any[] = [];
  modalCargaCsvInstance: any;

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    anioPublicacion: new FormControl(''),
    autor: new FormControl(''),
    categoria: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private libroService: LibroService,
    private messageUtils: MessageUtils
  ) {
    this.cargarFormulario();
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        console.log(data);
        this.libros = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      existencias: ['', [Validators.required]]
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm == 'C' ? "Crear Libro" : "Actualizar Libro";
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
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

  validarDelimitador(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const texto = reader.result as string;
      const primeraLinea = texto.split('\n')[0];

      const columnasPorComa = primeraLinea.split(',').length;
      const columnasPorPuntoYComa = primeraLinea.split(';').length;

      resolve(columnasPorComa >= columnasPorPuntoYComa);
    };

    reader.readAsText(file);
  });
}

abrirModalCargaMasiva(): void {
  this.archivo = null;
  this.erroresCsv = [];

  const modalElement = document.getElementById('cargarLibrosCsvModal'); // 👈 diferente ID
  if (modalElement) {
    this.modalCargaCsvInstance = new bootstrap.Modal(modalElement);
    this.modalCargaCsvInstance.show();
  }
}

onArchivoSeleccionado(event: any): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const archivoSeleccionado = input.files[0];

    if (!archivoSeleccionado.name.toLowerCase().endsWith('.csv')) {
      this.messageUtils.showMessage('Error', 'El archivo debe tener extensión .csv', 'error');
      this.archivo = null;
      input.value = '';
      return;
    }

    if (archivoSeleccionado.size === 1) {
      this.messageUtils.showMessage('Error', 'El archivo seleccionado está vacío', 'error');
      this.archivo = null;
      input.value = '';
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

      this.archivo = archivoSeleccionado;
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

  this.libroService.cargarLibrosDesdeCsv(this.archivo).subscribe({
    next: (respuesta) => {
      this.spinner.hide();
      this.modalCargaCsvInstance.hide();
      this.messageUtils.showMessage('Éxito', respuesta.message, 'success');
      this.cargarLibros(); //recarga la tabla de libros en la interfaz de acuerdo al csv
    },
    error: (error) => {
      this.spinner.hide();
      if (Array.isArray(error.error)) {
        this.erroresCsv = error.error;
      } else {
        this.messageUtils.showMessage('Error', 'Error inesperado', 'error');
      }
    }
  });
}
}











/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = "";
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

  constructor(private readonly spinner: NgxSpinnerService,
     private formBuilder: FormBuilder,
     private libroService: LibroService
  ) {
    this.cargarFormulario();
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.libros = data;
        },
        error: (error) => {
          console.log(error);
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

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm == 'C'? "Crear Libro": "Actualizar Libro";
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
}*/
