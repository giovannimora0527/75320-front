/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;


@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, DndModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "";

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly messageUtils: MessageUtils,
    private readonly spinner: NgxSpinnerService
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
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
        this.usuarios = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.titleModal = modoForm == 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearUsuarioModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirCargarModal() {  
    this.titleModal = "Cargar usuarios";
    const modalElement = document.getElementById('cargarUsuarioModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: '',
      correo: '',
      telefono: '',
      activo: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.usuarioSelected = null;
  }

  abrirModoEdicion(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.form.patchValue({
      nombre: this.usuarioSelected.nombre,
      correo: this.usuarioSelected.correo,
      telefono: this.usuarioSelected.telefono,
      activo: !!this.usuarioSelected.activo // asegura que sea booleano
    });
    this.crearUsuarioModal('E');
  }

  guardarActualizarUsuario() {
    this.msjSpinner = this.modoFormulario === 'C' ? 'Creando Usuario' : 'Actualizando Usuario';
    this.spinner.show();
    console.log(this.form.valid);
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }   
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        this.usuarioService.guardarUsuarioNuevo(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.spinner.hide();          
            this.messageUtils.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.cerrarModal();
          },
          error: (error) => {
            this.spinner.hide();         
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        const idUsuario = this.usuarioSelected.idUsuario;
        // Actualizar solo los campos específicos
        this.usuarioSelected = {
          ...this.usuarioSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.usuarioSelected.idUsuario = idUsuario;       
        // Actualizamos el usuario
        this.usuarioService.actualizarUsuario(this.usuarioSelected).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.messageUtils.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.cerrarModal();         
            this.usuarioSelected = null;
          },
          error: (error) => {
            this.spinner.hide();
            console.log(error.error.message);
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      }
    }
  }

  onDrop(event: DndDropEvent): void {
    console.log('Item dropped:', event);
  }
}
