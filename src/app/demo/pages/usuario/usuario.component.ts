/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';

  usuarioSelected: Usuario;
  accion: string = "";
  msjSpinner: string = "Cargando";

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.spinner.show();
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm == 'C' ? "Crear Usuario" : "Actualizar Usuario";
    const modalElement = document.getElementById('crearUsuarioModal');
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
      nombreCompleto: "",
      correo: "",
      telefono: "",
      activo: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.usuarioSelected = null;
  }

  abrirModoEdicion(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.form.patchValue(usuario);
    this.crearUsuarioModal('E');
  }

  guardarActualizarUsuario() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }

    this.msjSpinner = this.modoFormulario === 'C' ? "Creando usuario" : "Actualizando usuario";
    this.spinner.show();

    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        this.usuarioService.crearUsuario(this.form.getRawValue())
          .subscribe(
            {
              next: (data) => {
                this.cerrarModal();
                this.messageUtils.showMessage("Éxito", data.message, "success");
                this.cargarListaUsuarios();
                this.form.reset();
                this.form.markAsPristine();
                this.form.markAsUntouched();
              },
              error: (error) => {
                this.messageUtils.showMessage("Error", error.error.message, "error");
              }
            }
          );
      } else {
        // Actualizar solo los campos específicos
        this.usuarioSelected = {
          ...this.usuarioSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.usuarioService.actualizarUsuario(this.usuarioSelected)
          .subscribe(
            {
              next: (data) => {
                this.cerrarModal();
                this.messageUtils.showMessage("Éxito", data.message, "success");
                this.cargarListaUsuarios();
                this.form.reset();
                this.form.markAsPristine();
                this.form.markAsUntouched();
              },
              error: (error) => {
                this.messageUtils.showMessage("Error", error.error.message, "warning");
              }
            }
          );
      }
    }
  }
}
