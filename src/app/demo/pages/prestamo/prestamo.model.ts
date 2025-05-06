import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrestamoComponent } from './prestamo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PrestamoModule { }

export interface Prestamo {
  id: number;
  usuario: string;
  libro: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
}
