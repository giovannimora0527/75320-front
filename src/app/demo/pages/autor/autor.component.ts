import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';
import { formatDate } from '@angular/common';
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule], 
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = '';
  autorSelected: Autor | null = null;
  autores: Autor[] = [];
  errorMessage: string = '';

  form: FormGroup;

  constructor(
    private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private AutorService: AutorService
  ) {
    this.cargarFormulario();
    this.cargarAutores();
  }

  cargarAutores() {
    this.msjSpinner = 'Cargando autores...';
    this.spinner.show();
    this.AutorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error cargando autores:', error);
        this.errorMessage = 'Error al cargar la lista de autores';
        this.spinner.hide();
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      autorId: [null],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      nacionalidad: ['', [Validators.required, Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required, this.dateValidator]]
    });
  }

  // Validador personalizado para fecha
  dateValidator(control: AbstractControl) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (control.value && !pattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }
  

  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD
  private convertirFecha(fechaStr: string): string {
    const [year, month, day] = fechaStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  crearAutorModal(modoForm: string) {
    this.errorMessage = '';
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? 'Crear Autor' : 'Actualizar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;

    // Formatear fecha para mostrarla en formato DD/MM/YYYY
    const fechaFormateada = formatDate(autor.fechaNacimiento, 'yyyy-MM-dd', 'en-US');
    console.log('Fecha formateada:', fechaFormateada); // Verificar la fecha formateada
    this.form.patchValue({
      autorId: autor.autorId,
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: fechaFormateada
    });

    this.crearAutorModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.errorMessage = '';
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  actualizarAutor() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Por favor complete todos los campos correctamente';
      return;
    }

    // Convertir fecha al formato esperado por el backend
    const fechaISO = this.convertirFecha(this.form.value.fechaNacimiento);
    const autorData: Autor = {
      autorId: this.form.value.autorId || null,
      nombre: this.form.value.nombre.trim(),
      nacionalidad: this.form.value.nacionalidad.trim(),
      fechaNacimiento: this.form.value.fechaNacimiento
    };
    console.log('Payload enviado:', autorData);
    this.spinner.show();
    this.errorMessage = '';

    if (this.modoFormulario === 'C') {
      this.AutorService.crearAutor(autorData).subscribe({
        next: () => {
          this.cargarAutores();
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error al crear autor:', err);
          this.errorMessage = err.error?.message || 'Error al crear el autor';
          this.spinner.hide();
        }
      });
    } else {
      this.AutorService.actualizarAutor(autorData).subscribe({
        next: () => {
          this.cargarAutores();
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error al actualizar autor:', err);
          this.errorMessage = err.error?.message || 'Error al actualizar el autor';
          this.spinner.hide();
        }
      });
    }
  }
}
