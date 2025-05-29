import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Libro } from '../../../../models/libro';
import { Autor } from '../../../../models/autor';

@Injectable({
  providedIn: 'root'
})
export class CsvLibrosService {
  constructor(private papa: Papa) {}

  async parseLibrosCsv(file: File): Promise<Libro[]> {
    return new Promise((resolve, reject) => {
      this.papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const libros: Libro[] = result.data.map((row: any) => {
            const libro = new Libro();
            libro.titulo = row['titulo'] || row['Título'];
            libro.anioPublicacion = row['año'] ? parseInt(row['año']) : undefined;
            libro.existencias = parseInt(row['existencias']) || 0;
            
            // Solo asignamos el autor (sin categoría)
            libro.autor = new Autor();
            libro.autor.idAutor = parseInt(row['idAutor']) || 0;
            
            return libro;
          }).filter((l: Libro) => l.titulo && !isNaN(l.existencias));
          
          resolve(libros);
        },
        error: (error) => reject(error)
      });
    });
  }
}