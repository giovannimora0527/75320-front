import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaAutoresComponent } from './lista-autores/lista-autores.component';                  //Autor Daniel Perez ID: 885394

const routes: Routes = [
  { path: '', component: ListaAutoresComponent },                                                 //Autor Daniel Perez ID: 885394
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./autor-form/autor-form.component').then(m => m.AutorFormComponent)                  //Autor Daniel Perez ID: 885394
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./autor-form/autor-form.component').then(m => m.AutorFormComponent)                   //Autor Daniel Perez ID: 885394
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoresRoutingModule { }
