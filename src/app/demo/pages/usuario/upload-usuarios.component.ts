import { Component } from '@angular/core';
import { CsvService } from './service/csv.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-upload-usuarios',
  template: `
    <div class="upload-container">
      <h3>Cargar Usuarios desde CSV</h3>
      
      <div class="file-input">
        <label>
          <input type="file" (change)="onFileSelected($event)" accept=".csv" #fileInput>
          Seleccionar archivo
        </label>
        <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
      </div>

      <button (click)="procesarCsv()" [disabled]="!selectedFile || loading">
        {{ loading ? 'Procesando...' : 'Cargar Usuarios' }}
      </button>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <div *ngIf="usuariosCargados.length > 0" class="results">
        <h4>Usuarios cargados: {{ usuariosCargados.length }}</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuariosCargados">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.correo }}</td>
                <td>{{ usuario.telefono || '-' }}</td>
                <td>{{ usuario.activo ? 'Sí' : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }
    .file-input {
      margin: 15px 0;
    }
    .file-input input[type="file"] {
      display: none;
    }
    .file-input label {
      padding: 8px 15px;
      background: #3f51b5;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      display: inline-block;
    }
    button {
      padding: 8px 15px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #cccccc;
    }
    .error {
      color: #f44336;
      margin: 10px 0;
    }
    .table-container {
      overflow-x: auto;
      margin-top: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #e0e0e0;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class UploadUsuariosComponent {
  selectedFile: File | null = null;
  loading = false;
  error = '';
  usuariosCargados: Usuario[] = [];

  constructor(private csvService: CsvService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.error = '';
    this.usuariosCargados = [];
  }

  async procesarCsv() {
    if (!this.selectedFile) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      this.usuariosCargados = await this.csvService.parseUsuariosCsv(this.selectedFile);
      if (this.usuariosCargados.length === 0) {
        this.error = 'El archivo no contiene usuarios válidos o está vacío';
      }
    } catch (err) {
      this.error = 'Error al procesar el archivo. Verifica el formato.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}