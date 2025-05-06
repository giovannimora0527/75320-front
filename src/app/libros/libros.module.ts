import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrosRoutingModule } from './libros-routing.module';
import { ListarLibrosComponent } from './listar-libros/listar-libros.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LibrosRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class LibrosModule { }
