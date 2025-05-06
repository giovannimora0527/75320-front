import { Nacionalidad } from "./nacionalidad";

export class Autor {
    idAutor: number;
    nombre: string;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: Date;
}