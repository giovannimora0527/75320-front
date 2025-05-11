import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from './service/prestamo.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { LibroService } from '../libro/service/libro.service';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  minFechaDevolucion: string = '';


  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  prestamoSelected: Prestamo;

  form: FormGroup = new FormGroup({
    usuario: new FormControl(''),
    libro: new FormControl(''),
    fechaPrestamo: new FormControl(''),
    estado: new FormControl('')
  });

  constructor(
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService,
    private libroService: LibroService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaPrestamos();
    this.cargarFormulario();
    this.cargarUsuarios();
    this.cargarLibrosDisponibles();

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    this.minFechaDevolucion = mañana.toISOString().split('T')[0];

  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuario: ['', Validators.required],
      libro: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
      fechaEntrega: [''],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaPrestamos() {
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
      }
    });
  }

  cargarLibrosDisponibles() {
    this.libroService.getLibrosDisponibles().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        console.error('Error cargando libros disponibles:', error);
      }
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Préstamo' : 'Editar Préstamo';
    const modalElement = document.getElementById('crearPrestamoModal');
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
      usuario: '',
      libro: '',
      fechaPrestamo: '',
      fechaEntrega: '',
      estado: 'PRESTADO'
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
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

  guardarActualizarPrestamo() {
    console.log('Estado del formulario:', this.form.valid);
    console.log('Errores del formulario:', this.form.errors);
    console.log('Valor del formulario:', this.form.getRawValue());

    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      if (this.modoFormulario === 'C') {
        const nuevoPrestamo = {
          idUsuario: formValue.usuario,
          idLibro: formValue.libro,
          fechaDevolucion: formValue.fechaDevolucion
        };

        this.prestamoService.guardarPrestamo(nuevoPrestamo).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            const mensaje = error?.error?.message || 'Error al crear préstamo';
            this.showMessage('Error', mensaje, 'error');
          }
        });

      } else {
        const actualizar = {
          idPrestamo: this.prestamoSelected.idPrestamo,
          fechaEntrega: formValue.fechaEntrega
        };

        this.prestamoService.actualizarPrestamo(actualizar).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            const mensaje = error?.error?.message || 'Error al actualizar préstamo';
            this.showMessage('Error', mensaje, 'error');
          }
        });
      }
    } else {
      this.showMessage('Atención', 'Formulario inválido, verifica los campos requeridos.', 'warning');
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

  getColorEstado(prestamo: Prestamo): string {
    switch (prestamo.estado) {
      case 'DEVUELTO':
        return 'text-success';
      case 'PRESTADO':
        return 'text-warning';
      case 'VENCIDO':
        return 'text-danger';
      default:
        return '';
    }
  }


}