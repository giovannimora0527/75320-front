import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Prestamo {
    usuario: Usuario;
    libro: Libro;
    fechaDevolucion: Date;
    fechaPrestamo: Date;
    estado: string;
    idPrestamo: number;
    fechaEntrega: string;
}