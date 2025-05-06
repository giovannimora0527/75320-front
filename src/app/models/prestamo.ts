import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Prestamo{
    idPrestamo?:number;
    usuario?:Usuario
    libro?:Libro
    fechaPrestamo?: Date;
    fechaDevolucion?: Date;
    estado?:string;
    fechaEntrega?: Date | null;
    idUsuario?:number
    idLibro?:number
}