/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
<<<<<<< HEAD
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
<<<<<<< HEAD
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
=======
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
>>>>>>> 3098747 (Frontend ultima entrega semestre)
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
<<<<<<< HEAD
    this.form.reset({
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
=======
>>>>>>> 3098747 (Frontend ultima entrega semestre)
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
<<<<<<< HEAD
=======
    this.archivoCsv = null;
>>>>>>> 3098747 (Frontend ultima entrega semestre)
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
<<<<<<< HEAD
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
  }

  guardarActualizarAutor() {
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log('El formulario es válido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un autor nuevo');
        this.autorService.guardarAutor(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal(); 
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un autor existente');
        // Actualizar solo los campos específicos
        const idAutor = this.autorSelected.idAutor;
        this.autorSelected = {
          ...this.autorSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.autorSelected.idAutor = idAutor;
        console.log(this.autorSelected);    
        this.autorService.actualizarAutor(this.autorSelected)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal();             
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      }
    }
  }

=======
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

>>>>>>> 3098747 (Frontend ultima entrega semestre)
  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
<<<<<<< HEAD
      confirmButtonText: 'Aceptar',      
=======
      confirmButtonText: 'Aceptar',
>>>>>>> 3098747 (Frontend ultima entrega semestre)
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
<<<<<<< HEAD
=======

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onDrop(event: DndDropEvent): void {
    console.log('Item dropped:', event);
  }
>>>>>>> 3098747 (Frontend ultima entrega semestre)
}