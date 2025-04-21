import { Component, OnInit, inject } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterModule
} from '@angular/router';

// Proyecto imports
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);
  private spinnerService = inject(SpinnerService);

  title = 'Biblioteca Uniminuto';

  ngOnInit(): void {
    // Spinner tipo A al iniciar la app

    this.spinnerService.setSpinnerType('ball-spin-fade');


    /*this.spinner.show();
    setTimeout(() => this.spinner.hide(), 1500);*/


    setTimeout(() => {
      this.spinner.show();
    
      setTimeout(() => {
        this.spinner.hide();
      }, 3000);
    
    }, 200);

    // Spinner al cambiar de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinnerService.setSpinnerType('pacman');
        setTimeout(() => {
          this.spinner.show();
        }, 100); // este delay es crucial
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.spinner.hide(), 500);
        window.scrollTo(0, 0); // desplazamiento al top
      }
    });
  }
}





/*// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  title = 'Biblioteca Uniminuto';

  // life cycle hook
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}*/
