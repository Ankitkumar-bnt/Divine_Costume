import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../services/wishlist.service';
import { FooterComponent } from './footer.component';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterLink, FooterComponent],
    template: `
    <div class="wishlist-page">
      <div class="wishlist-container">
        <h1 class="page-title">My Wishlist</h1>
        
        <div *ngIf="wishlistItems.length === 0" class="empty-wishlist">
          <div class="empty-icon">\u2764\ufe0f</div>
          <h2>Your wishlist is empty</h2>
          <p>Add some beautiful costumes to your wishlist!</p>
          <a routerLink="/costumes" class="btn-browse">Browse Costumes</a>
        </div>

        <div *ngIf="wishlistItems.length > 0" class="wishlist-grid">
          <div class="wishlist-card" *ngFor="let item of wishlistItems">
            <div class="card-image">
              <img [src]="item.image" [alt]="item.name">
            </div>
            
            <div class="card-details">
              <h3 class="card-title">{{ item.name }}</h3>
              <p class="card-description">{{ item.description }}</p>
              
              <div class="card-specs">
                <div class="spec-row">
                  <span class="spec-label">Color:</span>
                  <span class="spec-value">{{ item.color }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Size:</span>
                  <span class="spec-value">{{ item.size }}</span>
                </div>
              </div>
              
              <div class="card-pricing">
                <div class="price-item">
                  <span class="price-label">Rental Price:</span>
                  <span class="price-value">\u20b9{{ item.rentPerDay }}/day</span>
                </div>
                <div class="price-item">
                  <span class="price-label">Deposit:</span>
                  <span class="price-value">\u20b9{{ item.deposit }}</span>
                </div>
              </div>
            </div>
            
            <button class="btn-remove" (click)="removeItem(item.id)" aria-label="Remove from wishlist">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .wishlist-page {
      background-color: #F9FAFB;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .wishlist-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1B1B1B;
      margin-bottom: 2rem;
      font-family: 'Poppins', sans-serif;
    }

    /* Empty State */
    .empty-wishlist {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-wishlist h2 {
      font-size: 1.5rem;
      color: #1B1B1B;
      margin-bottom: 0.5rem;
    }

    .empty-wishlist p {
      color: #666;
      margin-bottom: 2rem;
    }

    .btn-browse {
      display: inline-block;
      background: #7A1F2A;
      color: white;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-browse:hover {
      background: #962635;
      transform: translateY(-2px);
    }

    /* Wishlist Grid */
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .wishlist-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: grid;
      grid-template-columns: 180px 1fr auto;
      gap: 1.5rem;
      align-items: start;
      transition: all 0.3s;
      position: relative;
    }

    .wishlist-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .card-image {
      width: 180px;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      background: #F3F4F6;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 0;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1B1B1B;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-specs {
      display: flex;
      gap: 1.5rem;
    }

    .spec-row {
      display: flex;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .spec-label {
      color: #666;
      font-weight: 500;
    }

    .spec-value {
      color: #1B1B1B;
      font-weight: 600;
    }

    .card-pricing {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #E5E7EB;
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      max-width: 300px;
    }

    .price-label {
      color: #666;
      font-size: 0.9rem;
    }

    .price-value {
      font-weight: 700;
      color: #7A1F2A;
      font-size: 1rem;
    }

    .btn-remove {
      background: transparent;
      border: none;
      color: #DC2626;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .btn-remove:hover {
      background: #FEE2E2;
      transform: scale(1.1);
    }

    /* Responsive */
    @media (max-width: 968px) {
      .wishlist-grid {
        grid-template-columns: 1fr;
      }

      .wishlist-card {
        grid-template-columns: 150px 1fr auto;
        gap: 1rem;
        padding: 1rem;
      }

      .card-image {
        width: 150px;
        height: 150px;
      }

      .card-title {
        font-size: 1.1rem;
      }

      .card-specs {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    @media (max-width: 576px) {
      .wishlist-card {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .card-image {
        width: 100%;
        height: 200px;
      }

      .btn-remove {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
    wishlistItems: WishlistItem[] = [];

    constructor(private wishlistService: WishlistService) { }

    ngOnInit() {
        this.wishlistService.wishlistItems$.subscribe(items => {
            this.wishlistItems = items;
        });
    }

    removeItem(id: string) {
        this.wishlistService.removeFromWishlist(id);
    }
}
