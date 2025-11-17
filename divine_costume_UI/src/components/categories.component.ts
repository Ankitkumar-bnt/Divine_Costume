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
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explore Our Collections</h2>
          <p class="section-subtitle">
            Choose from beautifully crafted classical dance costumes and matching traditional ornaments.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-6 col-md-12" *ngFor="let category of categories">
            <div class="category-card">
              <div class="card-image-wrapper">
                <img [src]="category.image" [alt]="category.title" class="card-image">
                <div class="card-overlay"></div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ category.title }}</h3>
                <p class="card-description">{{ category.description }}</p>
                <button class="btn btn-view-more" (click)="openDateModal(category.key)">
                  {{ category.buttonText }}
                  <span class="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="modal-backdrop" *ngIf="showDateModal">
      <div class="modal-card" role="dialog" aria-modal="true">
        <h3 class="modal-title">Select Dates (Optional)</h3>
        <div class="modal-body">
          <div class="form-row">
            <label for="pickupDate">Pickup date</label>
            <input id="pickupDate" type="date" [(ngModel)]="pickupDate">
          </div>
          <div class="form-row">
            <label for="returnDate">Return date</label>
            <input id="returnDate" type="date" [(ngModel)]="returnDate">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-skip" (click)="skip()">Skip</button>
          <button class="btn btn-show" (click)="show()">
            {{ selectedCategory === 'costumes' ? 'Show Costumes' : 'Show Ornaments' }}
          </button>
        </div>
        <button class="btn btn-close" (click)="closeDateModal()" aria-label="Close">×</button>
      </div>
    </div>
  `,
  styles: [`
    .categories-section {
      padding: 5rem 0;
      background-color: #FFF8EE;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      font-weight: 700;
      color: #7A1F2A;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-family: 'Poppins', sans-serif;
      font-size: 1.2rem;
      color: #1B1B1B;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .category-card {
      background-color: #FFFDF9;
      border: 2px solid #D4AF37;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(122, 31, 42, 0.1);
      transition: all 0.4s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(212, 175, 55, 0.3);
    }

    .card-image-wrapper {
      position: relative;
      height: 320px;
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent 0%, rgba(122, 31, 42, 0.3) 100%);
    }

    .card-content {
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #7A1F2A;
      margin-bottom: 1rem;
    }

    .card-description {
      font-family: 'Poppins', sans-serif;
      font-size: 1.05rem;
      color: #1B1B1B;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      flex: 1;
    }

    .btn-view-more {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #7A1F2A;
      background-color: transparent;
      border: 2px solid #D4AF37;
      padding: 0.8rem 2rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-view-more:hover {
      background-color: #D4AF37;
      color: #7A1F2A;
      transform: translateX(5px);
    }

    .arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .btn-view-more:hover .arrow {
      transform: translateX(5px);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-card {
      position: relative;
      width: 100%;
      max-width: 520px;
      background: #FFFDF9;
      border: 2px solid #D4AF37;
      border-radius: 16px;
      box-shadow: 0 12px 24px rgba(212,175,55,0.3);
      padding: 1.5rem;
    }
    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      color: #7A1F2A;
      margin: 0 0 1rem 0;
      text-align: center;
    }
    .modal-body {
      display: grid;
      gap: 1rem;
    }
    .form-row {
      display: grid;
      gap: 0.5rem;
    }
    .form-row label {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #7A1F2A;
    }
    .form-row input[type="date"] {
      font-family: 'Poppins', sans-serif;
      border: 2px solid #D4AF37;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      background: #fff;
      color: #1B1B1B;
    }
    .modal-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
    .btn-skip {
      background: transparent;
      color: #7A1F2A;
      border: 2px solid #D4AF37;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-show {
      background: #D4AF37;
      color: #7A1F2A;
      border: 2px solid #D4AF37;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }
    .btn-close {
      position: absolute;
      top: 8px;
      right: 12px;
      background: transparent;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #7A1F2A;
    }

    @media (max-width: 991px) {
      .categories-section {
        padding: 3rem 0;
      }

      .section-title {
        font-size: 2.5rem;
      }

      .section-subtitle {
        font-size: 1.1rem;
      }

      .card-image-wrapper {
        height: 280px;
      }
    }

    @media (max-width: 768px) {
      .section-header {
        margin-bottom: 2.5rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .card-content {
        padding: 1.5rem;
      }

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
      image: 'https://images.pexels.com/photos/8923478/pexels-photo-8923478.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'View Costumes'
    },
    {
      key: 'ornaments',
      title: 'Ornaments',
      description: 'Authentic traditional jewellery and accessories that complete the divine look.',
      image: 'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'View Ornaments'
    }
  ];

  showDateModal = false;
  selectedCategory: CategoryKey | null = null;
  pickupDate: string | null = null;
  returnDate: string | null = null;

  constructor(private router: Router) {}

  openDateModal(categoryKey: CategoryKey) {
    this.selectedCategory = categoryKey;
    this.showDateModal = true;
  }

  closeDateModal() {
    this.showDateModal = false;
  }

  private navigateToListing(withDates: boolean) {
    if (!this.selectedCategory) return;
    const path = this.selectedCategory === 'costumes' ? '/costumes' : '/ornaments';
    const queryParams: any = {};
    if (withDates) {
      if (this.pickupDate) queryParams.pickupDate = this.pickupDate;
      if (this.returnDate) queryParams.returnDate = this.returnDate;
    }
    this.closeDateModal();
    this.router.navigate([path], Object.keys(queryParams).length ? { queryParams } : undefined);
  }

  skip() {
    this.navigateToListing(false);
  }

  show() {
    this.navigateToListing(true);
  }
}
