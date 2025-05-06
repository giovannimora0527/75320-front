import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLibrosComponent } from './listar-libros.component';

describe('ListarLibrosComponent', () => {
  let component: ListarLibrosComponent;
  let fixture: ComponentFixture<ListarLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
