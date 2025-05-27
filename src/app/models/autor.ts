import { Nacionalidad } from "./nacionalidad";

export class Autor {
    autorId: number;
    nombre: string;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: Date;
}