export interface Autor {
    id?: number; // Solo lo usa el backend, no se muestra en la vista
    nombre: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    numeroLibros?: number;         // calculado desde backend
    titulosLibros?: string[];      // calculado desde backend
}
