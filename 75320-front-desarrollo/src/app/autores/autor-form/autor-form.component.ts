import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutorService, Autor } from '../../servicios/autor.service';                            //Autor Daniel Perez ID: 885394

@Component({                                                                                    //Autor Daniel Perez ID: 885394
  standalone: true,
  selector: 'app-autor-form',
  templateUrl: './autor-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AutorFormComponent implements OnInit {                                              //Autor Daniel Perez ID: 885394
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicio = inject(AutorService);

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    nacionalidad: ['', Validators.required],
    fechaNacimiento: ['', Validators.required]
  });

  errorUniqueness = false;
  id: string | null = null;
  editando = false;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');                                             //Autor Daniel Perez ID: 885394
    this.editando = !!this.id;

    if (this.editando && this.id) {
      this.servicio.obtener(+this.id).subscribe(autor => {
        this.form.patchValue(autor);
      });
    }
  }

  submit() {
    const autor: Autor = this.form.value;                                                         //Autor Daniel Perez ID: 885394

    if (this.editando && this.id) {
      this.servicio.actualizar(+this.id, autor).subscribe(() => {
        this.redirigirDespuesDeGuardar();
      });
    } else {
      this.servicio.crear(autor).subscribe(() => {
        this.redirigirDespuesDeGuardar();
      });
    }
  }

  private redirigirDespuesDeGuardar() {
    this.router.navigate(['/autores']);
  }
}
