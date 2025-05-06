import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioLibroComponent } from './formulario-libro.component';

describe('FormularioLibroComponent', () => {
  let component: FormularioLibroComponent;
  let fixture: ComponentFixture<FormularioLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioLibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
