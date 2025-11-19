import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  imports: [CommonModule],
  template: `
    <section class="pdp">
      <div class="container" *ngIf="product">
        <div class="layout">
          <div class="gallery">
            <div class="thumbs">
              <button
                class="thumb"
                *ngFor="let img of currentImages; let i = index"
                [class.active]="i === activeImageIndex"
                (click)="setActiveImage(i)"
                aria-label="Thumbnail">
                <img [src]="img" [alt]="product!.name + ' ' + i" />
              </button>
            </div>
            <div class="main-image">
              <img [src]="currentImages[activeImageIndex]" [alt]="product!.name" />
            </div>
          </div>

          <div class="details">
            <h1 class="title">{{ product.name }}</h1>
            <p class="desc">{{ product.shortDescription }}</p>

            <div class="price-row">
              <div class="rent">₹{{ currentVariant?.rentPerDay }}/day</div>
              <div class="deposit">Refundable deposit: ₹{{ currentVariant?.deposit }}</div>
            </div>

            <div class="section">
              <div class="section-title">Color</div>
              <div class="color-grid">
                <button
                  class="color-item"
                  *ngFor="let v of product.variants; let idx = index"
                  [class.selected]="v === currentVariant"
                  (click)="selectColor(idx)"
                  aria-label="Select color">
                  <img [src]="v.thumbnail || v.images[0]" [alt]="v.displayName" />
                  <span class="pill">{{ v.displayName }}</span>
                </button>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Select Size</div>
              <div class="size-grid">
                <button
                  class="size-box"
                  *ngFor="let s of currentVariant?.sizes"
                  [class.selected]="s.size === selectedSize"
                  [disabled]="s.stock <= 0"
                  (click)="selectSize(s.size)">
                  {{ s.size }}
                </button>
              </div>
              <div class="stock" [class.out]="currentStock === 0">
                {{ currentStock > 0 ? currentStock + ' in stock' : 'Out of stock' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .pdp { padding: 1rem 0 2rem; background: #FFF8EE; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .layout { display: grid; grid-template-columns: 540px 1fr; gap: 2rem; }

    .gallery { display: grid; grid-template-columns: 140px 1fr; gap: 1rem; align-items: start; }
    .thumbs { display: grid; gap: .5rem; align-content: start; overflow: visible; }
    .thumb { border: 2px solid #D4AF37; background: #fff; padding: 4px; border-radius: 10px; width: 128px; height: 128px; cursor: pointer; display: grid; place-items: center; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
    .thumb.active { outline: 3px solid #7A1F2A; }
    .main-image { border: 2px solid #D4AF37; background: #FFFDF9; border-radius: 14px; padding: .75rem; display: grid; place-items: center; min-height: 520px; }
    .main-image img { width: 100%; max-height: 640px; object-fit: contain; border-radius: 8px; }

    .details { background: #FFFDF9; border: 2px solid #D4AF37; border-radius: 12px; padding: 1rem 1.25rem; }
    .title { margin: 0 0 .25rem; color: #7A1F2A; font-size: 1.5rem; }
    .desc { margin: 0 0 .75rem; color: #1B1B1B; opacity: .85; }
    .price-row { display: flex; gap: 1rem; align-items: baseline; margin-bottom: 1rem; }
    .rent { color: #7A1F2A; font-weight: 800; font-size: 1.25rem; }
    .deposit { color: #1B1B1B; opacity: .9; font-weight: 600; }

    .section { margin: 1rem 0; }
    .section-title { color: #7A1F2A; font-weight: 700; margin-bottom: .5rem; }

    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: .5rem; }
    .color-item { display: grid; gap: .25rem; border: 2px solid #D4AF37; background: #fff; border-radius: 12px; padding: .35rem; cursor: pointer; }
    .color-item.selected { outline: 3px solid #7A1F2A; }
    .color-item img { width: 100%; height: 72px; object-fit: cover; border-radius: 8px; }
    .pill { display: inline-block; text-align: center; font-size: .8rem; color: #7A1F2A; font-weight: 700; }

    .size-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, max-content)); gap: .5rem; }
    .size-box { width: 52px; height: 44px; border-radius: 10px; border: 2px solid #D4AF37; background: #fff; color: #7A1F2A; font-weight: 800; cursor: pointer; }
    .size-box.selected { background: #D4AF37; color: #7A1F2A; border-color: #7A1F2A; }
    .size-box:disabled { opacity: .4; cursor: not-allowed; }

    .stock { margin-top: .5rem; font-weight: 700; color: #0a7a57; }
    .stock.out { color: #B00020; }

    @media (max-width: 991px) {
      .layout { grid-template-columns: 1fr; }
      .gallery { grid-template-columns: 1fr; }
      .thumbs { order: 2; display: flex; flex-wrap: wrap; gap: .5rem; overflow: visible; }
      .thumb { flex: 0 0 128px; }
      .main-image { order: 1; min-height: 360px; }
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    this.product = this.catalog.find(p => p.id === id) || this.catalog[0] || null;
    if (this.product) {
      this.selectColor(0);
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
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.updateStock();
  }

  private updateStock() {
    if (!this.currentVariant || !this.selectedSize) { this.currentStock = 0; return; }
    const entry = this.currentVariant.sizes.find(s => s.size === this.selectedSize);
    this.currentStock = entry ? entry.stock : 0;
  }
}
