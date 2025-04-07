import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { AutorComponent } from './demo/pages/autor/autor.component';
import { LibrosComponent } from './components/libro/libro.component';
import { PrestamosComponent } from './components/prestamo/prestamo.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
      { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuarios' }},
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }},
      {path: 'Libros', component: LibrosComponent, data: { title: 'Libros' }}, 
      {path: 'Prestamos', component: PrestamosComponent, data: { title: 'Prestamos' }}  
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
