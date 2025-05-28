export class Deuda {
  id: number;
  usuario: string;
  libro: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaPago?: string; // Si no está, es "No cancelado"
  monto: number;
  pagada: boolean;
}