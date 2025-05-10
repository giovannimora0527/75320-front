/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PrestamoService } from './service/prestamo.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss'
})
export class PrestamosComponent {
  prestamos: any[] = [];
  usuarios: any[] = [];
  libros: any[] = [];

  modalInstance: any;
  modoFormulario: string = '';
  prestamoSeleccionado: any | null = null;
  accion: string = ''; // Nueva propiedad para mostrar el título del modal y el botón

  msjSpinner: string = 'Cargando';
  form: FormGroup;

  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.buildForm();
    this.cargarPrestamos();
    this.cargarUsuarios();
    this.cargarLibros();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      usuarioId: ['', Validators.required],
      idLibro: ['', Validators.required],
      fechaDevolucion: [''],
      fechaEntrega: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarPrestamos() {
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data.map((p: any) => ({
          ...p,
          estadoTexto: p.estado === 'P' ? 'PRESTADO' : 'DEVUELTO',
          fechaEntregaTexto: p.fechaEntrega ? p.fechaEntrega : 'No entregado'
        }));
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        Swal.fire('Error', 'No se pudo cargar los préstamos', 'error');
      }
    });
  }

  cargarUsuarios() {
    this.prestamoService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      
      error: () => console.error('Error cargando usuarios')
    });
  }

  cargarLibros() {
    this.prestamoService.getLibros().subscribe({
      next: (data) => (this.libros = data),
      error: () => console.error('Error cargando libros')
    });
  }

  abrirModalCrear() {
    this.modoFormulario = 'C';
    this.accion = 'Registrar Préstamo'; // Actualiza el título del modal
    this.form.reset();
    this.abrirModal('crearPrestamoModal');
  }

  abrirModalEditar(prestamo: any) {
    this.modoFormulario = 'E';
    this.accion = 'Editar Entrega'; // Actualiza el título del modal
    this.form.patchValue({
      usuarioId: prestamo.usuarioId || null, // Inicializa usuarioId
      libroId: prestamo.libroId || null, // Inicializa libroId
      fechaDevolucion: prestamo.fechaDevolucion || null, // Inicializa fechaDevolucion
      fechaEntrega: prestamo.fechaEntrega ? prestamo.fechaEntrega.split('T')[0] : null // Inicializa fechaEntrega
    });
    this.prestamoSeleccionado = prestamo;
    this.abrirModal('crearPrestamoModal');
  }

  abrirModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      if (!this.modalInstance || this.modalInstance._element.id !== id) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    this.modalInstance?.hide();
    this.prestamoSeleccionado = null;
  }
  guardarActualizarPrestamo(): void {
    if (this.modoFormulario === 'E') {
      const datos = {
        idPrestamo: this.prestamoSeleccionado.id, // Asegúrate de que `id` esté presente en `prestamoSeleccionado`
        fechaEntrega: this.form.value.fechaEntrega
      };
  
      this.prestamoService.actualizarFechaEntrega(datos.idPrestamo, datos.fechaEntrega).subscribe({
        next: () => {
          this.cargarPrestamos(); // Recargar la lista de préstamos
          this.cerrarModal(); // Cerrar el modal
        },
        error: (err) => {
          console.error('Error al actualizar la entrega:', err);
        }
      });
    } else {
      
    }
  }

  guardarPrestamo() {
    console.log(this.form.getRawValue());
    return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Formulario inválido:', this.form.value);
      return;
    }
  
    console.log('Datos enviados al backend:', this.form.getRawValue());
  
    this.msjSpinner = 'Guardando préstamo';
    this.spinner.show();
  
    const datos = this.form.getRawValue();
    this.prestamoService.crearPrestamo(datos).subscribe({
      next: (resp) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Éxito', resp.message, 'success');
        this.cargarPrestamos();
        this.cerrarModal();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al guardar el préstamo:', err);
        this.messageUtils.showMessage('Error', err.error?.message || 'Error al guardar el préstamo', 'error');
      }
    });
  }

  actualizarEntrega() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.msjSpinner = 'Actualizando préstamo';
    this.spinner.show();

    const datos = {
      ...this.prestamoSeleccionado,
      ...this.form.value
    };

    this.prestamoService.actualizarPrestamo(datos).subscribe({
      next: (resp) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Éxito', resp.message, 'success');
        this.cargarPrestamos();
        this.cerrarModal();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', err.error?.message || 'Error al actualizar el préstamo', 'error');
      }
    });
  }
}