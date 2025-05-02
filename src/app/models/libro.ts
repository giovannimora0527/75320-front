export class Libro {
    idLibro!: number;
    titulo!: string;
    autorId!: number;
    anioPublicacion?: Date;
    categoria?: string;
    existencias!: number;
}