import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { AutorComponent } from './demo/pages/autor/autor.component';
import { LibroComponent } from './demo/pages/libro/libro.component';
import { PrestamoComponent } from './demo/pages/prestamo/prestamo.component';

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
      { path: 'libros', component: LibroComponent, data: { title: 'Libros' }},
      { path: 'prestamos', component: PrestamoComponent, data: { title: 'Préstamos' }},
      {
        path: 'csv',
        loadComponent: () => import('./demo/pages/csv/csv.component').then(m => m.CsvComponent),
        data: { title: 'Carga Masiva CSV' }
      }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
