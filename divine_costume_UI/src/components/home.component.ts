import { Component } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { HeroComponent } from './hero.component';
import { CategoriesComponent } from './categories.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, CategoriesComponent, FooterComponent],
  template: `
    <div class="home-container">
      <app-navbar></app-navbar>
      <app-hero></app-hero>
      <app-categories></app-categories>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class HomeComponent {}
