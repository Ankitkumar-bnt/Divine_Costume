import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { ToastService } from '../services/toast.service';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <div class="cart-page">
      <div class="cart-container">        
        <div *ngIf="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some beautiful costumes to get started!</p>
          <a routerLink="/costumes" class="btn-browse">Browse Costumes</a>
        </div>

        <div *ngIf="cartItems.length > 0" class="cart-content">
          <!-- Cart Items Section -->
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cartItems">
              <div class="item-image">
                <img [src]="item.image" [alt]="item.name">
              </div>
              
              <div class="item-details">
                <h3 class="item-title">{{ item.name }}</h3>
                <p class="item-description">{{ item.description }}</p>
                
                <div class="item-specs">
                  <span class="spec"><strong>Color:</strong> {{ item.color }}</span>
                  <span class="spec"><strong>Size:</strong> {{ item.size }}</span>
                </div>
                
                <div class="item-pricing">
                  <div class="price-row">
                    <span class="price-label">Rental Price:</span>
                    <span class="price-value">₹{{ item.rentPerDay }}/day</span>
                  </div>
                  <div class="price-row">
                    <span class="price-label">Deposit:</span>
                    <span class="price-value">₹{{ item.deposit }}</span>
                  </div>
                </div>
                
                <div class="item-actions">
                  <div class="quantity-selector">
                    <button class="qty-btn" (click)="decrementQuantity(item)">−</button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="incrementQuantity(item)">+</button>
                  </div>
                  
                  <div class="action-buttons">
                    <button class="btn-text" (click)="saveForLater(item)">Save for Later</button>
                    <button class="btn-text btn-remove" (click)="removeItem(item)">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Details Card -->
          <div class="price-details-card">
            <h3 class="card-title">Price Details</h3>
            
            <div class="price-breakdown">
              <div class="breakdown-row">
                <span>Rentable ({{ getTotalItems() }} items)</span>
                <span>₹{{ totalRent }}</span>
              </div>
              <div class="breakdown-row">
                <span>Deposit</span>
                <span>₹{{ totalDeposit }}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="total-row">
              <span class="total-label">Total Amount</span>
              <span class="total-value">₹{{ grandTotal }}</span>
            </div>
            
            <div class="refund-notice">
              <i class="bi bi-check-circle-fill"></i>
              <span>Deposit is fully refundable after return</span>
            </div>
            
            <button class="btn-enquiry" (click)="onEnquiry()">ENQUIRY NOW</button>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .cart-page {
      background-color: #F9FAFB;
      min-height: 100vh;
      padding: 2rem 0;
    }

    .cart-container {
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

    /* Empty Cart */
    .empty-cart {
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

    .empty-cart h2 {
      font-size: 1.5rem;
      color: #1B1B1B;
      margin-bottom: 0.5rem;
    }

    .empty-cart p {
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

    /* Cart Content Layout */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      align-items: start;
    }

    /* Cart Items */
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1.5rem;
    }

    .item-image {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      background: #F3F4F6;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1B1B1B;
      margin: 0;
    }

    .item-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.5;
    }

    .item-specs {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
    }

    .spec {
      color: #666;
    }

    .spec strong {
      color: #1B1B1B;
    }

    .item-pricing {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      max-width: 300px;
    }

    .price-label {
      color: #666;
      font-size: 0.95rem;
    }

    .price-value {
      font-weight: 700;
      color: #1B1B1B;
      font-size: 1rem;
    }

    .item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 0.25rem 0.5rem;
    }

    .qty-btn {
      background: transparent;
      border: none;
      color: #7A1F2A;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      transition: all 0.2s;
    }

    .qty-btn:hover {
      background: #FFF8EE;
      border-radius: 4px;
    }

    .qty-value {
      font-weight: 600;
      color: #1B1B1B;
      min-width: 2rem;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 1.5rem;
    }

    .btn-text {
      background: transparent;
      border: none;
      color: #7A1F2A;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn-text:hover {
      text-decoration: underline;
    }

    .btn-remove {
      color: #DC2626;
    }

    /* Price Details Card */
    .price-details-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      position: sticky;
      top: 2rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1B1B1B;
      margin: 0 0 1.5rem;
    }

    .price-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .breakdown-row {
      display: flex;
      justify-content: space-between;
      color: #666;
      font-size: 0.95rem;
    }

    .breakdown-row span:last-child {
      font-weight: 600;
      color: #1B1B1B;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
      margin: 1.5rem 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .total-label {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1B1B1B;
    }

    .total-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #7A1F2A;
    }

    .refund-notice {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #F0FDF4;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      color: #166534;
    }

    .refund-notice i {
      color: #16A34A;
      font-size: 1rem;
    }

    .btn-enquiry {
      width: 100%;
      background: linear-gradient(135deg, #7A1F2A, #962635);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(122, 31, 42, 0.3);
    }

    .btn-enquiry:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(122, 31, 42, 0.4);
    }

    /* Responsive */
    @media (max-width: 968px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .price-details-card {
        position: static;
      }

      .cart-item {
        grid-template-columns: 120px 1fr;
        gap: 1rem;
        padding: 1rem;
      }

      .item-image {
        width: 120px;
        height: 120px;
      }

      .item-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    @media (max-width: 576px) {
      .cart-item {
        grid-template-columns: 1fr;
      }

      .item-image {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalRent = 0;
  totalDeposit = 0;
  grandTotal = 0;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateTotals();
    });
  }

  incrementQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);

    this.toastService.info(
      'Removed from Cart',
      'Undo',
      () => {
        this.cartService.addToCart({
          productId: item.productId,
          name: item.name,
          description: item.description,
          color: item.color,
          size: item.size,
          image: item.image,
          rentPerDay: item.rentPerDay,
          deposit: item.deposit
        }, item.quantity);
        this.toastService.success('Item restored to Cart');
      }
    );
  }

  saveForLater(item: CartItem) {
    // Convert cart item to wishlist item
    const wishlistId = `${item.productId}-${item.color}-${item.size}`;

    this.wishlistService.addToWishlist({
      id: wishlistId,
      productId: item.productId,
      name: item.name,
      description: item.description,
      image: item.image,
      color: item.color,
      size: item.size,
      rentPerDay: item.rentPerDay,
      deposit: item.deposit
    });

    // Remove from cart
    this.cartService.removeItem(item.id);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateTotals() {
    this.totalRent = this.cartService.getTotalRent();
    this.totalDeposit = this.cartService.getTotalDeposit();
    this.grandTotal = this.cartService.getGrandTotal();
  }

  onEnquiry() {
    // TODO: Implement enquiry functionality
    alert('Enquiry functionality coming soon! Total: ₹' + this.grandTotal);
  }
}
