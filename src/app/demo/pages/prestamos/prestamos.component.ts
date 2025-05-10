/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PrestamoService } from './service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRq } from 'src/app/models/prestamo-rq';
import { UsuarioService } from '../usuario/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { LibroService } from '../libros/service/libro.service';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss'
})
export class PrestamoComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  accion: string = '';
  prestamoSelected: Prestamo | null = null;
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  form: FormGroup = new FormGroup({
    fechaEntrega: new FormControl('', [Validators.required])
  });

  constructor(
    private readonly spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService,
    private libroService: LibroService
  ) {
    this.cargarFormulario();
    this.cargarPrestamos();
    this.getUsuarios();
    this.getLibros();
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }

  cargarPrestamos() {
    this.msjSpinner = 'Cargando préstamos...';
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuario: ['', Validators.required],
      libro: ['', Validators.required],
      fechaPrestamo: [''],
      fechaEntrega: [''],
      fechaDevolucion: ['', Validators.required],
      estado: ['PRESTADO']
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.accion = modoForm === 'C' ? 'Crear Préstamo' : 'Actualizar Préstamo';
    const modalElement = document.getElementById('crearPrestamoModal');

    if (modalElement) {
      modalElement.removeAttribute('aria-hidden');

      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();

      setTimeout(() => {
        const firstInput = modalElement.querySelector('input, select, textarea, button') as HTMLElement;
        firstInput?.focus();
      }, 150);
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      usuario: '',
      libro: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: 'PRESTADO'
    });

    if (this.modalInstance) {
      this.modalInstance.hide();
    }

    const modalElement = document.getElementById('crearPrestamoModal');
    if (modalElement) {
      modalElement.setAttribute('aria-hidden', 'true');
    }

    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.crearPrestamoModal('E');
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      usuario: this.prestamoSelected.usuario.idUsuario,
      libro: this.prestamoSelected.libro.idLibro,
      fechaPrestamo: this.prestamoSelected.fechaPrestamo,
      fechaEntrega: this.prestamoSelected.fechaEntrega,
      fechaDevolucion: this.prestamoSelected.fechaDevolucion,
      estado: this.prestamoSelected.estado
    });
  }

  crearPrestamo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Creamos el objeto PrestamoRq con la fechaDevolucion como string
    const prestamoRq: PrestamoRq = {
      idUsuario: this.form.value.usuario,
      idLibro: this.form.value.libro,
      fechaDevolucion: this.form.value.fechaDevolucion // Se mantiene como string
    };

    // Simulando la creación de un usuario y libro completo (esto debe obtenerse desde un servicio o base de datos)
    const usuario: Usuario = {
      idUsuario: prestamoRq.idUsuario,
      nombre: "Nombre Usuario", // Ejemplo, debe venir del servicio
      correo: "usuario@correo.com" // Ejemplo, debe venir del servicio
    };

    const libro: Libro = {
      idLibro: prestamoRq.idLibro,
      titulo: "Título del libro", // Ejemplo, debe venir del servicio
      autorId: 1, // Ejemplo, debe venir del servicio
      existencias: 10 // Ejemplo, debe venir del servicio
    };

    // Crear el objeto Prestamo con la fechaDevolucion como Date
    const prestamo: Prestamo = {
      usuario: usuario,  // Pasamos el objeto completo
      libro: libro,  // Pasamos el objeto completo
      fechaPrestamo: new Date(),  // Fecha actual
      fechaDevolucion: new Date(prestamoRq.fechaDevolucion),  // Convertimos el string de fechaDevolucion a Date
      estado: 'Pendiente',  // Asignamos un estado inicial
      idUsuario: usuario.idUsuario,
      idLibro: libro.idLibro
    };

    // Mostrar spinner mientras se realiza la operación
    this.spinner.show();

    // Llamar al servicio para guardar el préstamo
    this.prestamoService.guardarPrestamo(prestamo).subscribe({
      next: (res) => {
        this.spinner.hide();  // Ocultar el spinner después de la respuesta
        this.cargarPrestamos();  // Refrescar la lista de préstamos
        this.cerrarModal();  // Cerrar el modal
      },
      error: (err) => {
        this.spinner.hide();  // Ocultar el spinner en caso de error
        console.error('Error al crear préstamo:', err);  // Mostrar el error en consola
      }
    });
  }







  actualizarPrestamo() {
    if (this.form.invalid || !this.prestamoSelected) {
      this.form.markAllAsTouched();
      return;
    }

    const fechaEntrega = this.form.value.fechaEntrega;
    const fechaDevolucion = this.prestamoSelected.fechaDevolucion;
    const fechaActual = new Date();

    if (new Date(fechaEntrega) < fechaActual) {
      alert('La fecha de entrega no puede ser menor al día actual.');
      return;
    }

    let nuevoEstado = 'DEVUELTO';
    if (fechaDevolucion && new Date(fechaEntrega) > new Date(fechaDevolucion)) {
      nuevoEstado = 'VENCIDO';
    }

    const prestamoActualizado: Prestamo = {
      ...this.prestamoSelected,
      fechaEntrega: fechaEntrega,
      estado: nuevoEstado
    };

    this.spinner.show();
    this.prestamoService.actualizarPrestamo(prestamoActualizado).subscribe({
      next: () => {
        this.cargarPrestamos();
        this.cerrarModal();
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al actualizar préstamo', err);
        this.spinner.hide();
      }
    });
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'PRESTADO':
        return 'text-warning';
      case 'VENCIDO':
        return 'text-danger';
      case 'DEVUELTO':
        return 'text-success';
      default:
        return '';
    }
  }
}
