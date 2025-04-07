export interface Prestamo {
  id: number;
  libroId: number;
  usuarioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'Activo' | 'Devuelto';
}
