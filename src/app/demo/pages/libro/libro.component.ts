/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import * as XLSX from 'xlsx';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, NgxSpinnerModule, FormsModule, CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss',
  providers: [CategoriaService]
})
export class LibroComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  libroSelected: Libro;
  currentYear = new Date().getFullYear();

  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl('')
  });

  // Propiedades para carga masiva de libros
  archivoSeleccionadoLibros: File | null = null;
  nombreArchivoLibros: string = '';
  erroresCargaLibros: string[] = [];
  mensajeExitoLibros: string = '';
  modalInstanceCargaLibros: any;

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService,
    private readonly categoriaService: CategoriaService
  ) {
    this.getLibros();
    this.getAutores();
    this.cargarCategorias();
    this.cargarFormulario();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      {
        next: (data) => {
          this.categorias = data;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  getAutores() {
    this.autorService.getAutores().subscribe(
      {
        next: (data) => {
          this.autores = data;
        },
        error: (error) => {
          console.log(error);
        },
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      existencias: [true, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
    if (this.modoFormulario == "C") {
      this.form.reset({
        titulo: '',
        autorId: this.autores[0]?.autorId,
        anioPublicacion: '',
        categoriaId: this.categorias[0]?.categoriaId,
        existencias: '',
      });
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    // Cargar los datos en el formulario
    this.form.patchValue({
      titulo: this.libroSelected.titulo,
      existencias: this.libroSelected.existencias,
      anioPublicacion: this.libroSelected.anioPublicacion,
      autorId: this.libroSelected.autor.autorId, // Asegúrate de que el control en el form sea 'autorId'
      categoriaId: this.libroSelected.categoria.categoriaId // Asignar categoriaId para el select
    });

    this.crearModal('E'); // Abrir el modal para editar
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }

  guardarActualizar() {
    console.log(this.form.getRawValue());
    this.msjSpinner = "Guardando";
    this.spinner.show();
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        console.log("Crear");
        this.libroService.crearLibro(this.form.getRawValue())
          .subscribe(
            {
              next: (data) => {
                console.log(data.message);
                this.spinner.hide();
                this.messageUtils.showMessage("Éxito", data.message, "success")
                this.cerrarModal();
                this.getLibros();
              },
              error: (error) => {
                this.spinner.hide();
                console.log(error);
                this.messageUtils.showMessage("Error", error.error.message, "error");
              }
            }
          );
      } else {
        console.log("Actualizar");
        const libroActualizado: Libro = {
          idLibro: this.libroSelected.idLibro,
          titulo: this.form.get('titulo').value,
          anioPublicacion: this.form.get('anioPublicacion').value,
          existencias: this.form.get('existencias').value,
          autor: { autorId: parseInt(this.form.get('autorId').value, 10) } as Autor, // Casting a Autor
          categoria: { categoriaId: parseInt(this.form.get('categoriaId').value, 10) } as Categoria // Casting a Categoria
        };

        this.libroService.actualizarLibro(libroActualizado)
          .subscribe({
            next: (data) => {
              console.log(data.message);
              this.spinner.hide();
              this.cerrarModal();
              this.getLibros();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              this.spinner.hide();
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      }
    } else {
      this.spinner.hide();
      this.messageUtils.showMessage("Advertencia", "El formulario no es valido", "warning")
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Asegúrate de que el valor sea un número positivo y no vacío
    if (parseInt(value) < 1) {
      input.value = '1';  // Ajusta el valor mínimo si se ingresa algo menor
    }
    if (value.includes('-') || isNaN(Number(value))) {
      input.value = value.replace(/\D/g, '');  // Elimina cualquier carácter no numérico
    }
  }

  abrirCargarLibrosModal() {
    const modalElement = document.getElementById('cargarLibrosModal');
    if (modalElement) {
      this.modalInstanceCargaLibros = new bootstrap.Modal(modalElement);
      this.modalInstanceCargaLibros.show();
      // Resetear el estado del modal
      this.archivoSeleccionadoLibros = null;
      this.nombreArchivoLibros = '';
      this.erroresCargaLibros = [];
      this.mensajeExitoLibros = '';
    }
  }

  cerrarModalCargaLibros() {
    if (this.modalInstanceCargaLibros) {
      this.modalInstanceCargaLibros.hide();
      // Resetear el estado del modal
      this.archivoSeleccionadoLibros = null;
      this.nombreArchivoLibros = '';
      this.erroresCargaLibros = [];
      this.mensajeExitoLibros = '';
    }
  }

  onFileSelectedLibros(event: Event) {
    this.erroresCargaLibros = [];
    this.mensajeExitoLibros = '';
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
        this.archivoSeleccionadoLibros = file;
        this.nombreArchivoLibros = file.name;
      } else {
        this.erroresCargaLibros.push('Por favor seleccione un archivo CSV o Excel válido.');
        this.archivoSeleccionadoLibros = null;
        this.nombreArchivoLibros = '';
        input.value = '';
      }
    }
  }

  procesarArchivoLibros() {
    this.erroresCargaLibros = [];
    this.mensajeExitoLibros = '';
    if (!this.archivoSeleccionadoLibros) {
      this.erroresCargaLibros.push('Debe seleccionar un archivo.');
      return;
    }

    this.msjSpinner = "Procesando archivo";
    this.spinner.show();

    const file = this.archivoSeleccionadoLibros;
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
          this.spinner.hide();
          this.erroresCargaLibros.push('Error al procesar el archivo Excel: ' + (err.message || err));
        }
      };
      reader.onerror = () => {
        this.spinner.hide();
        this.erroresCargaLibros.push('Error al leer el archivo.');
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
          this.spinner.hide();
          this.erroresCargaLibros.push('Error al procesar el archivo CSV: ' + (err.message || err));
        }
      };
      reader.onerror = () => {
        this.spinner.hide();
        this.erroresCargaLibros.push('Error al leer el archivo.');
      };
      reader.readAsText(file);
    } else {
      this.spinner.hide();
      this.erroresCargaLibros.push('Tipo de archivo no soportado.');
    }
  }

  private procesarDatosDesdeArray(data: any[][]) {
    const headers = data[0].map((h: string) => h.trim().toLowerCase());
    const requiredHeaders = ['titulo', 'autor', 'año publicación', 'existencias', 'categoria'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      this.spinner.hide();
      this.erroresCargaLibros.push('Faltan columnas requeridas: ' + missing.join(', '));
      return;
    }

    const libros: any[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < headers.length) continue;

      const autorId = parseInt(row[headers.indexOf('autor')]);
      const autorExiste = this.autores.some(a => a.autorId === autorId);
      if (!autorExiste) {
        this.erroresCargaLibros.push(`El autor con ID ${autorId} no existe en la línea ${i + 1}.`);
        continue;
      }

      const categoriaId = parseInt(row[headers.indexOf('categoria')]);
      const categoriaExiste = this.categorias.some(c => c.categoriaId === categoriaId);
      if (!categoriaExiste) {
        this.erroresCargaLibros.push(`La categoría con ID ${categoriaId} no existe en la línea ${i + 1}.`);
        continue;
      }

      const anioPublicacion = parseInt(row[headers.indexOf('año publicación')]);
      if (isNaN(anioPublicacion) || anioPublicacion < 1 || anioPublicacion > this.currentYear) {
        this.erroresCargaLibros.push(`El año de publicación en la línea ${i + 1} debe ser un número válido entre 1 y ${this.currentYear}.`);
        continue;
      }

      const existencias = parseInt(row[headers.indexOf('existencias')]);
      if (isNaN(existencias) || existencias < 0) {
        this.erroresCargaLibros.push(`Las existencias en la línea ${i + 1} deben ser un número válido mayor o igual a 0.`);
        continue;
      }

      const libro: any = {
        titulo: row[headers.indexOf('titulo')],
        autorId: autorId,
        anioPublicacion: anioPublicacion,
        existencias: existencias,
        categoriaId: categoriaId
      };

      // Validaciones básicas
      if (!libro.titulo) this.erroresCargaLibros.push(`El campo título es obligatorio en la línea ${i + 1}.`);
      if (!libro.autorId) this.erroresCargaLibros.push(`El campo autor es obligatorio en la línea ${i + 1}.`);
      if (!libro.anioPublicacion) this.erroresCargaLibros.push(`El campo año de publicación es obligatorio en la línea ${i + 1}.`);
      if (!libro.categoriaId) this.erroresCargaLibros.push(`El campo categoría es obligatorio en la línea ${i + 1}.`);
      if (libro.existencias === undefined) this.erroresCargaLibros.push(`El campo existencias es obligatorio en la línea ${i + 1}.`);

      libros.push(libro);
    }

    if (this.erroresCargaLibros.length > 0) {
      this.spinner.hide();
      return;
    }

    this.libroService.cargarLibrosMasivos(libros).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.mensajeExitoLibros = response.message || 'Libros cargados correctamente.';
        this.getLibros();
        this.archivoSeleccionadoLibros = null;
        this.nombreArchivoLibros = '';
        // Cerrar el modal después de un breve delay
        setTimeout(() => {
          this.cerrarModalCargaLibros();
        }, 2000);
      },
      error: (error) => {
        this.spinner.hide();
        this.erroresCargaLibros.push(error.error?.message || 'Error al cargar los libros.');
      }
    });
  }
}