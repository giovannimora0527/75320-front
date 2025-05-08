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

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  spinner: { show: () => void; hide: () => void } = {
    show: () => console.log('Spinner shown'),
    hide: () => console.log('Spinner hidden')
  };
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';

  usuarioSelected: Usuario;
  accion: string = "";
  msjSpinner: string = "";

  form: FormGroup = new FormGroup({
    nombreUsuario: new FormControl(''),
    emailUsuario: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: [null],
      nombreUsuario: ['', [Validators.required]],
      emailUsuario: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        // Mapeo para adaptar propiedades del backend a las esperadas por la plantilla
        this.usuarios = data.map((u: any) => ({
          id: u.id,
          nombreUsuario: u.nombreUsuario,
          emailUsuario: u.emailUsuario,
          telefono: u.telefono,
          fechaRegistro: u.fechaRegistro,
          activo: u.estado 
        }));
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm == 'C'? "Crear Usuario": "Actualizar Usuario";
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
      nombreUsuario: "",
      emailUsuario: "",
      telefono: "",
      activo: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
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
      console.log('El formulario es válido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
        this.usuarioService.crearUsuario(this.form.getRawValue())
          .subscribe({
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
          });
      } else {
        console.log('Actualizamos un usuario existente');
        const usuarioActualizado: Usuario = {
          ...this.usuarioSelected, // Mantén las propiedades existentes
          nombreUsuario: this.form.value.nombreUsuario.trim(),
          emailUsuario: this.form.value.emailUsuario.trim(),
          telefono: this.form.value.telefono.trim(),
          activo: this.form.value.activo
        };
  
        this.usuarioService.actualizarUsuario(usuarioActualizado)
          .subscribe({
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
          });
      }
    }
  }
  
}
