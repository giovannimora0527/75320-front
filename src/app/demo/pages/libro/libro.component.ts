/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageUtils } from 'src/app/utils/message-utils';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, NgxSpinnerModule, FormsModule, CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss',
  providers: [CategoriaService]
})
export class LibroComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  libroSelected: Libro;
  currentYear = new Date().getFullYear();

  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService,
    private readonly categoriaService: CategoriaService
  ) {
    this.getLibros();    
    this.getAutores();
    this.cargarCategorias();
    this.cargarFormulario();
  }

  cargarCategorias() {
   this.categoriaService.getCategorias().subscribe(
   {
    next: (data) => {
      this.categorias = data;
      console.log(data);
    },
    error: (error) => {
      console.log(error);
    }
   }
   );
  }

  getAutores() {
    this.autorService.getAutores().subscribe(
      {
        next: (data) => {         
          this.autores = data;
        },
        error: (error) => {
          console.log(error);
        },
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      existencias: [true, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {        
        this.libros = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {   
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
    if (this.modoFormulario == "C") {
      this.form.reset({
        titulo: '',
        autorId: this.autores[0]?.autorId,
        anioPublicacion: '',
        categoriaId: this.categorias[0]?.categoriaId,
        existencias: '',
      });
    }   
  }

  abrirModoEdicion(libro: Libro) {    
    this.libroSelected = libro;  
    // Cargar los datos en el formulario
    this.form.patchValue({
      titulo: this.libroSelected.titulo,     
      existencias: this.libroSelected.existencias,
      anioPublicacion: this.libroSelected.anioPublicacion,
      autorId: this.libroSelected.autor.autorId, // Asegúrate de que el control en el form sea 'autorId'
      categoriaId: this.libroSelected.categoria.categoriaId // Asignar categoriaId para el select
    });
  
    this.crearModal('E'); // Abrir el modal para editar
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();   
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }

  guardarActualizar() {
    console.log(this.form.getRawValue());
    this.msjSpinner = "Guardando";
    this.spinner.show();
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        console.log("Crear");
        this.libroService.crearLibro(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data.message);
              this.spinner.hide();
              this.messageUtils.showMessage("Éxito", data.message, "success")  
              this.cerrarModal();
              this.getLibros();
            },
            error: (error) => {
              this.spinner.hide();
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");  
            }
          }
        );
      } else {
        console.log("Actualizar"); 
        const libroActualizado: Libro = {
          idLibro: this.libroSelected.idLibro,
          titulo: this.form.get('titulo').value,
          anioPublicacion: this.form.get('anioPublicacion').value,
          existencias: this.form.get('existencias').value,
          autor: { autorId: parseInt(this.form.get('autorId').value, 10) } as Autor, // Casting a Autor
          categoria: { categoriaId: parseInt(this.form.get('categoriaId').value, 10) } as Categoria // Casting a Categoria
        };
        
        this.libroService.actualizarLibro(libroActualizado)
          .subscribe({
            next: (data) => {
              console.log(data.message);
              this.spinner.hide();
              this.cerrarModal();
              this.getLibros();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              this.spinner.hide();
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      }
    } else {
      this.spinner.hide();
      this.messageUtils.showMessage("Advertencia", "El formulario no es valido", "warning")
    }    
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Asegúrate de que el valor sea un número positivo y no vacío
    if (parseInt(value) < 1) {
      input.value = '1';  // Ajusta el valor mínimo si se ingresa algo menor
    }
    if (value.includes('-') || isNaN(Number(value))) {
      input.value = value.replace(/\D/g, '');  // Elimina cualquier carácter no numérico
    }
  }
}
