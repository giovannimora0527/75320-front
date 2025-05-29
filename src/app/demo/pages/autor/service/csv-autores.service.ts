import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Autor } from 'src/app/models/autor';

@Injectable({
  providedIn: 'root'
})
export class CsvAutoresService {
  constructor(private papa: Papa) {}

  async parseAutoresCsv(file: File): Promise<Autor[]> {
    return new Promise((resolve, reject) => {
      this.papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const autores: Autor[] = result.data.map((row: any) => {
            const autor = new Autor();
            autor.nombre = row['nombre'] || row['Nombre'] || '';
            
            if (row['fechaNacimiento']) {
              autor.fechaNacimiento = new Date(row['fechaNacimiento']);
            }

            return autor;
          }).filter((a: Autor) => a.nombre.trim().length > 0);
          
          resolve(autores);
        },
        error: (error) => reject(error)
      });
    });
  }
}