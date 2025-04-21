import { Component } from '@angular/core';

@Component({
  selector: 'app-autor',
  imports: [],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {

<<<<<<< Updated upstream
=======
  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: [''],
      fechaNacimiento: ['']
    });
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
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');
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
      nombre: "",
      nacionalidad: "",
      fechaNacimiento: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarActualizarAutor() {
    if (this.form.valid) {
      const autor: Autor = this.form.value;
      if (this.modoFormulario.includes('C')) {
        this.autorService.crearAutor(autor).subscribe({
          next: () => {
            this.cargarListaAutores();
            this.cerrarModal();
            Swal.fire('Éxito', 'Autor creado exitosamente', 'success');
          },
          error: (error) => {
            Swal.fire('Error', error.error.message, 'error');
          }
        });
      } else {
        // Actualizar autor
      const autorActualizado: Autor = {
        ...this.autorSelected, // mantiene el ID y otros campos si hay
        ...this.form.value     // actualiza los datos del formulario
      };

      this.autorService.actualizarAutor(autorActualizado).subscribe({
        next: () => {
          this.cargarListaAutores();
          this.cerrarModal();
          Swal.fire('Éxito', 'Autor actualizado exitosamente', 'success');
        },
        error: err => Swal.fire('Error', err.error.message, 'error')
      });
    }
  }
}

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento
    });
  }
>>>>>>> Stashed changes
}
