import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { NavComponent } from './components/nav.component';
import { ToastContainerComponent } from './components/toast-container.component';
import './global_styles.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, ToastContainerComponent],
  template: `
    <app-nav></app-nav>
    <router-outlet></router-outlet>
    <app-toast-container></app-toast-container>
  `,
  styles: []
})
export class App { }

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
