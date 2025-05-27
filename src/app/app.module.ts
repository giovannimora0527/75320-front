import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa el componente standalone
import { PrestamoComponent } from './demo/pages/prestamo/prestamo.component';

@NgModule({
  declarations: [
    AppComponent,  // Mantén solo el AppComponent aquí
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    PrestamoComponent  // Importa el componente standalone directamente en imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
