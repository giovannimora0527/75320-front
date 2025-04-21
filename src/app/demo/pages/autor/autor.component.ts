import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Autor } from '../../models/autor.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutorService } from './service/autor.service';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AutorComponent implements OnInit {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  autorSelected: Autor | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autorService: AutorService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarListaAutores();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message || 'Error al cargar autores', 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.autorSelected = null;
    this.form.reset();
    this.abrirModal();
  }

  abrirModal() {
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  abrirModoEdicion(autor: Autor) {
    this.modoFormulario = 'E';
    this.autorSelected = autor;
    this.form.patchValue(autor);
    this.abrirModal();
  }

guardarActualizarAutor() {
    // Clear previous backend errors
    this.form.get('nombre')?.setErrors(null);

    if (this.form.valid) {
      const autorData = this.form.getRawValue();
      if (this.modoFormulario === 'C') {
        this.autorService.crearAutor(autorData).subscribe({
          next: (data) => {
            this.cerrarModal();
            Swal.fire('Éxito', 'Autor creado correctamente', 'success');
            this.cargarListaAutores();
          },
          error: (error) => {
            if (error.error && error.error.message && error.error.message.includes('ya existe')) {
              this.form.get('nombre')?.setErrors({ backend: error.error.message });
            } else {
              Swal.fire('Error', error.error.message || 'Error al crear autor', 'error');
            }
          }
        });
      } else if (this.modoFormulario === 'E' && this.autorSelected) {
        const autorToUpdate = { ...this.autorSelected, ...autorData };
        this.autorService.actualizarAutor(autorToUpdate).subscribe({
          next: (data) => {
            this.cerrarModal();
            Swal.fire('Éxito', 'Autor actualizado correctamente', 'success');
            this.cargarListaAutores();
          },
          error: (error) => {
            if (error.error && error.error.message && error.error.message.includes('ya existe')) {
              this.form.get('nombre')?.setErrors({ backend: error.error.message });
            } else {
              Swal.fire('Error', error.error.message || 'Error al actualizar autor', 'error');
            }
          }
        });
      }
    }
  }
}
