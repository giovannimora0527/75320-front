import { TestBed } from '@angular/core/testing';

import { AutorService } from './autor.service';

describe('AutorService', () => {
  let service: AutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

//function beforeEach(arg0: () => void) {
  //throw new Error('Function not implemented.');
//}

//function expect(service: AutorService) {
// throw new Error('Function not implemented.');
//}
