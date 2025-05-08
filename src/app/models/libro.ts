import { Autor } from "./autor";
import { Categoria } from "./categoria";

export class Libro {
    idLibro: number;
    titulo: string;
    autor: Autor;
    anioPublicacion?: number;
    existencias: number;
    categoria: Categoria;
}