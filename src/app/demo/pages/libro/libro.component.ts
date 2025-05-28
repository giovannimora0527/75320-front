/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss',
  providers: [CategoriaService]
})
export class LibroComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  libroSelected: Libro | null = null;
  currentYear = new Date().getFullYear();
  archivoCsv: File | null = null;

  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService,
    private readonly categoriaService: CategoriaService
  ) {
    this.getLibros();
    this.getAutores();
    this.getCategorias();
    this.cargarFormulario();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  getAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required, Validators.min(1), Validators.max(this.currentYear)]],
      categoriaId: ['', [Validators.required]],
      existencias: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  abrirCargarModal() {
    this.titleModal = "Cargar libros";
    const modalElement = document.getElementById('cargarLibroModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');

    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }

    if (this.modoFormulario == "C") {
      this.form.reset({
        titulo: '',
        autorId: '',
        anioPublicacion: '',
        categoriaId: '',
        existencias: ''
      });
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: this.libroSelected.titulo,
      existencias: this.libroSelected.existencias,
      anioPublicacion: this.libroSelected.anioPublicacion,
      autorId: this.libroSelected.autor?.autorId,
      categoriaId: this.libroSelected.categoria?.categoriaId
    });
    this.crearModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.archivoCsv = null;
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }

  guardarActualizar() {
    this.msjSpinner = this.modoFormulario === 'C' ? 'Creando libro' : 'Actualizando libro';
    this.spinner.show();

    if (this.form.invalid) {
      this.spinner.hide();
      this.messageUtils.showMessage("Advertencia", "Por favor complete todos los campos requeridos", "warning");
      return;
    }

    if (this.modoFormulario === 'C') {
      this.libroService.crearLibro(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          this.messageUtils.showMessage("Éxito", data.message, "success");
          this.cerrarModal();
          this.getLibros();
        },
        error: (error) => {
          this.spinner.hide();
          this.messageUtils.showMessage("Error", error.error.message, "error");
        }
      });
    } else {
      const libroActualizado: Libro = {
        idLibro: this.libroSelected?.idLibro || 0,
        titulo: this.form.get('titulo')?.value,
        anioPublicacion: this.form.get('anioPublicacion')?.value,
        existencias: this.form.get('existencias')?.value,
        autor: { autorId: this.form.get('autorId')?.value } as Autor,
        categoria: { categoriaId: this.form.get('categoriaId')?.value } as Categoria
      };

      this.libroService.actualizarLibro(libroActualizado).subscribe({
        next: (data) => {
          this.spinner.hide();
          this.messageUtils.showMessage("Éxito", data.message, "success");
          this.cerrarModal();
          this.getLibros();
        },
        error: (error) => {
          this.spinner.hide();
          this.messageUtils.showMessage("Error", error.error.message, "error");
        }
      });
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (parseInt(value) < 1) {
      input.value = '1';
    }
    if (value.includes('-') || isNaN(Number(value))) {
      input.value = value.replace(/\D/g, '');
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.archivoCsv = input.files[0];
    }
  }

  cargarLibrosDesdeCsv(): void {
    if (!this.archivoCsv) {
      this.messageUtils.showMessage('Error', 'Debe seleccionar un archivo CSV.', 'error');
      return;
    }

    this.msjSpinner = "Cargando libros desde CSV";
    this.spinner.show();

    this.libroService.cargarLibrosCsv(this.archivoCsv).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Éxito', data.message, 'success');
        this.getLibros();
        this.cerrarModal();
        this.archivoCsv = null;
      },
      error: (error) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', error.error.message || 'Ocurrió un error al cargar el archivo.', 'error');
        this.archivoCsv = null;
      }
    });
  }
}