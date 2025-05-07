import { Component, OnInit } from '@angular/core';
import { AutorService } from './service/autor.service'; // Ajusta la ruta según tu estructura
import { Autor } from 'src/app/models/autor.model'; // Asegúrate de que la ruta sea correcta
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)] si es standalone

@Component({
  selector: 'app-autor',
  standalone: true, // Si usas standalone, asegúrate de declararlo
  imports: [FormsModule], // Asegúrate de incluir FormsModule para que ngModel funcione
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss']
})
export class AutorComponent implements OnInit {

  autores: Autor[] = []; // Lista de autores
  nuevoAutor: Autor = { nombre: '' }; // Nuevo autor por crear
  autorEditar: Autor | null = null; // Autor que se va a editar

  constructor(private autorService: AutorService) {}

  ngOnInit(): void {
    this.listarAutores(); // Obtén la lista de autores al inicializar
  }

  listarAutores(): void {
    this.autorService.obtenerAutores().subscribe((data: Autor[]) => {
      this.autores = data; // Asigna los datos recibidos
    });
  }

  crearAutor(): void {
    if (this.nuevoAutor.nombre.trim() === '') {
      alert('El nombre no puede estar vacío'); // Validación simple
      return;
    }
    this.autorService.crearAutor(this.nuevoAutor).subscribe(() => {
      this.nuevoAutor = { nombre: '' }; // Resetea el formulario
      this.listarAutores(); // Actualiza la lista
    });
  }

  prepararEditar(autor: Autor): void {
    this.autorEditar = { ...autor }; // Clona el objeto para editarlo sin afectar directamente a la lista
  }

  actualizarAutor(): void {
    if (this.autorEditar) {
      this.autorService.actualizarAutor(this.autorEditar).subscribe(() => {
        this.autorEditar = null; // Limpia el formulario de edición
        this.listarAutores(); // Actualiza la lista
      });
    }
  }

  cancelarEdicion(): void {
    this.autorEditar = null; // Cancela la edición
  }
}