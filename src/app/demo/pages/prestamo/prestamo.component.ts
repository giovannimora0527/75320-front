import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoService } from './service/prestamo.service';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { LibroService } from 'src/app/demo/pages/libro/service/libro.service';
import { UsuarioService } from 'src/app/demo/pages/usuario/service/usuario.service';
import Swal from 'sweetalert2';
import { PrestamoRq } from 'src/app/models/prestamo-rq';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  prestamoSelected!: Prestamo;
  modoFormulario: string = '';
  modalInstance: any;

  form: FormGroup = new FormGroup({
    libro: new FormControl('', Validators.required),
    usuario: new FormControl('', Validators.required),
    fechaPrestamo: new FormControl(''),
    fechaDevolucion: new FormControl('', Validators.required),
    fechaEntrega: new FormControl(''),
  });

  constructor(
    private prestamoService: PrestamoService,
    private libroService: LibroService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.cargarFormulario();
    this.cargarListaPrestamos();
    this.cargarUsuarios();
    this.cargarLibros();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private formatDateToLocalDateTime(date: Date): string {
    return date.toISOString().slice(0, 19);
  }

  dateFromString(fecha: string): Date {
    return new Date(fecha);
  }

  fechaDevolucionMayorQuePrestamo(fechaPrestamoControlName: string, fechaDevolucionControlName: string): any {
    return (group: FormGroup) => {
      const fechaPrestamo = group.controls[fechaPrestamoControlName];
      const fechaDevolucion = group.controls[fechaDevolucionControlName];

      if (!fechaPrestamo.value || !fechaDevolucion.value) {
        return null; // Si alguno está vacío, la validación no aplica
      }

      const fechaPrestamoDate = new Date(fechaPrestamo.value);
      const fechaDevolucionDate = new Date(fechaDevolucion.value);

      if (fechaDevolucionDate <= fechaPrestamoDate) {
        return { invalidDate: true };
      }

      return null;
    };
  }


  cargarFormulario(): void {
    this.form = this.formBuilder.group({
      libro: [{ value: '', disabled: this.modoFormulario === 'EE' }, Validators.required],
      usuario: [{ value: '', disabled: this.modoFormulario === 'EE' }, Validators.required],
      fechaPrestamo: [new Date()],
      fechaDevolucion: [{ value: '', disabled: this.modoFormulario === 'EE' }, Validators.required],
      fechaEntrega: ['']
    }, {
      validators: this.fechaDevolucionMayorQuePrestamo('fechaPrestamo', 'fechaDevolucion')
    });
  }

  crearPrestamoModal(modoForm: string): void {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('modalPrestamo');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      libro: '',
      usuario: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      fechaEntrega: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardar(): void {
    if (!this.form.valid) {
      Swal.fire('Error', 'Formulario no válido', 'error');
      return;
    }
  
    if (this.modoFormulario === 'C') {
      this.crearPrestamo();
    } else if (this.modoFormulario === 'E') {
      this.editarPrestamo();
    }
  }

  crearPrestamo(): void {
    const prestamo: Prestamo = {
        libro: this.form.value.libro,  
        usuario: this.form.value.usuario,
        fechaPrestamo: this.formatDateToLocalDateTime(new Date()),
        fechaDevolucion: this.formatDateToLocalDateTime(new Date(this.form.value.fechaDevolucion)),
        estado: 'PRESTADO'
    };
  
    this.prestamoService.crearPrestamo(prestamo).subscribe({
      next: () => {
        this.cargarListaPrestamos();
        this.cerrarModal();
        Swal.fire('Éxito', 'Préstamo creado exitosamente', 'success');
      },
      error: error => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  editarPrestamo(): void {
    const prestamoEditado: PrestamoRq = {
      fechaEntrega: this.formatDateToLocalDateTime(new Date(this.form.value.fechaEntrega)),
  };
  
    this.prestamoService.guardarPrestamo(prestamoEditado).subscribe({
      next: () => {
        this.cargarListaPrestamos();
        this.cerrarModal();
        Swal.fire('Éxito', 'Fecha de entrega actualizada', 'success');
      },
      error: err => Swal.fire('Error', err.error.message, 'error')
    });
  }

  abrirModoEdicion(prestamo: Prestamo): void {
    this.modoFormulario = 'EE'; // 'EE' para 'Editar Entrega'
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      fechaEntrega: prestamo.fechaEntrega
    });
    this.crearPrestamoModal(this.modoFormulario);
  }

  cargarListaPrestamos(): void {
    this.prestamoService.listarPrestamos().subscribe({
      next: (data) => this.prestamos = data,
      error: (error) => Swal.fire('Error', error.error.message, 'error')
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => Swal.fire('Error', error.error.message, 'error')
    });
  }

  cargarLibros(): void {
    this.libroService.getLibrosDisponibles().subscribe({
      next: (data) => this.libros = data,
      error: (error) => Swal.fire('Error', error.error.message, 'error')
    });
  }

  obtenerEstado(prestamo: Prestamo): string {
    if (prestamo.fechaEntrega) return 'DEVUELTO';
    const fechaDev = new Date(prestamo.fechaDevolucion);
    const hoy = new Date();
    return hoy > fechaDev ? 'VENCIDO' : 'PRESTADO';
  }

  obtenerColorEstado(prestamo: Prestamo): string {
    if (prestamo.fechaEntrega) return 'text-success';
    const fechaDev = new Date(prestamo.fechaDevolucion);
    const hoy = new Date();
    return hoy > fechaDev ? 'text-danger' : 'text-warning';
  }

  getTituloLibro(libro: Libro): string {
    return libro ? libro.titulo : '---';
  }

  getNombreUsuario(usuario: Usuario): string {
    return usuario ? usuario.nombre : '---';
  }
}