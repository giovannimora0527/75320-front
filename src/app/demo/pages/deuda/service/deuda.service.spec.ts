import { TestBed } from '@angular/core/testing';
import { DeudaService } from './deuda.service';

describe('DeudaService', () => {
  let service: DeudaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeudaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
