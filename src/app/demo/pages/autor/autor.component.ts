/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  nacionalidades: Nacionalidad[] = [];  
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  autorSelected: Autor;

  form: FormGroup;

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly autorService: AutorService,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      nacionalidadId: ['', [Validators.required]]
    });
    this.cargarListaAutores();
    this.cargarNacionalidades();
  }

  cargarNacionalidades() {
    this.autorService.getNacionalidades().subscribe({
      next: (data) => {
        this.nacionalidades = data;
      },
      error: (error) => {
        console.log(error);
        this.showMessage("Error", "No se pudieron cargar las nacionalidades", "error");
      }
    });
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
      },
      error: (error) => {
        console.log(error);
        this.showMessage("Error", "No se pudieron cargar los autores", "error");
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      this.modalInstance ??= new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => any } }).bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
    if (modoForm === 'C') {
      this.form.reset();
      this.autorSelected = null;
    }
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
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      fechaNacimiento: autor.fechaNacimiento,
      nacionalidadId: autor.nacionalidad?.nacionalidadId ?? null
    });
  }

  guardarAutor() {      
    if (this.form.valid) {
      // Busca el objeto nacionalidad completo
      const nacionalidadSeleccionada = this.nacionalidades.find(
        n => n.nacionalidadId === this.form.get('nacionalidadId')?.value
      );

      // Construye el objeto Autor
      const autorData: Autor = {
        autorId: this.modoFormulario === 'E' ? this.autorSelected?.autorId : undefined,
        nombre: this.form.get('nombre')?.value,
        fechaNacimiento: this.form.get('fechaNacimiento')?.value,
        nacionalidad: nacionalidadSeleccionada
      };

      if (this.modoFormulario === 'C') {
        console.log("Crear");
        this.autorService.guardarAutor(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data.message);
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Exito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error")  
            }
          });
      } else {
        this.autorService.actualizarAutor(autorData)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Exito", data.message, "success");
            },
            error: (error) => {
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      }
    } else {
      this.messageUtils.showMessage("Advertencia", "El formulario no es valido", "warning");
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}