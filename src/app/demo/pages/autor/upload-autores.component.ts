import { Component } from '@angular/core';
import { CsvAutoresService } from './service/csv-autores.service';
import { Autor } from 'src/app/models/autor';

@Component({
  selector: 'app-upload-autores',
  template: `
    <div class="upload-container">
      <h3>Cargar Autores desde CSV</h3>
      
      <div class="file-input">
        <input type="file" (change)="onFileSelected($event)" accept=".csv" #fileInput>
        <button (click)="fileInput.click()">Seleccionar Archivo</button>
        <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
      </div>

      <button (click)="procesarCsv()" [disabled]="!selectedFile || loading">
        {{ loading ? 'Procesando...' : 'Cargar Autores' }}
      </button>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="autoresCargados.length > 0">
        <h4>Autores cargados: {{ autoresCargados.length }}</h4>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let autor of autoresCargados">
              <td>{{ autor.nombre }}</td>
              <td>{{ autor.fechaNacimiento | date:'dd/MM/yyyy' || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos iguales a los del componente de libros */
  `]
})
export class UploadAutoresComponent {
  selectedFile: File | null = null;
  loading = false;
  error = '';
  autoresCargados: Autor[] = [];

  constructor(private csvAutoresService: CsvAutoresService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.error = '';
    this.autoresCargados = [];
  }

  async procesarCsv() {
    if (!this.selectedFile) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      this.autoresCargados = await this.csvAutoresService.parseAutoresCsv(this.selectedFile);
      if (this.autoresCargados.length === 0) {
        this.error = 'No se encontraron autores válidos';
      }
    } catch (err) {
      this.error = 'Error al procesar el archivo. Verifica el formato.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}