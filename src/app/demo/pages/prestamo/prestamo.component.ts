import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from 'src/app/services/spinner.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { PrestamoService } from './service/prestamo.service';
import { PrestamoRq } from 'src/app/models/prestamo-rq';
import { PrestamoEntregaRq } from 'src/app/models/prestamo-entrega-rq';
import { UsuarioDisponible } from 'src/app/models/usuario-disponible';
import { LibroDisponible } from 'src/app/models/libro-disponible';
import Swal from 'sweetalert2';
import { Prestamo } from 'src/app/models/prestamo';
import { forkJoin } from 'rxjs';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];;
  usuariosDisponibles: UsuarioDisponible[] = [];
  librosDisponibles: LibroDisponible[] = [];
  prestamoSeleccionado: any = null;
  modalInstance: any;
  modalEntregaInstance: any;
  msjSpinner: string = 'Cargando...';

  form: FormGroup = new FormGroup({
    usuarioId: new FormControl('', [Validators.required]),
    libroId: new FormControl('', [Validators.required]),
    fechaDevolucion: new FormControl('', [Validators.required])
  });

  formEntrega: FormGroup = new FormGroup({
    idPrestamo: new FormControl(null),
    fechaEntrega: new FormControl('', [Validators.required])
  });

  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService
  ) {
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    this.spinnerService.setSpinnerType('ball-triangle-path');
    this.spinner.show();
    this.prestamoService.listarPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', err.error.message, 'error');
      }
    });
  }

  abrirModalNuevo() {
    // Reconstruye el formulario completamente
    this.form = this.formBuilder.group({
      usuarioId: ['', Validators.required],
      libroId: ['', Validators.required],
      fechaDevolucion: ['', Validators.required]
    });
  
    forkJoin([
      this.prestamoService.obtenerUsuariosDisponibles(),
      this.prestamoService.obtenerLibrosDisponibles()
    ]).subscribe(([usuarios, libros]) => {
      this.usuariosDisponibles = usuarios;
      this.librosDisponibles = libros;
  
      const modalElement = document.getElementById('modalPrestamo');
      
      //  Elimina instancia anterior (si existe)
      if (this.modalInstance) {
        this.modalInstance.hide();
        this.modalInstance = null;
      }
  
      // Siempre crea una nueva instancia
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    });
  }
  
  cargarUsuariosYLibros() {
    this.prestamoService.obtenerUsuariosDisponibles().subscribe({
      next: (res) => this.usuariosDisponibles = res
    });
    this.prestamoService.obtenerLibrosDisponibles().subscribe({
      next: (res) => this.librosDisponibles = res
    });
  }

  guardarPrestamo() {
    if (this.form.invalid) return;
    
    console.log('Formulario listo para enviar:', this.form.value);

    const nuevoPrestamo: PrestamoRq = {
      usuarioId: Number(this.form.value.usuarioId),
      libroId: Number(this.form.value.libroId),
      fechaDevolucion: this.form.value.fechaDevolucion
    };
  
    this.spinnerService.setSpinnerType('ball-clip-rotate-multiple');
    this.spinner.show();
  
    this.prestamoService.guardarPrestamo(nuevoPrestamo).subscribe({
      next: (res) => {
        this.messageUtils.showMessage('Éxito', res.message, 'success');
        this.cargarPrestamos();
  
        // Recargar listas disponibles para el siguiente préstamo
        this.prestamoService.obtenerUsuariosDisponibles().subscribe({
          next: (res) => this.usuariosDisponibles = res
        });
        this.prestamoService.obtenerLibrosDisponibles().subscribe({
          next: (res) => this.librosDisponibles = res
        });
  
        // Cerrar modal y limpiar su instancia
        (this.modalInstance as any)._element?.classList.remove('show');
        this.modalInstance.hide();
        this.modalInstance = null;
        
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', err.error.message, 'error');
      }
    });
  }

  abrirModalEntrega(prestamo: any): void {
    this.prestamoSeleccionado = prestamo;
    this.formEntrega.patchValue({
      idPrestamo: prestamo.id,
      fechaEntrega: ''
    });
    const modalElement = document.getElementById('modalEntrega');
    if (!this.modalEntregaInstance) {
      this.modalEntregaInstance = new bootstrap.Modal(modalElement);
    }
    this.modalEntregaInstance.show();
  }

  guardarEntrega(): void {
    console.log('Préstamo seleccionado:', this.prestamoSeleccionado);
    if (this.formEntrega.invalid) return;
  
    const entrega: PrestamoEntregaRq = {
      prestamoId: this.prestamoSeleccionado.id, // pasar el ID del préstamo
      fechaEntrega: this.formEntrega.value.fechaEntrega
    };
    const fechaEntrega = new Date(entrega.fechaEntrega);
    const fechaDevolucion = new Date(this.prestamoSeleccionado.fechaDevolucion);
  
    if (fechaEntrega < new Date(this.prestamoSeleccionado.fechaPrestamo)) {
      Swal.fire('Error', 'La fecha de entrega no puede ser menor a la fecha de préstamo.', 'error');
      return;
    }
  
    this.spinnerService.setSpinnerType('square-jelly-box');
    this.spinner.show();
  
    this.prestamoService.registrarEntrega(entrega).subscribe({
      next: (res) => {
        this.messageUtils.showMessage('Éxito', res.message, 'success');
        this.cargarPrestamos();
        this.spinner.hide();
        this.modalEntregaInstance.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', err.error.message, 'error');
      }
    });
  }

  getColor(estado: string): string {
    switch (estado) {
      case 'PRESTADO': return 'orange';
      case 'DEVUELTO': return 'green';
      case 'VENCIDO': return 'red';
      default: return 'gray';
    }
  }
}
