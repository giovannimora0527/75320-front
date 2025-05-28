import { Libro } from "./libro";
import { Usuario } from "./usuario";

<<<<<<< HEAD
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
=======
export class Prestamo {
    usuario: Usuario;
    libro: Libro;
    fechaDevolucion: Date;
    fechaPrestamo: Date;
    estado: string;
    idPrestamo: number;
    fechaEntrega: string;
>>>>>>> 3098747 (Frontend ultima entrega semestre)
}