import { Libro } from "./libro";
import { Usuario } from "./usuario";

export interface Prestamo {
  id: number;
  idUsuario: number;
  idLibro: number; 
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: string;
  fechaEntrega: string;
  usuario: Usuario;
  libro: Libro;
}