import { Libro } from "./libro";
import { Usuario } from "./usuario";

export interface Prestamo {
    id?: number;
    usuario: Usuario;
    libro: Libro;
    fechaPrestamo: string;
    fechaDevolucion: string;
    fechaEntrega?: string;
    estado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
  }