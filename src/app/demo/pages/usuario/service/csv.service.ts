import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private papa: Papa) {}

  async parseUsuariosCsv(file: File): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
      this.papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const usuarios: Usuario[] = result.data.map((row: any) => ({
            nombre: row['nombre'] || row['Nombre'],
            correo: row['correo'] || row['Correo'] || row['email'],
            telefono: row['telefono'] || row['Teléfono'] || undefined,
            fechaRegistro: row['fechaRegistro'] ? new Date(row['fechaRegistro']) : undefined,
            activo: row['activo'] ? row['activo'].toLowerCase() === 'true' : true // Default true
          })).filter((u: Usuario) => u.nombre && u.correo); // Filtra registros inválidos
          
          resolve(usuarios);
        },
        error: (error) => reject(error)
      });
    });
  }
}