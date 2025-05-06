// Importaciones de Angular
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// Importación del componente Spinner
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly router = inject(Router); // Inyección de dependencias con readonly

  title: string = 'Biblioteca Uniminuto';

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
