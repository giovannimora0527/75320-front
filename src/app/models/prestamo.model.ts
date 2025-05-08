export interface Prestamo {
  id: number;
  usuario: {
    id: number;
    nombreUsuario: string;
  };
  libro: {
    id: number;
    titulo: string;
  };
  fechaPrestamo: string; // Fecha en formato ISO
  fechaDevolucion: string;
  fechaEntrega?: string; // Opcional
  estadoPrestamo: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
}