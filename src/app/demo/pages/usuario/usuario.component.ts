/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from 'src/app/services/spinner.service'; 

declare const bootstrap: any;

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
  accion: string = '';
  msjSpinner: string = 'Cargando';
  archivo: File | null = null;
  erroresCsv: any[] = [];
  modalCargaCsvInstance: any;


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
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService //  inyectado
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
    this.spinnerService.setSpinnerType('ball-spin-clockwise'); // tipo para carga inicial
    this.spinner.show();

    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
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
    this.accion = modoForm == 'C' ? 'Crear Usuario' : 'Actualizar Usuario';
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
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
      nombreCompleto: '',
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
    this.form.patchValue(usuario);
    this.crearUsuarioModal('E');
  }

  guardarActualizarUsuario() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }

    // tipo de spinner para guardar
    this.spinnerService.setSpinnerType('ball-clip-rotate');
    this.spinner.show();

    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        this.usuarioService.crearUsuario(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.messageUtils.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        this.usuarioSelected = {
          ...this.usuarioSelected,
          ...this.form.getRawValue()
        };
        this.usuarioService.actualizarUsuario(this.usuarioSelected).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.messageUtils.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            this.messageUtils.showMessage('Error', error.error.message, 'warning');
          }
        });
      }
    } else {
      this.spinner.hide(); // Por si el formulario está inválido
    }
  }

  validarDelimitador(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const texto = reader.result as string;
        const primeraLinea = texto.split('\n')[0];

        const columnasPorComa = primeraLinea.split(',').length;
        const columnasPorPuntoYComa = primeraLinea.split(';').length;

        // Retorna true si hay más columnas por coma que por punto y coma
        resolve(columnasPorComa >= columnasPorPuntoYComa);
      };

      reader.readAsText(file);
    });
  }

  abrirModalCargaMasiva(): void {
    this.archivo = null;
    this.erroresCsv = [];

    const modalElement = document.getElementById('cargarUsuariosCsvModal');
    if (modalElement) {
      this.modalCargaCsvInstance = new bootstrap.Modal(modalElement);
      this.modalCargaCsvInstance.show();
    }
  }
  onArchivoSeleccionado(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const archivoSeleccionado = input.files[0];

      // Valida que sea archivo .csv
      if (!archivoSeleccionado.name.toLowerCase().endsWith('.csv')) {
        this.messageUtils.showMessage('Error', 'El archivo debe tener extensión .csv', 'error');
        this.archivo = null;
        input.value = ''; // Resetear input
        return;
      }

      // Valida que no esté vacío el archivo
      if (archivoSeleccionado.size === 1) {
        this.messageUtils.showMessage('Error', 'El archivo seleccionado está vacío', 'error');
        this.archivo = null;
        input.value = ''; // Resetea el input
        return;
      }

      this.validarDelimitador(archivoSeleccionado).then((esValido) => {
        if (!esValido) {
          this.messageUtils.showMessage(
            'Error',
            'El archivo está delimitado por punto y coma (;) en lugar de coma (,)',
            'error'
          );
          this.archivo = null;
          input.value = '';
          return;
        }

        // Si pasa todas las validaciones, lo asigna
        this.archivo = archivoSeleccionado;

        // Resetea el input para permitir volver a subir el mismo archivo
        input.value = '';

      });
      
    } else {
      this.archivo = null;
    }
  }

  cargarCsv(): void {
    if (!this.archivo) {
      this.messageUtils.showMessage('Error', 'No has seleccionado nada, selecciona un archivo .csv', 'error');
      return;
    }

    this.spinnerService.setSpinnerType('ball-clip-rotate');
    this.spinner.show();

    this.usuarioService.cargarUsuariosDesdeCsv(this.archivo).subscribe({
      next: (respuesta) => {
        this.spinner.hide();
        this.modalCargaCsvInstance.hide();
        this.messageUtils.showMessage('Éxito', respuesta.message, 'success');
        this.cargarListaUsuarios(); // Recargar tabla
      },
      error: (error) => {
        this.spinner.hide();
        if (Array.isArray(error.error)) {
          this.erroresCsv = error.error;
        } else {
          this.messageUtils.showMessage('Error', 'Error inesperado', 'error');
        }
      }
    });
  }

}





/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { Component } from '@angular/core';
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

    this.msjSpinner = this.modoFormulario === 'C' ? "Creando usuario": "Actualizando usuario";
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
}*/
