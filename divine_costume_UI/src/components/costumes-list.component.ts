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
        <header class="plp-header">
          <div class="actions">
            <button class="btn-filters" (click)="mobileFiltersOpen = !mobileFiltersOpen">Filters</button>
          </div>
        </header>

        <div class="layout">
          <aside class="sidebar" [class.open]="mobileFiltersOpen">
            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('category')">
                Category <span class="chev">{{ panelsOpen.category ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.category">
                <label *ngFor="let c of categories">
                  <input type="checkbox" [ngModel]="selectedCategories.has(c)" (ngModelChange)="toggleCategory(c, $event)"> {{ c }}
                </label>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('dates')">
                Availability <span class="chev">{{ panelsOpen.dates ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body date-range" *ngIf="panelsOpen.dates">
                <div class="date-input">
                  <span class="icon">📅</span>
                  <div class="date-field">
                    <span class="date-label">Pickup date</span>
                    <input type="date" [(ngModel)]="pickupDate" (change)="onDateFilterChange(pickupDate, returnDate)" placeholder="Pickup" [title]="formatDate(pickupDate)"/>
                  </div>
                </div>
                <div class="date-input">
                  <span class="icon">📅</span>
                  <div class="date-field">
                    <span class="date-label">Return date</span>
                    <input type="date" [(ngModel)]="returnDate" (change)="onDateFilterChange(pickupDate, returnDate)" placeholder="Return" [title]="formatDate(returnDate)"/>
                  </div>
                </div>
              </div>
            </div>

            <div class="filter-group price-block">
              <div class="price-header">
                <span class="price-title">Price Range</span>
                <button type="button" class="btn-price-clear" (click)="clearPrice()">CLEAR</button>
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

            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('size')">
                Size <span class="chev">{{ panelsOpen.size ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.size">
                <label *ngFor="let s of sizes">
                  <input type="checkbox" [ngModel]="selectedSizes.has(s)" (ngModelChange)="toggleSize(s, $event)"> {{ s }}
                </label>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('color')">
                Colors <span class="chev">{{ panelsOpen.color ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body chips" *ngIf="panelsOpen.color">
                <button type="button" class="chip" *ngFor="let col of colors" [class.active]="selectedColors.has(col)" (click)="toggleColor(col, !selectedColors.has(col))">{{ col }}</button>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('gender')">
                Ideal For <span class="chev">{{ panelsOpen.gender ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.gender">
                <label><input type="radio" name="gender" value="all" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> All</label>
                <label><input type="radio" name="gender" value="women" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Women</label>
                <label><input type="radio" name="gender" value="men" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Men</label>
              </div>
            </div>

            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('items')">
                Items <span class="chev">{{ panelsOpen.items ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body chips" *ngIf="panelsOpen.items">
                <button type="button" class="chip" *ngFor="let it of itemsOptions" [class.active]="selectedItems.has(it)" (click)="toggleItem(it)">{{ it }}</button>
              </div>
            </div>

            <button class="btn-clear" (click)="clearFilters()">Clear all</button>
          </aside>

          <main class="results">
            <div class="results-bar">
              <div class="results-left">{{ filtered.length }} results</div>
              <div class="results-right">
                <div class="search-wrap">
                  <span class="icon">🔍</span>
                  <input class="search-input" type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Search costumes..." />
                </div>
                <select class="sort" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>
            <div class="grid" *ngIf="filtered.length; else empty">
              <div class="card" *ngFor="let p of filtered; trackBy: trackById" [routerLink]="['/costumes', p.id]" (mousemove)="onCardMouseMove($event)">
                <div class="thumb">
                  <button type="button" class="wishlist-btn" [class.active]="isWished(p.id)" (click)="toggleWishlist(p.id); $event.stopPropagation()" aria-label="Add to wishlist" [attr.aria-pressed]="isWished(p.id)">
                    <svg *ngIf="!isWished(p.id)" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <svg *ngIf="isWished(p.id)" width="26" height="26" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" stroke-width="0"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                  <img class="img-primary" [src]="p.images[0]" [alt]="p.name">
                  <img class="img-secondary" [src]="p.images[1] || p.images[0]" [alt]="p.name">
                </div>
                <div class="content">
                  <h3 class="name">{{ p.name }}</h3>
                  <p class="desc">{{ p.description }}</p>
                  <div class="price">₹{{ p.pricePerDay }}/day</div>
                </div>
              </div>
            </div>
            <ng-template #empty>
              <div class="empty">No products match your filters.</div>
            </ng-template>
          </main>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
  `,
  styles: [`
    :host { display: block; }
    .plp { padding: 1rem 0 2rem; background: linear-gradient(180deg, var(--pastel-beige), #fff); }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }

    .plp-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .title-group { display: flex; align-items: baseline; gap: 1rem; }
    .title { color: #7A1F2A; margin: 0; font-size: 1.75rem; }
    .dates { display: flex; gap: .75rem; color: #7A1F2A; font-weight: 600; }
    .actions { display: flex; align-items: center; gap: .75rem; }
    .back-link { color: #7A1F2A; text-decoration: none; font-weight: 600; }
    .btn-filters { display: none; background: #D4AF37; color: #7A1F2A; border: 2px solid #D4AF37; padding: .5rem .9rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .sort { border: 2px solid #D4AF37; background: #FFFDF9; border-radius: 8px; padding: .5rem .6rem; color: #7A1F2A; font-weight: 600; }

    .layout { display: grid; grid-template-columns: 350px 1fr; gap: 1rem; }
    .sidebar { position: sticky; top: 110px; align-self: start; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; max-height: calc(100vh - 130px); background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1rem; height: max-content; box-shadow: var(--soft-shadow); backdrop-filter: blur(8px); }
    .sidebar::-webkit-scrollbar { display: none; }
    .filter-group { display: grid; gap: .5rem; margin-bottom: 1rem; }
    .filter-group h4 { margin: 0 0 .25rem; color: #0f172a; font-size: .95rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-weight: 700; }
    .filter-group label { display: flex; align-items: center; gap: .5rem; font-size: .95rem; color: #1B1B1B; padding: .15rem .25rem; border-radius: 8px; }
    .filter-group label:hover { background: rgba(15,23,42,0.04); }
    .chips { display: flex; flex-wrap: wrap; gap: .5rem; }
    .chip { border: 1px solid var(--glass-border); background: var(--glass-bg); color: #0f172a; padding: .35rem .6rem; border-radius: 999px; cursor: pointer; box-shadow: var(--soft-shadow); }
    .chip.active { background: linear-gradient(90deg, var(--pastel-lavender), var(--pastel-mint)); }
    .price-header { display: flex; align-items: center; justify-content: space-between; }
    .price-title { color: #0f172a; font-weight: 800; }
    .btn-price-clear { background: transparent; border: none; color: #0f172a; font-weight: 700; cursor: pointer; padding: 0; }
    .range-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-top: .5rem; }
    .price-select { border: 1px solid var(--glass-border); background: #fff; border-radius: 12px; padding: .4rem .5rem; color: #0f172a; font-weight: 600; }
    .btn-clear { width: 100%; border: 1px solid var(--glass-border); background: linear-gradient(90deg, var(--pastel-peach), var(--pastel-beige)); color: #0f172a; border-radius: 999px; padding: .6rem .9rem; cursor: pointer; font-weight: 700; box-shadow: var(--soft-shadow); }
    .btn-clear:hover { transform: translateY(-1px); }
    .more-link { background: transparent; border: none; color: #7A1F2A; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; justify-self: start; }

    .results { min-width: 0; }
    .results-bar { display: grid; grid-template-columns: 1fr auto; gap: .75rem; align-items: center; margin-bottom: .75rem; }
    .results-left { color: #5c1a1a; font-weight: 700; }
    .results-right { display: flex; align-items: center; gap: .5rem; }
    .results-right .sort { border: 1px solid var(--glass-border); background: var(--glass-bg); border-radius: 12px; padding: .5rem .8rem; color: #0f172a; font-weight: 600; box-shadow: var(--soft-shadow); }
    .search-wrap { display: inline-flex; align-items: center; gap: .4rem; background: var(--glass-bg); border: 1px solid var(--glass-border); padding: .4rem .6rem; border-radius: 12px; box-shadow: var(--soft-shadow); }
    .search-input { border: none; outline: none; background: transparent; color: #0f172a; min-width: 220px; }
    .date-range { display: flex; flex-direction: column; gap: .75rem; }
    .date-input { position: relative; display: flex; align-items: flex-start; gap: .4rem; background: #fff; border: 1px solid var(--glass-border); border-radius: 12px; padding: .4rem .7rem; box-shadow: var(--soft-shadow); }
    .date-input .icon { font-size: .9rem; }
    .date-field { display: flex; flex-direction: column; gap: .15rem; width: 100%; }
    .date-label { font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; color: #475569; font-weight: 600; }
    .date-input input[type="date"] { border: none; outline: none; background: transparent; color: #1B1B1B; padding: .15rem 0; font-weight: 600; }
    .date-input .date-display { position: absolute; bottom: -1.1rem; left: .75rem; font-size: .75rem; color: #7A1F2A; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }

    .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .25s ease, transform .25s ease; box-shadow: var(--soft-shadow); position: relative; }
    .card::before { content: ''; position: absolute; inset: -20px; background: radial-gradient(120px 60px at var(--x, 50%) var(--y, 0%), rgba(234,230,255,.35), rgba(230,255,245,.2), transparent); opacity: 0; transition: opacity .3s ease; pointer-events: none; }
    .card:hover { transform: translateY(-4px); }
    .card:hover::before { opacity: 1; }
    .thumb { position: relative; height: 240px; overflow: hidden; background: linear-gradient(180deg, var(--pastel-lavender), var(--pastel-mint)); }
    .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity .3s ease, transform .3s ease; z-index: 1; }
    .img-secondary { opacity: 0; transform: scale(1.05); }
    .card:hover .img-primary { opacity: 0; transform: scale(1.05); }
    .card:hover .img-secondary { opacity: 1; transform: scale(1.02); animation: panX 8s ease-in-out infinite; }
    @keyframes panX { 0% { transform: scale(1.05) translateX(0); } 50% { transform: scale(1.05) translateX(-8%); } 100% { transform: scale(1.05) translateX(0); } }
    .content { padding: .75rem .9rem; display: grid; grid-template-rows: auto 1fr auto; gap: .3rem; min-height: 132px; }
    .name { margin: 0; color: #5c1a1a; font-size: 1.05rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .desc { margin: 0; color: #1B1B1B; opacity: .8; font-size: .9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .meta { display: none; }
    .price { color: #5c1a1a; font-weight: 800; margin-top: .25rem; }
    .wishlist-btn { position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: #1B1B1B; display: inline-flex; align-items: center; justify-content: center; box-shadow: var(--soft-shadow); cursor: pointer; transition: transform .2s ease; z-index: 3; }
    .wishlist-btn:hover { transform: translateY(-2px); }
    .wishlist-btn.active { color: #dc2626; background: var(--glass-bg); border-color: var(--glass-border); }
    .tags { color: #1B1B1B; opacity: .7; font-size: .85rem; }
    .empty { text-align: center; color: #7A1F2A; padding: 2rem; border: 2px dashed #D4AF37; border-radius: 12px; background: #FFFDF9; }

    @media (max-width: 1199px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 991px) {
      .layout { grid-template-columns: 1fr; }
      .btn-filters { display: inline-block; background: linear-gradient(90deg, var(--pastel-peach), var(--pastel-beige)); color: #0f172a; border: 1px solid var(--glass-border); border-radius: 12px; }
      .sidebar { display: none; position: static; max-height: none; overflow: visible; }
      .sidebar.open { display: block; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .results-bar { grid-template-columns: 1fr; }
      .results-right { justify-self: start; }
    }
    @media (max-width: 575px) { .grid { grid-template-columns: 1fr; } .thumb { height: 200px; } .content { min-height: 120px; } }
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

  onCardMouseMove(ev: MouseEvent) {
    const el = ev.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }

  // PRICE handlers












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
