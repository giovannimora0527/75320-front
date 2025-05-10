import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Prestamo {
    id?: number;
    fechaPrestamo: Date;
    fechaDevolucion: Date;
    fechaEntrega?: Date;
    estado: string;
    libro: Libro;
    usuario: Usuario;
    idUsuario?: number
    idLibro?: number
}