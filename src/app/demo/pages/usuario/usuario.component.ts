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
import * as XLSX from 'xlsx';
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

  // Propiedades para carga masiva
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';
  erroresCarga: string[] = [];
  mensajeExito: string = '';

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

  cerrarModalCargaMasiva() {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.erroresCarga = [];
    this.mensajeExito = '';
    const fileInput = document.getElementById('archivoCSV') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (this.modalInstance) this.modalInstance.hide();
  }

  onFileSelected(event: Event) {
    this.erroresCarga = [];
    this.mensajeExito = '';
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (
        file.type === 'text/csv' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.xlsx')
      ) {
        this.archivoSeleccionado = file;
        this.nombreArchivo = file.name;
      } else {
        this.erroresCarga.push('Por favor seleccione un archivo CSV o Excel válido.');
        this.archivoSeleccionado = null;
        this.nombreArchivo = '';
        input.value = '';
      }
    }
  }

  procesarArchivo() {
    this.erroresCarga = [];
    this.mensajeExito = '';
    if (!this.archivoSeleccionado) {
      this.erroresCarga.push('Debe seleccionar un archivo.');
      return;
    }
    const file = this.archivoSeleccionado;
    const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
    const isCSV = file.name.endsWith('.csv');
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.procesarDatosDesdeArray(json);
        } catch (err: any) {
          this.erroresCarga.push('Error al procesar el archivo Excel: ' + (err.message || err));
        }
      };
      reader.onerror = () => {
        this.erroresCarga.push('Error al leer el archivo.');
      };
      reader.readAsArrayBuffer(file);
    } else if (isCSV) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(l => l.trim().length > 0);
          const data = lines.map(line => line.split(',').map(cell => cell.trim()));
          this.procesarDatosDesdeArray(data);
        } catch (err: any) {
          this.erroresCarga.push('Error al procesar el archivo CSV: ' + (err.message || err));
        }
      };
      reader.onerror = () => {
        this.erroresCarga.push('Error al leer el archivo.');
      };
      reader.readAsText(file);
    } else {
      this.erroresCarga.push('Tipo de archivo no soportado.');
    }
  }

  // Nuevo método para procesar los datos en array (de Excel o CSV)
  procesarDatosDesdeArray(data: any[][]) {
    const headers = data[0].map((h: string) => h.trim().toLowerCase());
    const requiredHeaders = ['nombre', 'correo', 'telefono'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      this.erroresCarga.push('Faltan columnas requeridas: ' + missing.join(', '));
      return;
    }
    const usuarios: any[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < headers.length) continue;
      const usuario: any = {
        nombre: row[headers.indexOf('nombre')],
        correo: row[headers.indexOf('correo')],
        telefono: row[headers.indexOf('telefono')],
      };
      // Validaciones básicas
      if (!usuario.nombre) this.erroresCarga.push(`El campo nombre es obligatorio en la línea ${i + 1}.`);
      if (!usuario.correo) this.erroresCarga.push(`El campo correo es obligatorio en la línea ${i + 1}.`);
      if (!usuario.telefono) this.erroresCarga.push(`El campo teléfono es obligatorio en la línea ${i + 1}.`);
      if (usuario.correo && !this.validarEmail(usuario.correo)) this.erroresCarga.push(`El correo en la línea ${i + 1} no es válido.`);
      if (usuario.telefono && !/^\d+$/.test(usuario.telefono)) this.erroresCarga.push(`El teléfono en la línea ${i + 1} debe ser solo números.`);
      usuarios.push(usuario);
    }
    if (this.erroresCarga.length > 0) return;
    this.usuarioService.cargarUsuariosMasivos(usuarios).subscribe({
      next: () => {
        this.mensajeExito = 'Usuarios cargados correctamente.';
        this.cargarListaUsuarios();
        this.archivoSeleccionado = null;
        this.nombreArchivo = '';
      },
      error: (err) => {
        this.erroresCarga.push(err.error?.message || 'Error al cargar usuarios.');
      }
    });
  }

  private validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}