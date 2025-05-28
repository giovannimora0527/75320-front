/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import { Observable } from 'rxjs';

declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor, NgxSpinnerModule, DndModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  nacionalidades: Nacionalidad[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  autorSelected: Autor | null = null;
  msjSpinner: string = "";
  archivoCsv: File | null = null;

  form: FormGroup;

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly autorService: AutorService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
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
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
    if (modoForm === 'C') {
      this.form.reset();
      this.autorSelected = null;
    }
  }

  abrirCargarModal() {
    this.titleModal = "Cargar Autores";
    const modalElement = document.getElementById('cargarAutorModal');
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
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
    this.archivoCsv = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      fechaNacimiento: this.formatDateForInput(autor.fechaNacimiento),
      nacionalidadId: autor.nacionalidad?.nacionalidadId ?? null
    });
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  guardarAutor() {
    if (this.form.valid) {
      const nacionalidadSeleccionada = this.nacionalidades.find(
        n => n.nacionalidadId === this.form.get('nacionalidadId')?.value
      );

      const autorData: Autor = {
        autorId: this.modoFormulario === 'E' ? this.autorSelected?.autorId : undefined,
        nombre: this.form.get('nombre')?.value,
        fechaNacimiento: this.form.get('fechaNacimiento')?.value,
        nacionalidad: nacionalidadSeleccionada
      };

      this.msjSpinner = this.modoFormulario === 'C' ? 'Creando Autor' : 'Actualizando Autor';
      this.spinner.show();

      const request: Observable<any> = this.modoFormulario === 'C'
        ? this.autorService.guardarAutor(autorData)
        : this.autorService.actualizarAutor(autorData);

      request.subscribe({
        next: (data) => {
          this.spinner.hide();
          this.cerrarModal();
          this.cargarListaAutores();
          this.messageUtils.showMessage("Éxito", data.message, "success");
        },
        error: (error) => {
          this.spinner.hide();
          this.messageUtils.showMessage("Error", error.error.message, "error");
        }
      });
    } else {
      this.messageUtils.showMessage("Advertencia", "El formulario no es válido", "warning");
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.archivoCsv = input.files[0];
    }
  }

  cargarAutoresDesdeCsv(): void {
    if (!this.archivoCsv) {
      this.messageUtils.showMessage('Error', 'Debe seleccionar un archivo CSV.', 'error');
      return;
    }

    this.msjSpinner = "Cargando autores desde CSV...";
    this.spinner.show();

    this.autorService.cargarAutoresCsv(this.archivoCsv).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Éxito', data.message, 'success');
        this.cargarListaAutores();
        this.cerrarModal();
        this.archivoCsv = null;
      },
      error: (error) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', error.error.message || 'Ocurrió un error al cargar el archivo.', 'error');
        this.archivoCsv = null;
      }
    });
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

  onDrop(event: DndDropEvent): void {
    console.log('Item dropped:', event);
  }
}