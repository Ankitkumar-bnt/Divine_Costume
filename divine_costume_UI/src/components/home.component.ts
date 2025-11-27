import { Component } from '@angular/core';
import { HeroComponent } from './hero.component';
import { CategoriesComponent } from './categories.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriesComponent, FooterComponent],
  template: `
    <div class="home-container">
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
