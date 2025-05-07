export interface Prestamo {
    id?: number;
    usuarioId: number;
    libroId: number;
    fechaPrestamo: string;
    fechaDevolucion: string;
    estado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
    fechaEntrega?: string | null;
  }