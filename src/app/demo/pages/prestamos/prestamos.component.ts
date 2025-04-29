import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { PrestamoService } from 'src/app/services/prestamos/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo.model';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})
export class PrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarios: { id: number, nombre: string }[] = [];
  librosDisponibles: { id: number, titulo: string }[] = [];

  nuevoPrestamo: Prestamo = {
    usuarioId: 0,
    libroId: 0,
    fechaPrestamo: '',
    fechaDevolucion: '',
    estado: 'PRESTADO',
    fechaEntrega: null
  };

  prestamoEditar: Prestamo | null = null;

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.listarPrestamos();
    this.listarUsuarios();
    this.listarLibrosDisponibles();
  }

  listarPrestamos(): void {
    this.prestamoService.obtenerPrestamos().subscribe((data: Prestamo[]) => {
      this.prestamos = data;
    });
  }

  listarUsuarios(): void {
    this.usuarios = [
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María Gómez' },
      { id: 3, nombre: 'Carlos Rodríguez' }
    ];
  }

  listarLibrosDisponibles(): void {
    this.librosDisponibles = [
      { id: 1, titulo: 'Cien años de soledad' },
      { id: 2, titulo: '1984' },
      { id: 3, titulo: 'Rayuela' }
    ];
  }

  crearPrestamo(): void {
    if (new Date(this.nuevoPrestamo.fechaDevolucion) <= new Date()) {
      alert('La fecha de devolución debe ser al menos un día después de la fecha actual.');
      return;
    }

    this.prestamoService.crearPrestamo(this.nuevoPrestamo).subscribe(() => {
      this.nuevoPrestamo = { usuarioId: 0, libroId: 0, fechaPrestamo: '', fechaDevolucion: '', estado: 'PRESTADO', fechaEntrega: null };
      this.listarPrestamos();
    });
  }

  editarPrestamo(prestamo: Prestamo): void {
    this.prestamoEditar = { ...prestamo };
  }

  actualizarPrestamo(): void {
    if (this.prestamoEditar) {
      this.prestamoService.actualizarPrestamo(this.prestamoEditar).subscribe(() => {
        this.prestamoEditar = null;
        this.listarPrestamos();
      });
    }
  }

  cancelarEdicion(): void {
    this.prestamoEditar = null;
  }

  getEstadoClase(estado: string): string {
    if (estado === 'PRESTADO') return 'estado-prestado';
    if (estado === 'VENCIDO') return 'estado-vencido';
    if (estado === 'DEVUELTO') return 'estado-devuelto';
    return '';
  }

  // ✅ Métodos agregados para obtener nombres de usuario y títulos de libros
  obtenerNombreUsuario(usuarioId: number): string {
    return this.usuarios.find(u => u.id === usuarioId)?.nombre || 'Usuario desconocido';
  }

  obtenerTituloLibro(libroId: number): string {
    return this.librosDisponibles.find(l => l.id === libroId)?.titulo || 'Libro desconocido';
  }
}