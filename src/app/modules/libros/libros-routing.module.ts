import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrosComponent } from './libros.component';
import { CrearLibroComponent } from '../formulario/crear-libro/crear-libro.component';
import { EditarLibroComponent } from '../formulario/editar-libro/editar-libro.component';

const routes: Routes = [
  { path: '', component: LibrosComponent },
  { path: 'crear', component: CrearLibroComponent },
  { path: 'editar/:id', component: EditarLibroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrosRoutingModule {}
