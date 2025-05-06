export interface Prestamo {
    idPrestamo?: number;
    idUsuario: number;
    idLibro: number;
    fechaPrestamo: string; // ISO format
    fechaEntrega?: string;
  }