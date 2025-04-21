/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombreCompleto: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
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
      telefono: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  abrirModoEdicion(usuario: Usuario) {
    this.crearUsuarioModal('E');
    this.usuarioSelected = usuario;
    console.log(this.usuarioSelected);
  }

  guardarActualizarUsuario() {
<<<<<<< Updated upstream
    console.log('Entro');
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log('El formualario es valido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
      } else {
        console.log('Actualizamos un usuario existente');
      }
=======
  if (this.modoFormulario === 'C') {
    this.form.get('activo').setValue(true);
  }

  this.msjSpinner = this.modoFormulario === 'C' ? "Creando usuario" : "Actualizando usuario";
  this.spinner.show();

  if (this.form.valid) {
    if (this.modoFormulario.includes('C')) {
      this.usuarioService.crearUsuario(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            this.cerrarModal();
            Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
            this.cargarListaUsuarios();
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
          },
          error: (error) => {
            Swal.fire('Error', error.error.message, 'error');
          }
        });
    } else {
      // Actualizar solo los campos específicos
      this.usuarioSelected = {
        ...this.usuarioSelected,
        ...this.form.getRawValue()
      };
      this.usuarioService.actualizarUsuario(this.usuarioSelected)
        .subscribe({
          next: (data) => {
            this.cerrarModal();
            Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
            this.cargarListaUsuarios();
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
          },
          error: err => Swal.fire('Error', err.error.message, 'error')
        });
>>>>>>> Stashed changes
    }
  }
}
}
