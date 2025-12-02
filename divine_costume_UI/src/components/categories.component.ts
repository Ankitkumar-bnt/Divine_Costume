import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type CategoryKey = 'costumes' | 'ornaments';
interface Category {
  key: CategoryKey;
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="categories-section" id="categories">
      <div class="categories-container">
        <div class="section-header">
          <h2 class="section-title">Explore Our Collections</h2>
          <p class="section-subtitle">
            Choose from beautifully crafted classical dance costumes and matching traditional ornaments.
          </p>
        </div>

        <div class="cards-grid">
          <div class="category-col" *ngFor="let category of categories">
            <div class="category-card">
              <div class="card-image-wrapper">
                <img [src]="category.image" [alt]="category.title" class="card-image">
                <div class="card-overlay"></div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ category.title }}</h3>
                <p class="card-description">{{ category.description }}</p>
                <button class="btn btn-view-more" (click)="navigateDirect(category.key)">
                  {{ category.buttonText }}
                  <span class="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .categories-section {
      padding: 2rem 0;
      background: linear-gradient(180deg, var(--pastel-beige), #fff);
    }

    .categories-container {
      width: 100%;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    @media (min-width: 901px) { .categories-container { padding: 0; } }

    /* grid (avoid .row to prevent Bootstrap interference) */
    .cards-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 1rem; justify-content: center; justify-items: stretch; align-items: stretch; box-sizing: border-box; }
    .category-col { width: 100%; }
    @media (max-width: 900px) { .cards-grid { grid-template-columns: 1fr; max-width: 700px; padding: 0 1rem; } }

    .section-header {
      text-align: center;
      margin: 0 auto 1.5rem;
      width: min(1200px, 100%);
      padding: 0 1rem;
    }
    @media (min-width: 901px) { .section-header { padding: 0; } }

    .section-title {
      font-family: 'Space Grotesk', 'Playfair Display', serif;
      font-size: 2.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-family: 'Inter', 'Poppins', sans-serif;
      font-size: 1.1rem;
      color: #334155;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.65;
    }

    .category-card { background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.9)); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; box-shadow: var(--soft-shadow); transition: transform .3s ease, box-shadow .3s ease; height: 100%; display: flex; flex-direction: column; }

    .category-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(15,23,42,.12);
    }

    .card-image-wrapper {
      position: relative;
      height: 360px;
      overflow: hidden;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .category-card:hover .card-image {
      transform: scale(1.08);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(234,230,255,0), rgba(234,230,255,0.35));
    }

    .card-content {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--glass-bg);
      border-top: 1px solid var(--glass-border);
    }

    .card-title {
      font-family: 'Space Grotesk', 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: .75rem;
    }

    .card-description {
      font-family: 'Inter', 'Poppins', sans-serif;
      font-size: 1rem;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 1rem;
      flex: 1;
    }

    .btn-view-more {
      font-family: 'Inter', 'Poppins', sans-serif;
      font-weight: 600;
      font-size: .95rem;
      color: #111827;
      background: linear-gradient(90deg, var(--pastel-peach), var(--pastel-beige));
      border: 1px solid var(--glass-border);
      padding: .8rem 1.6rem;
      border-radius: 12px;
      transition: all .25s ease;
      cursor: pointer;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: .5rem;
    }

    .btn-view-more:hover {
      transform: translateY(-2px);
      box-shadow: var(--soft-shadow);
    }

    .arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .btn-view-more:hover .arrow {
      transform: translateX(4px);
    }


    @media (max-width: 991px) {
      .categories-section {
        padding: 2.25rem 0;
      }

      .section-title {
        font-size: 2rem;
      }

      .section-subtitle {
        font-size: 1.1rem;
      }

      .card-image-wrapper { height: 280px; }
    }

    @media (max-width: 768px) {
      .section-header {
        margin-bottom: 1.75rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .card-content { padding: 1rem; }

      .card-title {
        font-size: 1.7rem;
      }

      .card-description {
        font-size: 1rem;
      }

      .btn-view-more {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CategoriesComponent {
  categories: Category[] = [
    {
      key: 'costumes',
      title: 'Costumes',
      description: 'Classical dance costumes for Bharatanatyam, Mohiniyattam, Kathak, Kuchipudi and more.',
      image: 'https://images.pexels.com/photos/16032233/pexels-photo-16032233.jpeg?auto=compress&cs=tinysrgb&w=1200',
      buttonText: 'View Costumes'
    },
    {
      key: 'ornaments',
      title: 'Ornaments',
      description: 'Authentic traditional jewellery and accessories that complete the divine look.',
      image: 'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1200',
      buttonText: 'View Ornaments'
    },
    {
      key: 'ornaments',
      title: 'Accessories',
      description: 'Ghungroos, belts, bangles and other essential dance accessories to match your costumes.',
      image: 'https://images.pexels.com/photos/20855981/pexels-photo-20855981.jpeg?auto=compress&cs=tinysrgb&w=1200',
      buttonText: 'View Accessories'
    }
  ];

  constructor(private router: Router) {}

  navigateDirect(categoryKey: CategoryKey) {
    const path = categoryKey === 'costumes' ? '/costumes' : '/ornaments';
    this.router.navigate([path]);
  }
}
