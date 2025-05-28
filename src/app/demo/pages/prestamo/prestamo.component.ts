/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { UsuarioService } from '../usuario/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { LibroService } from '../libro/service/libro.service';
import { Libro } from 'src/app/models/libro';
import { PrestamoService } from './service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DateTimeUtils } from 'src/app/utils/date-utils';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  titleModal: string = '';
  modoFormulario: string = '';
  modalInstance: any;
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  fechaDevolucion: string = ''; // ejemplo: '2025-04-07'
  prestamos: Prestamo[] = [];
  prestamoSelected: Prestamo;
  msjSpinner: string = '';

  form: FormGroup = new FormGroup({
    usuarioId: new FormControl(''),
    libroId: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    fechaEntrega: new FormControl('')
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageUtils: MessageUtils,
    private readonly usuarioService: UsuarioService,
    private readonly libroService: LibroService,
    private readonly prestamoService: PrestamoService,
    private readonly spinner: NgxSpinnerService,
    private readonly dateTimeUtils: DateTimeUtils
  ) {
    this.cargarFormulario();
    this.cargarListaUsuarios();
    this.cargarListaLibros();
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    this.prestamoService.listarPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.log(error);
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarListaLibros() {
    this.libroService.getLibrosDisponiblesForPrestamo().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required]],
      libroId: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      fechaEntrega: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      usuarioId: '',
      libroId: '',
      fechaDevolucion: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      usuarioId: prestamo.usuario.idUsuario,
      libroId: prestamo.libro.idLibro,
      fechaDevolucion: prestamo.fechaDevolucion
    });
    this.crearModal('E');
  }

  crearModal(modoForm: string) {
    this.cargarListaLibros();
    this.titleModal = modoForm == 'C' ? 'Registrar Préstamo' : 'Editar Préstamo';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearPrestamoModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  guardarPrestamo() {
    this.msjSpinner = 'Guardando';   
    if (this.modoFormulario.includes('C')) {
      this.form.get('fechaEntrega')?.setValue(1);
    } 
    if (!this.form.valid) {
      this.messageUtils.showMessage('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (this.form.valid) {
      this.spinner.show();
      this.prestamoService.guardarPrestamo(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log(data);
          this.spinner.hide();
          this.messageUtils.showMessage('Éxito', data.message, 'success');
          this.cargarPrestamos();
          this.cerrarModal();
        },
        error: (error) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Error', error.error.message, 'error');
        }
      });
    }
  }

  hacerEntregaLibro() {
    this.msjSpinner = 'Entregando Libro';
    this.spinner.show();
    if (this.modoFormulario.includes('E')) {
      this.form.get('usuarioId')?.setValue(this.prestamoSelected.usuario.idUsuario);
      this.form.get('libroId')?.setValue(this.prestamoSelected.libro.idLibro);
      this.form.get('fechaDevolucion')?.setValue(this.prestamoSelected.fechaDevolucion);
    }
    if (this.form.valid) {
      const fechaForm = this.form.get('fechaEntrega')?.value;
      if (fechaForm) {
        const fecha = new Date(fechaForm);
        this.prestamoSelected.fechaEntrega = this.dateTimeUtils.formatDateCurrentZone(fecha);
      }

      this.prestamoService.entregarLibro(this.prestamoSelected).subscribe({
        next: (data) => {
          this.spinner.hide();
          this.cerrarModal();
          this.cargarPrestamos();
          this.messageUtils.showMessage('Exito', data.message, 'success');
        },
        error: (error) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Error', error.error.message, 'error');
        }
      });
    }
  }
}
