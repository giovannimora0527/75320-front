/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
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
    this.accion = modoForm == 'C' ? "Crear Libro" : "Actualizar Libro";
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
}