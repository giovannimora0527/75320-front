/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import * as XLSX from 'xlsx';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
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

  // Propiedades para carga masiva
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';
  erroresCarga: string[] = [];
  mensajeExito: string = '';

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

  abrirCargarModal() {
    this.titleModal = "Cargar autores";
    const modalElement = document.getElementById('cargarAutorModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  cerrarModalCargaMasiva() {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.erroresCarga = [];
    this.mensajeExito = '';
    const fileInput = document.getElementById('archivoAutorCSV') as HTMLInputElement;
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

  private convertirFechaExcel(fechaStr: any): string {
    // Si es un número (Excel serial date)
    if (typeof fechaStr === 'number') {
      // Excel serial date: days since 1899-12-31
      // ¡OJO! Usar UTC para evitar desfases por zona horaria
      const excelEpoch = Date.UTC(1899, 11, 30);
      const ms = excelEpoch + fechaStr * 24 * 60 * 60 * 1000;
      const date = new Date(ms);
      const yyyy = date.getUTCFullYear();
      const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const dd = date.getUTCDate().toString().padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    // Si la fecha ya está en formato YYYY-MM-DD, la retornamos tal cual
    if (typeof fechaStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      return fechaStr;
    }
    // Intentamos convertir la fecha del formato DD/MM/YYYY
    if (typeof fechaStr === 'string') {
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        const [dia, mes, anio] = partes;
        const mesFormateado = mes.padStart(2, '0');
        const diaFormateado = dia.padStart(2, '0');
        return `${anio}-${mesFormateado}-${diaFormateado}`;
      }
    }
    throw new Error(`Formato de fecha no válido: ${fechaStr}`);
  }

  procesarDatosDesdeArray(data: any[][]) {
    const headers = data[0].map((h: string) => h.trim().toLowerCase());
    const requiredHeaders = ['nombre', 'fecha de nacimiento', 'nacionalidad'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      this.erroresCarga.push('Faltan columnas requeridas: ' + missing.join(', '));
      return;
    }
    const autores: any[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < headers.length) continue;

      const nacionalidadId = parseInt(row[headers.indexOf('nacionalidad')]);
      const nacionalidadExiste = this.nacionalidades.some(n => n.nacionalidadId === nacionalidadId);

      if (!nacionalidadExiste) {
        this.erroresCarga.push(`La nacionalidad con ID ${nacionalidadId} no existe en la línea ${i + 1}.`);
        continue;
      }

      let fechaNacimiento: string;
      try {
        fechaNacimiento = this.convertirFechaExcel(row[headers.indexOf('fecha de nacimiento')]);
      } catch (error) {
        this.erroresCarga.push(`Formato de fecha inválido en la línea ${i + 1}: ${error.message}`);
        continue;
      }

      const autor: any = {
        nombre: row[headers.indexOf('nombre')],
        fechaNacimiento: fechaNacimiento,
        nacionalidadId: nacionalidadId
      };

      // Validaciones básicas
      if (!autor.nombre) this.erroresCarga.push(`El campo nombre es obligatorio en la línea ${i + 1}.`);
      if (!autor.fechaNacimiento) this.erroresCarga.push(`El campo fecha de nacimiento es obligatorio en la línea ${i + 1}.`);
      if (!autor.nacionalidadId) this.erroresCarga.push(`El campo nacionalidadId es obligatorio en la línea ${i + 1}.`);

      autores.push(autor);
    }
    if (this.erroresCarga.length > 0) return;
    this.autorService.cargarAutoresMasivos(autores).subscribe({
      next: () => {
        this.mensajeExito = 'Autores cargados correctamente.';
        this.cargarListaAutores();
        this.archivoSeleccionado = null;
        this.nombreArchivo = '';
      },
      error: (err) => {
        this.erroresCarga.push(err.error?.message || 'Error al cargar autores.');
      }
    });
  }
}