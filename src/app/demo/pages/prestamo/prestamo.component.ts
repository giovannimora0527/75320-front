<<<<<<< HEAD
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
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
<<<<<<< HEAD
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

=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
<<<<<<< HEAD
      usuario: ['', Validators.required],
      libro: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
      fechaEntrega: [''],
=======
      usuarioId: ['', [Validators.required]],
      libroId: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      fechaEntrega: ['', [Validators.required]]
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

<<<<<<< HEAD
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

=======
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
<<<<<<< HEAD
      usuario: '',
      libro: '',
      fechaPrestamo: '',
      fechaEntrega: '',
      estado: 'PRESTADO'
=======
      usuarioId: '',
      libroId: '',
      fechaDevolucion: ''
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
