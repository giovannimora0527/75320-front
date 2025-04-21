import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private spinnerTypeSubject = new BehaviorSubject<string>('ball-scale-multiple');
  spinnerType$ = this.spinnerTypeSubject.asObservable();

  setSpinnerType(type: string) {
    this.spinnerTypeSubject.next(type);
  }
}
