import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-csv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.scss']
})
export class CsvComponent {
  selectedFile: File | null = null;
  tipoArchivo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedFile || !this.tipoArchivo) return;

    const formData = new FormData();
    formData.append('archivo', this.selectedFile);

    this.http.post(`http://localhost:8080/biblioteca/v1/csv/${this.tipoArchivo}`, formData, { responseType: 'text' })
      .subscribe({
        next: (response) => this.mensaje = response,
        error: (error: HttpErrorResponse) => {
          this.mensaje = error.error || 'Error al cargar el archivo.';
        }
      });
  }
}
