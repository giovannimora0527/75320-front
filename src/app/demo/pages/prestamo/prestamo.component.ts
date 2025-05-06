import { Component, OnInit } from '@angular/core';
import { Prestamo } from './prestamo.model';
import { PrestamoService } from './service/prestamo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  // styleUrls: ['./prestamo.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PrestamoComponent implements OnInit {

  prestamos: Prestamo[] = [];

  nuevoPrestamo: Prestamo = {
    id: 0,
    usuario: '',
    libro: '',
    fechaPrestamo: '',
    fechaDevolucion: '',
    estado: 'PRESTADO'
  };

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.prestamoService.listarPrestamos().subscribe((data) => {  
      this.prestamos = data;
    });
  }

  crearPrestamo(): void {
    this.prestamoService.crearPrestamo(this.nuevoPrestamo).subscribe(() => {
      this.cargarPrestamos();
      this.nuevoPrestamo = {
        id: 0,
        usuario: '',
        libro: '',
        fechaPrestamo: '',
        fechaDevolucion: '',
        estado: 'PRESTADO'
      };
    });
  }

  actualizarEstado(prestamo: Prestamo, nuevoEstado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO'): void {
    const prestamoActualizado: Prestamo = {
      ...prestamo,
      estado: nuevoEstado
    };
    this.prestamoService.actualizarPrestamo(prestamo.id, prestamoActualizado).subscribe(() => {
      this.cargarPrestamos();
    });
  }

  getColor(estado: string): string {
    switch (estado) {
      case 'PRESTADO':
        return 'yellow';
      case 'VENCIDO':
        return 'red';
      case 'DEVUELTO':
        return 'green'; 
      default:
        return 'black'; 
    }
  }
}
