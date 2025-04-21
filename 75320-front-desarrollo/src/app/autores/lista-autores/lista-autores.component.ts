import { Component, OnInit } from '@angular/core';
import { Autor, AutorService } from '../../servicios/autor.service';              //Autor Daniel Perez ID: 885394
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({                                                                           //Autor Daniel Perez ID: 885394
  selector: 'app-lista-autores',
  templateUrl: './lista-autores.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})  
export class ListaAutoresComponent implements OnInit {                                   //Autor Daniel Perez ID: 885394
  autores: Autor[] = [];

  constructor(                                                                           //Autor Daniel Perez ID: 885394
    private servicio: AutorService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.servicio.listar().subscribe(data => this.autores = data);
  }

  nuevo() {
    this.router.navigate(['nuevo'], { relativeTo: this.route });                         //Autor Daniel Perez ID: 885394
  }

  editar(a: Autor) {
    if (a.autorId !== undefined && a.autorId !== null) {
      this.router.navigate(['editar', a.autorId], { relativeTo: this.route });            //Autor Daniel Perez ID: 885394
    } else {
      console.error('El autor no tiene ID:', a);
    }
  }
}

