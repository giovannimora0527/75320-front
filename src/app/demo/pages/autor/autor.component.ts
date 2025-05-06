/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
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

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
  }

  guardarActualizarAutor() {
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log('El formulario es válido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un autor nuevo');
        this.autorService.guardarAutor(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal(); 
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un autor existente');
        // Actualizar solo los campos específicos
        const idAutor = this.autorSelected.idAutor;
        this.autorSelected = {
          ...this.autorSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.autorSelected.idAutor = idAutor;
        console.log(this.autorSelected);    
        this.autorService.actualizarAutor(this.autorSelected)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal();             
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      }
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar',      
      customClass: {
        container: 'position-fixed',
        popup: 'swal-overlay'
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-popup');
        if (swalPopup) {
          (swalPopup as HTMLElement).style.zIndex = '1060';
        }
      }
    });
  }
}