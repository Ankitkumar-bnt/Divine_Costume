import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from './footer.component';
import { WishlistService } from '../services/wishlist.service';
import { CostumeService, CostumeProduct } from '../services/costume.service';

@Component({
  selector: 'app-costumes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  template: `
    <section class="plp">
      <div class="container">
        <!-- Mobile Filter Toggle -->
        <header class="plp-header">
          <button class="btn-filters" (click)="mobileFiltersOpen = !mobileFiltersOpen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
            Filters
          </button>
        </header>

        <div class="layout">
          <!-- Sidebar Filters -->
          <aside class="sidebar" [class.open]="mobileFiltersOpen">
            <div class="sidebar-content">
              <div class="sidebar-header">
                <h3 class="sidebar-title">Filters</h3>
                <button class="btn-close" (click)="mobileFiltersOpen = false">✕</button>
              </div>

              <div class="filters-scroll">
                <!-- Category -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('category')">
                    <span>Category</span>
                    <span class="chev">{{ panelsOpen.category ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body" *ngIf="panelsOpen.category">
                    <label *ngFor="let c of categories">
                      <input type="checkbox" [ngModel]="selectedCategories.has(c)" (ngModelChange)="toggleCategory(c, $event)">
                      <span>{{ c }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Availability -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('dates')">
                    <span>Availability</span>
                    <span class="chev">{{ panelsOpen.dates ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body date-range" *ngIf="panelsOpen.dates">
                    <div class="date-input">
                      <span class="date-label">Pickup</span>
                      <input type="date" [(ngModel)]="pickupDate" (change)="onDateFilterChange(pickupDate, returnDate)"/>
                    </div>
                    <div class="date-input">
                      <span class="date-label">Return</span>
                      <input type="date" [(ngModel)]="returnDate" (change)="onDateFilterChange(pickupDate, returnDate)"/>
                    </div>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Price Range -->
                <div class="filter-group">
                  <div class="price-header">
                    <span class="price-title">Price Range</span>
                    <button type="button" class="btn-price-clear" (click)="clearPrice()">Clear</button>
                  </div>
                  <div class="range-inputs">
                    <select class="price-select" [(ngModel)]="priceMinSelectValue" (ngModelChange)="onPriceSelectChange('min', $event)">
                      <option [ngValue]="null">Min</option>
                      <option *ngFor="let v of priceOptions" [ngValue]="v">₹{{ v }}</option>
                      <option *ngIf="priceMinSelectValue != null && !isPresetPrice(priceMinSelectValue)" [ngValue]="priceMinSelectValue">₹{{ priceMinSelectValue }}</option>
                    </select>
                    <select class="price-select" [(ngModel)]="priceMaxSelectValue" (ngModelChange)="onPriceSelectChange('max', $event)">
                      <option [ngValue]="null">Max</option>
                      <option *ngFor="let v of priceOptions" [ngValue]="v">₹{{ v }}</option>
                      <option *ngIf="priceMaxSelectValue != null && !isPresetPrice(priceMaxSelectValue)" [ngValue]="priceMaxSelectValue">₹{{ priceMaxSelectValue }}</option>
                    </select>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Size -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('size')">
                    <span>Size</span>
                    <span class="chev">{{ panelsOpen.size ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body" *ngIf="panelsOpen.size">
                    <label *ngFor="let s of sizes">
                      <input type="checkbox" [ngModel]="selectedSizes.has(s)" (ngModelChange)="toggleSize(s, $event)">
                      <span>{{ s }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Colors -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('color')">
                    <span>Colors</span>
                    <span class="chev">{{ panelsOpen.color ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body chips" *ngIf="panelsOpen.color">
                    <button type="button" class="chip" *ngFor="let col of colors" [class.active]="selectedColors.has(col)" (click)="toggleColor(col, !selectedColors.has(col))">{{ col }}</button>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Ideal For -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('gender')">
                    <span>Ideal For</span>
                    <span class="chev">{{ panelsOpen.gender ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body" *ngIf="panelsOpen.gender">
                    <label>
                      <input type="radio" name="gender" value="all" [(ngModel)]="gender" (ngModelChange)="applyFilters()">
                      <span>All</span>
                    </label>
                    <label>
                      <input type="radio" name="gender" value="women" [(ngModel)]="gender" (ngModelChange)="applyFilters()">
                      <span>Women</span>
                    </label>
                    <label>
                      <input type="radio" name="gender" value="men" [(ngModel)]="gender" (ngModelChange)="applyFilters()">
                      <span>Men</span>
                    </label>
                  </div>
                </div>

                <div class="filter-divider"></div>

                <!-- Items -->
                <div class="filter-group">
                  <h4 class="filter-header" (click)="togglePanel('items')">
                    <span>Accessories</span>
                    <span class="chev">{{ panelsOpen.items ? '−' : '+' }}</span>
                  </h4>
                  <div class="filter-body chips" *ngIf="panelsOpen.items">
                    <button type="button" class="chip" *ngFor="let it of itemsOptions" [class.active]="selectedItems.has(it)" (click)="toggleItem(it)">{{ it }}</button>
                  </div>
                </div>
              </div>

              <!-- Sticky Apply Button -->
              <div class="sidebar-footer">
                <button class="btn-clear" (click)="clearFilters()">Clear All Filters</button>
              </div>
            </div>
          </aside>

          <!-- Main Results -->
          <main class="results">
            <div class="results-bar">
              <div class="results-left">
                <span class="results-count">{{ filtered.length }}</span>
                <span class="results-label">Results</span>
              </div>
              <div class="results-right">
                <div class="search-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input class="search-input" type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search costumes..." />
                </div>
                <select class="sort" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>

            <div class="grid" *ngIf="filtered.length; else empty">
              <div class="card" *ngFor="let p of filtered; trackBy: trackById" [routerLink]="['/costumes', p.id]">
                <div class="card-image">
                  <button type="button" class="wishlist-btn" [class.active]="isWished(p.id)" (click)="toggleWishlist(p.id); $event.stopPropagation()" aria-label="Add to wishlist">
                    <svg *ngIf="!isWished(p.id)" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <svg *ngIf="isWished(p.id)" width="22" height="22" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <img [src]="p.images[0]" [alt]="p.name" class="product-img">
                </div>
                <div class="card-content">
                  <h3 class="product-name">{{ p.name }}</h3>
                  <p class="product-desc">{{ p.description }}</p>
                  <div class="product-price">
                    <span class="price-amount">₹{{ p.pricePerDay }}</span>
                    <span class="price-period">/day</span>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #empty>
              <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No costumes found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            </ng-template>
          </main>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
  `,
  styles: [`
    /* ========== GLOBAL & CONTAINER ========== */
    :host {
      display: block;
      background: linear-gradient(135deg, #FFF8F0 0%, #FFFBF5 50%, #FFF5EB 100%);
      min-height: 100vh;
    }

    .plp {
      padding: 2rem 0 3rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* ========== HEADER ========== */
    .plp-header {
      margin-bottom: 1.5rem;
      display: none;
    }

    .btn-filters {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      border: 1px solid rgba(122, 31, 42, 0.15);
      border-radius: 12px;
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: #7A1F2A;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .btn-filters:hover {
      background: #7A1F2A;
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(122, 31, 42, 0.15);
    }

    .btn-filters svg {
      stroke: currentColor;
    }

    /* ========== LAYOUT ========== */
    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* ========== SIDEBAR ========== */
    .sidebar {
      position: sticky;
      top: 1.5rem;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      height: calc(100vh - 3rem);
      display: flex;
      flex-direction: column;
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-header {
      padding: 1.5rem 1.25rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .sidebar-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #7A1F2A;
      font-family: 'Playfair Display', serif;
    }

    .btn-close {
      display: none;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(122, 31, 42, 0.08);
      border-radius: 8px;
      color: #7A1F2A;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #7A1F2A;
      color: #fff;
    }

  .filters-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  position: relative;
  mask-image: linear-gradient(to bottom,
    transparent 0,
    black 20px,
    black calc(100% - 20px),
    transparent 100%);
}


    .filters-scroll::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .filter-group {
      margin-bottom: 0.5rem;
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: 0.75rem 0;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #2C2C2C;
      cursor: pointer;
      transition: color 0.2s;
    }

    .filter-header:hover {
      color: #7A1F2A;
    }

    .filter-header .chev {
      font-size: 1.25rem;
      font-weight: 400;
      color: #7A1F2A;
    }

    .filter-body {
      padding: 0.5rem 0 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-body label {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.375rem 0.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #444;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-body label:hover {
      background: rgba(122, 31, 42, 0.04);
    }

    .filter-body input[type="checkbox"],
    .filter-body input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: #7A1F2A;
      cursor: pointer;
    }

    .filter-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.08), transparent);
      margin: 0.75rem 0;
    }

    /* Price Filter */
    .price-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
    }

    .price-title {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #2C2C2C;
    }

    .btn-price-clear {
      background: none;
      border: none;
      color: #7A1F2A;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .btn-price-clear:hover {
      background: rgba(122, 31, 42, 0.08);
    }

    .range-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .price-select {
      padding: 0.5rem 0.625rem;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 10px;
      background: #FAFAFA;
      font-size: 0.875rem;
      font-weight: 500;
      color: #2C2C2C;
      cursor: pointer;
      transition: all 0.2s;
    }

    .price-select:hover,
    .price-select:focus {
      border-color: #7A1F2A;
      background: #fff;
      outline: none;
    }

    /* Date Filter */
    .date-range {
      gap: 0.75rem;
    }

    .date-input {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .date-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
    }

    .date-input input[type="date"] {
      padding: 0.5rem 0.625rem;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 10px;
      background: #FAFAFA;
      font-size: 0.875rem;
      font-weight: 500;
      color: #2C2C2C;
      cursor: pointer;
      transition: all 0.2s;
    }

    .date-input input[type="date"]:hover,
    .date-input input[type="date"]:focus {
      border-color: #7A1F2A;
      background: #fff;
      outline: none;
    }

    /* Chips */
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip {
      padding: 0.5rem 0.875rem;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 20px;
      background: #FAFAFA;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #444;
      cursor: pointer;
      transition: all 0.2s;
    }

    .chip:hover {
      border-color: #7A1F2A;
      background: rgba(122, 31, 42, 0.04);
      color: #7A1F2A;
    }

    .chip.active {
      background: #7A1F2A;
      border-color: #7A1F2A;
      color: #fff;
      font-weight: 600;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      background: linear-gradient(to top, rgba(255, 248, 240, 0.5), transparent);
      flex-shrink: 0;
    }

    .btn-clear {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #7A1F2A;
      border-radius: 12px;
      background: #fff;
      color: #7A1F2A;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-clear:hover {
      background: #7A1F2A;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(122, 31, 42, 0.2);
    }

    /* ========== RESULTS ========== */
    .results {
      min-width: 0;
    }

    .results-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding: 1rem 1.5rem;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    .results-left {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .results-count {
      font-size: 1.75rem;
      font-weight: 700;
      color: #7A1F2A;
    }

    .results-label {
      font-size: 0.95rem;
      font-weight: 500;
      color: #666;
    }

    .results-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.625rem 1rem;
      background: #FAFAFA;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .search-wrap:focus-within {
      background: #fff;
      border-color: #7A1F2A;
      box-shadow: 0 0 0 3px rgba(122, 31, 42, 0.08);
    }

    .search-wrap svg {
      color: #999;
    }

    .search-input {
      border: none;
      background: none;
      outline: none;
      font-size: 0.9rem;
      color: #2C2C2C;
      min-width: 200px;
    }

    .search-input::placeholder {
      color: #999;
    }

    .sort {
      padding: 0.625rem 1rem;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      background: #FAFAFA;
      font-size: 0.9rem;
      font-weight: 500;
      color: #2C2C2C;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sort:hover,
    .sort:focus {
      background: #fff;
      border-color: #7A1F2A;
      outline: none;
    }

    /* ========== PRODUCT GRID ========== */
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(122, 31, 42, 0.15);
    }

    .card-image {
      position: relative;
      background: #ffffff;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0;
      transition: transform 0.4s ease;
    }

    .card:hover .product-img {
      transform: scale(1.05);
    }

    .wishlist-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 44px;
      height: 44px;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .wishlist-btn:hover {
      transform: scale(1.1);
      background: #fff;
    }

    .wishlist-btn svg {
      color: #7A1F2A;
    }

    .wishlist-btn.active {
      background: rgba(220, 38, 38, 0.1);
    }

    .card-content {
      padding: 1.25rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .product-name {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #2C2C2C;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-desc {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-price {
      margin-top: 0.5rem;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #7A1F2A;
    }

    .price-period {
      font-size: 0.875rem;
      font-weight: 500;
      color: #999;
    }

    /* ========== EMPTY STATE ========== */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }

    .empty-state svg {
      color: #D4AF37;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2C2C2C;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
      color: #999;
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 991px) {
      .plp-header {
        display: block;
      }

      .layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        max-width: 360px;
        height: 100vh;
        max-height: 100vh;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        border-radius: 0;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .btn-close {
        display: flex;
      }

      .results-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .results-left {
        justify-content: center;
      }

      .results-right {
        flex-direction: column;
        gap: 0.75rem;
      }

      .search-wrap {
        width: 100%;
      }

      .search-input {
        width: 100%;
        min-width: 0;
      }

      .sort {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }

      .card-image {
        height: 280px;
      }
    }
  `]
})
export class CostumesListComponent implements OnInit {
  searchQuery: string = '';
  pickupDate: string | null = null;
  returnDate: string | null = null;

  // facet options
  categories: string[] = [];
  sizes: string[] = [];
  colors: string[] = [];
  itemsOptions: string[] = ['Ghungroo', 'Bangles', 'Necklace', 'Belt', 'Earrings'];

  // selected filters
  selectedCategories = new Set<string>();
  selectedSizes = new Set<string>();
  selectedColors = new Set<string>();
  selectedItems = new Set<string>();
  priceMin: number | null = null;
  priceMax: number | null = null;
  gender: 'all' | 'men' | 'women' = 'all';
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'most_rented' | 'popularity' | 'availability' = 'newest';
  availableOnly = false;
  mobileFiltersOpen = false;
  panelsOpen: Record<'category' | 'size' | 'color' | 'gender' | 'dates' | 'availability' | 'items', boolean> = {
    category: false,
    size: false,
    color: false,
    gender: false,
    dates: false,
    availability: false,
    items: false
  };

  // PRICE slider state
  sliderMin = 0;
  sliderMax = 10000;
  priceOptions: number[] = [0, 250, 500, 750, 1000, 1500, 2000, 5000, 10000];
  priceMinSelectValue: number | null = null; // null => "Min"
  priceMaxSelectValue: number | null = null; // null => "Max"

  isPresetPrice(value: number): boolean {
    return this.priceOptions.includes(value);
  }

  // data
  allProducts: CostumeProduct[] = [];

  filtered: CostumeProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private costumeService: CostumeService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qp) => {
      this.pickupDate = qp.get('pickupDate');
      this.returnDate = qp.get('returnDate');
    });

    // Fetch costumes from backend
    this.costumeService.getAllCostumes().subscribe({
      next: (costumes) => {
        this.allProducts = costumes;
        this.initFacetOptions();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching costumes:', error);
        // Initialize with empty data on error
        this.allProducts = [];
        this.initFacetOptions();
        this.applyFilters();
      }
    });
  }

  initFacetOptions() {
    const cats = new Set<string>();
    const sizes = new Set<string>();
    const colors = new Set<string>();
    for (const p of this.allProducts) {
      if (p.category) cats.add(p.category);
      if (p.size) sizes.add(p.size);
      if (p.color) colors.add(p.color);
    }
    this.categories = Array.from(cats).sort();
    this.sizes = Array.from(sizes).sort();
    this.colors = Array.from(colors).sort();
  }

  toggleCategory(c: string, checked: boolean) {
    checked ? this.selectedCategories.add(c) : this.selectedCategories.delete(c);
    this.applyFilters();
  }
  toggleSize(s: string, checked: boolean) {
    checked ? this.selectedSizes.add(s) : this.selectedSizes.delete(s);
    this.applyFilters();
  }
  toggleColor(col: string, checked: boolean) {
    checked ? this.selectedColors.add(col) : this.selectedColors.delete(col);
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategories.clear();
    this.selectedSizes.clear();
    this.selectedColors.clear();
    this.priceMin = null;
    this.priceMax = null;
    this.gender = 'all';
    this.sortBy = 'newest';
    this.applyFilters();
  }

  applyFilters() {
    const min = this.priceMin != null ? Math.max(0, this.priceMin) : null;
    const max = this.priceMax != null ? Math.max(0, this.priceMax) : null;
    this.priceMin = min;
    this.priceMax = max;

    let res = this.allProducts.slice();

    // search
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      res = res.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategories.size) {
      res = res.filter(p => this.selectedCategories.has(p.category));
    }
    if (this.selectedSizes.size) {
      res = res.filter(p => this.selectedSizes.has(p.size));
    }
    if (this.selectedColors.size) {
      res = res.filter(p => this.selectedColors.has(p.color));
    }
    if (this.gender !== 'all') {
      res = res.filter(p => p.gender === this.gender || p.gender === 'unisex');
    }
    if (this.availableOnly) {
      res = res.filter(p => p.available !== false);
    }
    if (min != null) {
      res = res.filter(p => p.pricePerDay >= min);
    }
    if (max != null) {
      res = res.filter(p => p.pricePerDay <= max);
    }
    if (this.selectedItems.size) {
      const items = new Set(Array.from(this.selectedItems).map(s => s.toLowerCase()));
      res = res.filter(p => {
        const desc = p.description.toLowerCase();
        for (const i of items) { if (desc.includes(i)) return true; }
        return false;
      });
    }

    switch (this.sortBy) {
      case 'price_asc':
        res.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price_desc':
        res.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'popularity':
      case 'most_rented':
        res.sort((a, b) => b.rentedCount - a.rentedCount); break;
      case 'availability':
        res.sort((a, b) => Number((b.available !== false)) - Number((a.available !== false))); break;
      case 'newest':
      default:
        res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    this.filtered = res;
  }

  trackById(_: number, item: CostumeProduct) { return item.id; }

  togglePanel(section: 'category' | 'size' | 'color' | 'gender' | 'dates' | 'availability' | 'items') {
    this.panelsOpen[section] = !this.panelsOpen[section];
  }

  toggleItem(it: string) {
    if (this.selectedItems.has(it)) this.selectedItems.delete(it); else this.selectedItems.add(it);
    this.applyFilters();
  }

  toggleWishlist(id: number) {
    const product = this.allProducts.find(p => p.id === id);
    if (!product) return;

    if (this.wishlistService.isInWishlist(id)) {
      // Find the actual wishlist item to get its ID
      const wishlistItems = this.wishlistService.getWishlistItems();
      const existingItem = wishlistItems.find(item => item.productId === id);
      if (existingItem) {
        this.wishlistService.removeFromWishlist(existingItem.id);
      }
    } else {
      const wishlistId = `${id}-${product.color}-${product.size}`;
      this.wishlistService.addToWishlist({
        id: wishlistId,
        productId: id,
        name: product.name,
        description: product.description,
        image: product.images[0],
        color: product.color,
        size: product.size,
        rentPerDay: product.pricePerDay,
        deposit: 1500 // Default deposit, adjust as needed
      });
    }
  }

  isWished(id: number) { return this.wishlistService.isInWishlist(id); }

  onPriceSelectChange(which: 'min' | 'max', value: number | null) {
    let currentMin = this.priceMinSelectValue === null ? this.sliderMin : this.priceMinSelectValue;
    let currentMax = this.priceMaxSelectValue === null ? this.sliderMax : this.priceMaxSelectValue;

    if (which === 'min') {
      currentMin = value === null ? this.sliderMin : value;
      this.priceMinSelectValue = value;
      if (currentMin > currentMax) {
        currentMax = currentMin;
        this.priceMaxSelectValue = currentMax;
      }
    } else {
      currentMax = value === null ? this.sliderMax : value;
      this.priceMaxSelectValue = currentMax;
      if (currentMax < currentMin) {
        currentMin = currentMax;
        this.priceMinSelectValue = currentMin === this.sliderMin ? null : currentMin;
      }
    }
    this.onPriceChange(currentMin, currentMax);
  }

  clearPrice() {
    this.priceMinSelectValue = null;
    this.priceMaxSelectValue = this.sliderMax;
    this.onPriceChange(this.sliderMin, this.sliderMax);
  }

  onPriceChange(min: number, max: number) {
    // Hook point for external filtering if needed
    const full = min === this.sliderMin && max === this.sliderMax;
    this.priceMin = full ? null : min;
    this.priceMax = full ? null : max;
    this.applyFilters();
  }

  onDateFilterChange(pickup: string | null, ret: string | null) {
    this.pickupDate = pickup;
    this.returnDate = ret;
    this.applyFilters();
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}-${m}-${y}`;
  }
}
