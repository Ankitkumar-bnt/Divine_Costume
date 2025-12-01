import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from './footer.component';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { ToastService } from '../services/toast.service';

interface VariantSize {
  size: string;
  stock: number;
}

interface ProductVariant {
  colorKey: string;
  displayName: string;
  thumbnail: string;
  images: string[];
  rentPerDay: number;
  deposit: number;
  sizes: VariantSize[];
}

interface ProductDetailModel {
  id: number;
  name: string;
  shortDescription: string;
  variants: ProductVariant[];
}

@Component({
  selector: 'app-costume-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <section class="pdp-container">
      <div class="breadcrumb">
        <a routerLink="/costumes" class="back-link">← Back to Costumes</a>
      </div>
      
      <div class="product-layout" *ngIf="product">
        <!-- Gallery Section -->
        <div class="gallery-section">
          <div class="main-image-container">
            <img [src]="currentImages[activeImageIndex]" [alt]="product.name" class="main-image" />
          </div>
          <div class="thumbnails-scroll">
            <button
              class="thumb-btn"
              *ngFor="let img of currentImages; let i = index"
              [class.active]="i === activeImageIndex"
              (click)="setActiveImage(i)"
              aria-label="View image">
              <img [src]="img" [alt]="product.name + ' view ' + (i+1)" />
            </button>
          </div>
        </div>

        <!-- Details Section -->
        <div class="info-section">
          <header class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="price-block">
              <span class="currency">₹</span>
              <span class="amount">{{ currentVariant?.rentPerDay }}</span>
              <span class="period">/ day</span>
            </div>
            <p class="deposit-info">Refundable Deposit: ₹{{ currentVariant?.deposit }}</p>
          </header>

          <p class="description">{{ product.shortDescription }}</p>

          <div class="options-grid">
            <!-- Colors -->
            <div class="option-group">
              <label class="option-label">Color</label>
              <div class="color-selector">
                <button
                  class="color-option"
                  *ngFor="let v of product.variants; let idx = index"
                  [class.selected]="v === currentVariant"
                  (click)="selectColor(idx)"
                  [title]="v.displayName">
                  <img [src]="v.thumbnail || v.images[0]" [alt]="v.displayName" />
                  <span class="color-name">{{ v.displayName }}</span>
                </button>
              </div>
            </div>

            <!-- Sizes -->
            <div class="option-group">
              <div class="label-row">
                <label class="option-label">Size</label>
                <span class="stock-status" [class.out-of-stock]="currentStock === 0">
                  {{ currentStock > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
              <div class="size-selector">
                <button
                  class="size-option"
                  *ngFor="let s of currentVariant?.sizes"
                  [class.selected]="s.size === selectedSize"
                  [disabled]="s.stock <= 0"
                  (click)="selectSize(s.size)">
                  {{ s.size }}
                </button>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="btn-cart" [disabled]="currentStock === 0" (click)="addToCart()">
              <span class="btn-icon">🛒</span>
              {{ currentStock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
            <button class="btn-wishlist" [class.active]="isInWishlist" (click)="toggleWishlist()">
              <span class="btn-icon">❤️</span>
              {{ isInWishlist ? 'In Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
          
          <div class="features">
            <div class="feature-item">
              <span class="icon">✨</span>
              <span>Premium Quality</span>
            </div>
            <div class="feature-item">
              <span class="icon">🧼</span>
              <span>Dry Cleaned</span>
            </div>
            <div class="feature-item">
              <span class="icon">🚚</span>
              <span>Home Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #FFFDF9;
    }

    .pdp-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .breadcrumb {
      margin-bottom: 1rem;
      flex-shrink: 0;
    }

    .back-link {
      color: #7A1F2A;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }

    .back-link:hover {
      opacity: 0.8;
    }

    .product-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }

    /* Gallery Styles */
    .gallery-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
      overflow: hidden;
    }

    .main-image-container {
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      flex: 1;
      max-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(212, 175, 55, 0.2);
      min-height: 0;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .thumbnails-scroll {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
      scrollbar-width: thin;
      flex-shrink: 0;
    }

    .thumb-btn {
      flex: 0 0 60px;
      height: 60px;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 0;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
      background: #fff;
    }

    .thumb-btn.active {
      border-color: #7A1F2A;
      transform: translateY(-2px);
    }

    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Info Section Styles */
    .info-section {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .product-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      color: #1B1B1B;
      margin: 0 0 0.4rem;
      line-height: 1.2;
    }

    .price-block {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      margin-bottom: 0.25rem;
      color: #7A1F2A;
    }

    .currency {
      font-size: 1rem;
      font-weight: 600;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .period {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
    }

    .deposit-info {
      color: #666;
      font-size: 0.75rem;
      margin: 0 0 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .description {
      font-size: 0.8rem;
      line-height: 1.4;
      color: #444;
      margin-bottom: 0.75rem;
    }

    .option-group {
      margin-bottom: 0.75rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .option-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: #1B1B1B;
    }

    .color-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .color-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem 0.4rem 0.4rem;
      border: 1px solid #e0e0e0;
      border-radius: 50px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .color-option:hover {
      border-color: #D4AF37;
    }

    .color-option.selected {
      border-color: #7A1F2A;
      background: #FFF8EE;
      box-shadow: 0 0 0 1px #7A1F2A;
    }

    .color-option img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
    }

    .color-name {
      font-weight: 500;
      color: #333;
      font-size: 0.8rem;
    }

    .size-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .size-option {
      min-width: 2.5rem;
      height: 2.5rem;
      display: grid;
      place-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.8rem;
    }

    .size-option:not(:disabled):hover {
      border-color: #D4AF37;
      transform: translateY(-2px);
    }

    .size-option.selected {
      background: #7A1F2A;
      color: #fff;
      border-color: #7A1F2A;
    }

    .size-option:disabled {
      background: #f5f5f5;
      color: #aaa;
      cursor: not-allowed;
      border-style: dashed;
    }

    .stock-status {
      font-size: 0.7rem;
      font-weight: 600;
      color: #2E7D32;
    }

    .stock-status.out-of-stock {
      color: #C62828;
    }

    .actions {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .btn-cart,
    .btn-wishlist {
      padding: 0.7rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }

    .btn-cart {
      background: #7A1F2A;
      color: #fff;
      box-shadow: 0 6px 16px rgba(122, 31, 42, 0.2);
    }

    .btn-cart:hover:not(:disabled) {
      background: #962635;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(122, 31, 42, 0.3);
    }

    .btn-cart:disabled {
      background: #ccc;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-wishlist {
      background: #fff;
      color: #7A1F2A;
      border: 2px solid #7A1F2A;
    }

    .btn-wishlist.active {
      background: #dc2626;
      color: #fff;
      border-color: #dc2626;
    }

    .btn-wishlist:hover {
      background: #FFF8EE;
      transform: translateY(-2px);
    }

    .btn-wishlist.active:hover {
      background: #b91c1c;
    }

    .btn-icon {
      font-size: 1rem;
    }

    .features {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(0,0,0,0.08);
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      text-align: center;
      font-size: 0.7rem;
      color: #666;
    }

    .feature-item .icon {
      font-size: 1rem;
    }

    @media (max-width: 968px) {
      .pdp-container {
        padding: 0.75rem;
        height: auto;
        max-height: none;
      }

      .product-layout {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        overflow: visible;
      }
      
      .gallery-section {
        height: auto;
      }

      .main-image-container {
        height: 50vh;
      }

      .info-section {
        overflow-y: visible;
      }
      
      .product-title {
        font-size: 1.5rem;
      }

      .amount {
        font-size: 1.75rem;
      }

      .actions {
        grid-template-columns: 1fr;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .feature-item {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class CostumeDetailComponent implements OnInit {
  product: ProductDetailModel | null = null;
  currentVariant: ProductVariant | null = null;
  currentImages: string[] = [];
  activeImageIndex = 0;
  selectedSize: string | null = null;
  currentStock = 0;
  isInWishlist = false;

  private catalog: ProductDetailModel[] = [
    {
      id: 1,
      name: 'Bharatanatyam Temple Silk',
      shortDescription: 'Handwoven silk with zari border, classic temple pattern.',
      variants: [
        {
          colorKey: 'red',
          displayName: 'Red',
          thumbnail: 'https://images.pexels.com/photos/16032227/pexels-photo-16032227.jpeg?auto=compress&cs=tinysrgb&w=200',
          images: [
            'https://images.pexels.com/photos/16032227/pexels-photo-16032227.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/16032233/pexels-photo-16032233.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/887353/pexels-photo-887353.jpeg?auto=compress&cs=tinysrgb&w=1200'
          ],
          rentPerDay: 799,
          deposit: 1500,
          sizes: [
            { size: '6', stock: 3 },
            { size: '7', stock: 0 },
            { size: '8', stock: 2 },
            { size: '9', stock: 5 },
            { size: '10', stock: 1 }
          ]
        },
        {
          colorKey: 'blue',
          displayName: 'Blue',
          thumbnail: 'https://images.pexels.com/photos/14443374/pexels-photo-14443374.jpeg?auto=compress&cs=tinysrgb&w=200',
          images: [
            'https://images.pexels.com/photos/14443374/pexels-photo-14443374.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/14443371/pexels-photo-14443371.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/1792214/pexels-photo-1792214.jpeg?auto=compress&cs=tinysrgb&w=1200'
          ],
          rentPerDay: 829,
          deposit: 1600,
          sizes: [
            { size: '6', stock: 1 },
            { size: '7', stock: 4 },
            { size: '8', stock: 2 },
            { size: '9', stock: 0 },
            { size: '10', stock: 3 }
          ]
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    this.product = this.catalog.find(p => p.id === id) || this.catalog[0] || null;
    if (this.product) {
      this.selectColor(0);
      this.updateWishlistState();
    }
  }

  setActiveImage(i: number) {
    this.activeImageIndex = i;
  }

  selectColor(index: number) {
    const variant = this.product?.variants[index] || null;
    this.currentVariant = variant;
    this.currentImages = variant ? variant.images : [];
    this.activeImageIndex = 0;
    const firstInStock = variant?.sizes.find(s => s.stock > 0) || null;
    this.selectedSize = firstInStock?.size || (variant?.sizes[0]?.size ?? null);
    this.updateStock();
    this.updateWishlistState();
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.updateStock();
    this.updateWishlistState();
  }

  private updateStock() {
    if (!this.currentVariant || !this.selectedSize) { this.currentStock = 0; return; }
    const entry = this.currentVariant.sizes.find(s => s.size === this.selectedSize);
    this.currentStock = entry ? entry.stock : 0;
  }

  addToCart() {
    if (!this.product || !this.currentVariant || !this.selectedSize || this.currentStock === 0) {
      return;
    }

    this.cartService.addToCart({
      productId: this.product.id,
      name: this.product.name,
      description: this.product.shortDescription,
      color: this.currentVariant.displayName,
      size: this.selectedSize,
      image: this.currentImages[0],
      rentPerDay: this.currentVariant.rentPerDay,
      deposit: this.currentVariant.deposit
    });

    // Show success toast with View Cart action
    this.toastService.success(
      'Added to Cart',
      'View Cart',
      () => {
        this.router.navigate(['/cart']);
      }
    );
  }

  updateWishlistState() {
    if (this.product) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
    }
  }

  toggleWishlist() {
    if (!this.product || !this.currentVariant || !this.selectedSize) {
      return;
    }

    const wishlistId = `${this.product.id}-${this.currentVariant.displayName}-${this.selectedSize}`;

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(wishlistId);
      this.isInWishlist = false;
    } else {
      this.wishlistService.addToWishlist({
        id: wishlistId,
        productId: this.product.id,
        name: this.product.name,
        description: this.product.shortDescription,
        image: this.currentImages[0],
        color: this.currentVariant.displayName,
        size: this.selectedSize,
        rentPerDay: this.currentVariant.rentPerDay,
        deposit: this.currentVariant.deposit
      });
      this.isInWishlist = true;
    }
  }
}
