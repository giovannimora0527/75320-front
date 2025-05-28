/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
<<<<<<< HEAD
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
<<<<<<< HEAD
  msjSpinner: string = "Cargando";
=======
  msjSpinner: string = "";
>>>>>>> 3098747 (Frontend ultima entrega semestre)

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
<<<<<<< HEAD
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
=======
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly messageUtils: MessageUtils,
    private readonly spinner: NgxSpinnerService
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
<<<<<<< HEAD
      activo: [true, [Validators.required]],
=======
      activo: ['', [Validators.required]]
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
<<<<<<< HEAD
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
=======
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
>>>>>>> 3098747 (Frontend ultima entrega semestre)
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
<<<<<<< HEAD
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Usuario' : 'Editar Usuario';
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
=======
    this.titleModal = modoForm == 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearUsuarioModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirCargarModal() {
    this.titleModal = "Cargar usuarios";
    const modalElement = document.getElementById('cargarUsuarioModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
>>>>>>> 3098747 (Frontend ultima entrega semestre)
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
<<<<<<< HEAD
    this.crearUsuarioModal('E');
=======
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    this.usuarioSelected = usuario;
    this.form.patchValue({
      nombre: this.usuarioSelected.nombre,
      correo: this.usuarioSelected.correo,
      telefono: this.usuarioSelected.telefono,
<<<<<<< HEAD
      activo: !!this.usuarioSelected.activo  // asegura que sea booleano
    });
  }

  guardarActualizarUsuario() {   
=======
      activo: !!this.usuarioSelected.activo
    });
    this.crearUsuarioModal('E');
  }

  guardarActualizarUsuario() {
    this.msjSpinner = this.modoFormulario === 'C' ? 'Creando Usuario' : 'Actualizando Usuario';
    this.spinner.show();
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    console.log(this.form.valid);
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
<<<<<<< HEAD
      console.log('El formualario es valido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
        this.usuarioService.guardarUsuario(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
              this.cargarListaUsuarios();
              this.cerrarModal(); 
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un usuario existente');
        // Actualizar solo los campos específicos
        const idUsuario = this.usuarioSelected.idUsuario;
        this.usuarioSelected = {
          ...this.usuarioSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.usuarioSelected.idUsuario = idUsuario;       
        console.log(this.usuarioSelected);    
        this.usuarioService.actualizarUsuario(this.usuarioSelected)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
              this.cargarListaUsuarios();
              this.cerrarModal();             
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
=======
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
        this.usuarioSelected = {
          ...this.usuarioSelected,
          ...this.form.getRawValue()
        };
        this.usuarioSelected.idUsuario = idUsuario;
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
          }
        });
      }
    }
  }

<<<<<<< HEAD
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
=======
  onDrop(event: DndDropEvent): void {
    console.log('Item dropped:', event);
  }

  //  LÓGICA AGREGADA PARA CARGUE MASIVO DESDE ARCHIVO CSV

  archivoCsv: File | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.archivoCsv = input.files[0];
    }
  }

  cargarUsuariosDesdeCsv(): void {
    if (!this.archivoCsv) {
      this.messageUtils.showMessage('Error', 'Debe seleccionar un archivo CSV.', 'error');
      return;
    }

    this.spinner.show();
    this.usuarioService.cargarUsuariosCsv(this.archivoCsv).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Éxito', data.message, 'success');
        this.cargarListaUsuarios();
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
