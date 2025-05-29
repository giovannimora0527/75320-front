import { Component } from '@angular/core';
import { CsvLibrosService } from './service/csv-libros.service';
import { Libro } from 'src/app/models/libro';

@Component({
  selector: 'app-upload-libros',
  template: `
    <div class="upload-container">
      <h3>Cargar Libros desde CSV</h3>
      
      <div class="file-input">
        <label>
          <input type="file" (change)="onFileSelected($event)" accept=".csv" #fileInput>
          Seleccionar Archivo CSV
        </label>
        <span class="file-name" *ngIf="selectedFile">
          {{ selectedFile.name }}
        </span>
      </div>

      <button class="upload-button" (click)="procesarCsv()" [disabled]="!selectedFile || loading">
        {{ loading ? 'Procesando...' : 'Cargar Libros' }}
      </button>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="librosCargados.length > 0" class="results-container">
        <h4>Libros cargados: {{ librosCargados.length }}</h4>
        
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>ID Autor</th>
                <th>Año</th>
                <th>Existencias</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let libro of librosCargados">
                <td>{{ libro.titulo }}</td>
                <td>{{ libro.autor.idAutor }}</td>
                <td>{{ libro.anioPublicacion || '-' }}</td>
                <td>{{ libro.existencias }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .file-input {
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .file-input label {
      padding: 0.5rem 1rem;
      background: #3f51b5;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .file-input label:hover {
      background: #303f9f;
    }
    
    .file-name {
      font-size: 0.9rem;
      color: #555;
    }
    
    .upload-button {
      padding: 0.5rem 1.5rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }
    
    .upload-button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
    
    .upload-button:hover:not(:disabled) {
      background: #388e3c;
    }
    
    .error-message {
      color: #f44336;
      margin: 1rem 0;
      padding: 0.5rem;
      background: #ffebee;
      border-radius: 4px;
    }
    
    .results-container {
      margin-top: 2rem;
    }
    
    .table-wrapper {
      overflow-x: auto;
      margin-top: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 500;
    }
    
    tr:hover {
      background-color: #f9f9f9;
    }
  `]
})
export class UploadLibrosComponent {
  selectedFile: File | null = null;
  loading = false;
  error = '';
  librosCargados: Libro[] = [];

  constructor(private csvLibrosService: CsvLibrosService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.error = '';
    this.librosCargados = [];
  }

  async procesarCsv() {
    if (!this.selectedFile) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      this.librosCargados = await this.csvLibrosService.parseLibrosCsv(this.selectedFile);
      if (this.librosCargados.length === 0) {
        this.error = 'No se encontraron libros válidos en el archivo';
      }
    } catch (err) {
      this.error = 'Error al procesar el archivo. Verifica el formato del CSV.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}