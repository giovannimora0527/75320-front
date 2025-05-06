import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LibrosComponent } from './libros/libros.component';
import { CrearLibroComponent } from './libros/crear-libro/crear-libro.component';
import { EditarLibroComponent } from './libros/editar-libro/editar-libro.component';

@NgModule({
  declarations: [
    AppComponent,
    LibrosComponent,
    CrearLibroComponent,
    EditarLibroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
