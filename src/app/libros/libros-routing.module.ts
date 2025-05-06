import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarLibrosComponent } from './listar-libros/listar-libros.component';
import { FormularioLibroComponent } from './formulario-libro/formulario-libro.component';
import { CrearLibroComponent } from './crear-libro/crear-libro.component';
import { EditarLibroComponent } from './editar-libro/editar-libro.component';

const routes: Routes = [ 
  { path: 'listar', component: ListarLibrosComponent },
  { path: 'formulario', component: FormularioLibroComponent },
  { path: 'crear', component: CrearLibroComponent },
  { path: 'editar/:id', component: EditarLibroComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrosRoutingModule { }
