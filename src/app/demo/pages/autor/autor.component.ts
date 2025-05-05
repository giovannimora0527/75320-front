/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  msjSpinner: string = "";
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = "";
  autorSelected: Autor;
  autores: Autor[] = [];

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    ciudad: new FormControl(''),
    direccion: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl('')
  });

  constructor(private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private autorService: AutorService
  ) {
    this.cargarFormulario();
    this.cargarAutores();
  }

  cargarAutores() {
    this.autorService.getAutores().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.autores = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? "Crear Autor" : "Actualizar Autor";
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

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue(autor);
    this.crearModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: '',
      apellido: '',
      ciudad: '',
      direccion: '',
      telefono: '',
      email: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }
}