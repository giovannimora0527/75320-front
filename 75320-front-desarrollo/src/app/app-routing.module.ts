import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { LibrosComponent } from './libros/libros.component';                  //Autor Daniel Perez ID: 885394
import { PrestamosComponent } from './prestamos/prestamos.component';         //Autor Daniel Perez ID: 885394


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
      { path: 'libros', component: LibrosComponent, data: { title: 'Libros' } },                                //Autor Daniel Perez ID: 885394
      { path: 'prestamos', component: PrestamosComponent, data: { title: 'Préstamos' } },                       //Autor Daniel Perez ID: 885394
      { path: 'autores', loadChildren: () => import('./autores/autores.module').then(m => m.AutoresModule) },       //Autor Daniel Perez ID: 885394
    ]
  },
  { path: '**', redirectTo: 'inicio' }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
