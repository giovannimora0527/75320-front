export interface Autor {
    autorId: number | null;
    nombre: string;
    nacionalidad: string;
    fechaNacimiento: string;
  }
  
  export interface AutorRq {
    nombre: string;
    nacionalidad: string;
    fechaNacimiento: string;
  }
  
  export interface AutorRs {
    autorId: number;
    nombre: string;
    nacionalidad: string;
    fechaNacimiento: string;
  }