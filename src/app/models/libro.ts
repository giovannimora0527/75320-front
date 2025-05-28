export class Libro {
    idLibro!: number;
    titulo!: string;
    nombreAutor: string;
    anioPublicacion?: number;
    categoria?: string;
    existencias!: number;
}