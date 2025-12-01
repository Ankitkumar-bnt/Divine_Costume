import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from './footer.component';
import { WishlistService } from '../services/wishlist.service';

interface CostumeProduct {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  images: string[];
  category: string;
  size: string;
  color: string;
  fabric: string;
  gender: 'men' | 'women' | 'unisex';
  rentedCount: number;
  createdAt: string; // ISO date
  type?: 'Dhoti' | 'Frock' | 'Pant' | 'Sari';
  available?: boolean;
}

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
              <div class="range-container">
                <input type="range" class="range" [min]="sliderMin" [max]="sliderMax" [step]="sliderStep" [(ngModel)]="sliderMinValue" (input)="onMinRangeInput()" [style.background]="priceTrackBackground">
                <input type="range" class="range range-max" [min]="sliderMin" [max]="sliderMax" [step]="sliderStep" [(ngModel)]="sliderMaxValue" (input)="onMaxRangeInput()" [style.background]="priceTrackBackground">
                <span class="range-bubble" [style.left.%]="sliderMinPercent">₹{{ sliderMinValue }}</span>
                <span class="range-bubble range-bubble-max" [style.left.%]="sliderMaxPercent">₹{{ sliderMaxValue }}</span>
              </div>
              <div class="range-inputs">
                <select class="price-select" [(ngModel)]="priceMinSelectValue" (ngModelChange)="onPriceSelectChange('min', $event)">
                  <option [ngValue]="null">Min</option>
                  <option *ngFor="let v of priceOptions" [ngValue]="v">₹{{ v }}</option>
                  <option *ngIf="priceMinSelectValue != null && !isPresetPrice(priceMinSelectValue)" [ngValue]="priceMinSelectValue">₹{{ priceMinSelectValue }}</option>
                </select>
                <select class="price-select" [(ngModel)]="priceMaxSelectValue" (ngModelChange)="onPriceSelectChange('max', $event)">
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
              <h4 class="filter-header" (click)="togglePanel('type')">
                Type <span class="chev">{{ panelsOpen.type ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.type">
                <label *ngFor="let t of types">
                  <input type="checkbox" [ngModel]="selectedTypes.has(t)" (ngModelChange)="toggleType(t, $event)"> {{ t }}
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

    .layout { display: grid; grid-template-columns: 300px 1fr; gap: 1rem; }
    .sidebar { position: sticky; top: 110px; align-self: start; overflow: hidden; max-height: calc(100vh - 130px); background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1rem; height: max-content; box-shadow: var(--soft-shadow); backdrop-filter: blur(8px); }
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
    .range-container { position: relative; height: 60px; margin-top: .75rem; }
    .range-container .range { position: absolute; left: 0; right: 0; top: 32px; height: 6px; border-radius: 999px; outline: none; -webkit-appearance: none; background: rgba(0,0,0,.25); pointer-events: none; transition: background .2s ease; }
    .range-container .range::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: all; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #2a2a2a, #000); border: 2px solid #fff; box-shadow: 0 6px 14px rgba(0,0,0,.35); cursor: pointer; }
    .range-container .range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #2a2a2a, #000); border: 2px solid #fff; box-shadow: 0 6px 14px rgba(0,0,0,.35); cursor: pointer; }
    .range-container .range::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; }
    .range-container .range::-moz-range-track { height: 6px; border-radius: 999px; background: transparent; }
    .range-container .range-bubble { position: absolute; top: 0; transform: translateX(-50%); padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 700; color: #fff; background: rgba(0,0,0,.88); box-shadow: 0 8px 18px rgba(0,0,0,.25); pointer-events: none; }
    .range-container .range-bubble::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: inherit; clip-path: polygon(50% 100%, 0 0, 100% 0); }
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
  types: Array<'Dhoti' | 'Frock' | 'Pant' | 'Sari'> = [];
  itemsOptions: string[] = ['Ghungroo', 'Bangles', 'Necklace', 'Belt', 'Earrings'];

  // selected filters
  selectedCategories = new Set<string>();
  selectedSizes = new Set<string>();
  selectedColors = new Set<string>();
  selectedTypes = new Set<'Dhoti' | 'Frock' | 'Pant' | 'Sari'>();
  selectedItems = new Set<string>();
  priceMin: number | null = null;
  priceMax: number | null = null;
  gender: 'all' | 'men' | 'women' = 'all';
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'most_rented' | 'popularity' | 'availability' = 'newest';
  availableOnly = false;
  mobileFiltersOpen = false;
  panelsOpen: Record<'category' | 'size' | 'color' | 'gender' | 'type' | 'dates' | 'availability' | 'items', boolean> = {
    category: false,
    size: false,
    color: false,
    gender: false,
    type: false,
    dates: false,
    availability: false,
    items: false
  };

  // PRICE slider state
  sliderMin = 0;
  sliderMax = 10000;
  sliderStep = 250;
  sliderMinValue = this.sliderMin;
  sliderMaxValue = this.sliderMax;
  priceOptions: number[] = [0, 250, 500, 750, 1000, 1500, 2000, 5000, 10000];
  priceMinSelectValue: number | null = null; // null => "Min"
  priceMaxSelectValue: number = this.sliderMax;

  isPresetPrice(value: number): boolean {
    return this.priceOptions.includes(value);
  }

  // data
  allProducts: CostumeProduct[] = [
    {
      id: 1,
      name: 'Bharatanatyam Temple Silk',
      description: 'Handwoven silk with zari border, classic temple pattern.',
      pricePerDay: 799,
      images: [
        'https://images.pexels.com/photos/16032227/pexels-photo-16032227.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/16032233/pexels-photo-16032233.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bharatanatyam',
      size: 'M',
      color: 'Red',
      fabric: 'Silk Blend',
      gender: 'women',
      rentedCount: 132,
      createdAt: '2025-10-22'
    },
    {
      id: 2,
      name: 'Kathak Ghagra Set',
      description: 'Lightweight flare with mirror work dupatta.',
      pricePerDay: 699,
      images: [
        'https://images.pexels.com/photos/16747574/pexels-photo-16747574.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/16747576/pexels-photo-16747576.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Kathak',
      size: 'L',
      color: 'Pink',
      fabric: 'Viscose Rayon',
      gender: 'women',
      rentedCount: 98,
      createdAt: '2025-09-18'
    },
    {
      id: 3,
      name: 'Kuchipudi Brocade Set',
      description: 'Rich brocade with contrasting pleats.',
      pricePerDay: 749,
      images: [
        'https://images.pexels.com/photos/2909617/pexels-photo-2909617.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2861633/pexels-photo-2861633.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Kuchipudi',
      size: 'S',
      color: 'Green',
      fabric: 'Brocade',
      gender: 'women',
      rentedCount: 185,
      createdAt: '2025-07-10'
    },
    {
      id: 4,
      name: 'Mohiniyattam Kasavu',
      description: 'Ivory kasavu with gold zari and elegant flow.',
      pricePerDay: 829,
      images: [
        'https://images.pexels.com/photos/3992655/pexels-photo-3992655.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2929967/pexels-photo-2929967.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Mohiniyattam',
      size: 'M',
      color: 'Gold',
      fabric: 'Silk Blend',
      gender: 'women',
      rentedCount: 74,
      createdAt: '2025-06-05'
    },
    {
      id: 5,
      name: 'Bharatanatyam Practice Cotton',
      description: 'Breathable cotton for rehearsals and practice.',
      pricePerDay: 399,
      images: [
        'https://images.pexels.com/photos/14443374/pexels-photo-14443374.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/14443371/pexels-photo-14443371.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bharatanatyam',
      size: 'XL',
      color: 'Blue',
      fabric: 'Pure Cotton',
      gender: 'women',
      rentedCount: 221,
      createdAt: '2025-08-01'
    },
    {
      id: 6,
      name: 'Kathak Angrakha (Men)',
      description: 'Structured angrakha silhouette with churidar.',
      pricePerDay: 649,
      images: [
        'https://images.pexels.com/photos/1802353/pexels-photo-1802353.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2531553/pexels-photo-2531553.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Kathak',
      size: 'L',
      color: 'White',
      fabric: 'Cotton Blend',
      gender: 'men',
      rentedCount: 65,
      createdAt: '2025-05-15'
    },
    {
      id: 7,
      name: 'Bharatanatyam Contrast Silk',
      description: 'Dual-tone silk with bold contrast pleats.',
      pricePerDay: 899,
      images: [
        'https://images.pexels.com/photos/887353/pexels-photo-887353.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/14443373/pexels-photo-14443373.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bharatanatyam',
      size: 'M',
      color: 'Purple',
      fabric: 'Silk Blend',
      gender: 'women',
      rentedCount: 142,
      createdAt: '2025-10-10'
    },
    {
      id: 8,
      name: 'Kuchipudi Cotton Blend',
      description: 'Comfort cotton blend for stage performance.',
      pricePerDay: 459,
      images: [
        'https://images.pexels.com/photos/2082111/pexels-photo-2082111.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1840021/pexels-photo-1840021.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Kuchipudi',
      size: 'S',
      color: 'Green',
      fabric: 'Cotton Blend',
      gender: 'women',
      rentedCount: 31,
      createdAt: '2025-03-28'
    },
    {
      id: 9,
      name: 'Mohiniyattam Kasavu (Men)',
      description: 'Traditional kasavu veshti and angavastram.',
      pricePerDay: 559,
      images: [
        'https://images.pexels.com/photos/17019050/pexels-photo-17019050.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/17019046/pexels-photo-17019046.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Mohiniyattam',
      size: 'L',
      color: 'Gold',
      fabric: 'Cotton Rayon',
      gender: 'men',
      rentedCount: 27,
      createdAt: '2025-04-12'
    },
    {
      id: 10,
      name: 'Fusion Practice Wear',
      description: 'Stretchable practice wear for contemporary routines.',
      pricePerDay: 299,
      images: [
        'https://images.pexels.com/photos/1792214/pexels-photo-1792214.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1800065/pexels-photo-1800065.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Practice',
      size: 'M',
      color: 'Black',
      fabric: 'Polyester',
      gender: 'unisex',
      rentedCount: 312,
      createdAt: '2025-11-01'
    },
    {
      id: 11,
      name: 'Bharatanatyam Silk (Kids)',
      description: 'Vibrant kids silk set with soft lining.',
      pricePerDay: 499,
      images: [
        'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1267698/pexels-photo-1267698.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bharatanatyam',
      size: 'S',
      color: 'Yellow',
      fabric: 'Silk Blend',
      gender: 'women',
      rentedCount: 202,
      createdAt: '2025-09-01'
    },
    {
      id: 12,
      name: 'Kathak Silk Blend (Men)',
      description: 'Silk blend with subtle sheen and comfort.',
      pricePerDay: 729,
      images: [
        'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/184899/pexels-photo-184899.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Kathak',
      size: 'XL',
      color: 'Beige',
      fabric: 'Silk Blend',
      gender: 'men',
      rentedCount: 51,
      createdAt: '2025-01-22'
    }
  ];

  filtered: CostumeProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qp) => {
      this.pickupDate = qp.get('pickupDate');
      this.returnDate = qp.get('returnDate');
    });

    this.initFacetOptions();
    this.applyFilters();
  }

  initFacetOptions() {
    const cats = new Set<string>();
    const sizes = new Set<string>();
    const colors = new Set<string>();
    const types = new Set<'Dhoti' | 'Frock' | 'Pant' | 'Sari'>();
    for (const p of this.allProducts) {
      cats.add(p.category);
      sizes.add(p.size);
      colors.add(p.color);
      if (p.type) types.add(p.type);
    }
    this.categories = Array.from(cats).sort();
    this.sizes = Array.from(sizes).sort();
    this.colors = Array.from(colors).sort();
    this.types = Array.from(types).sort();
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
    if (this.selectedTypes.size) {
      res = res.filter(p => p.type != null && this.selectedTypes.has(p.type));
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

  togglePanel(section: 'category' | 'size' | 'color' | 'gender' | 'type' | 'dates' | 'availability' | 'items') {
    this.panelsOpen[section] = !this.panelsOpen[section];
  }

  toggleType(t: 'Dhoti' | 'Frock' | 'Pant' | 'Sari', checked: boolean) {
    checked ? this.selectedTypes.add(t) : this.selectedTypes.delete(t);
    this.applyFilters();
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
  private clampPriceValues() {
    if (this.sliderMinValue > this.sliderMaxValue) {
      this.sliderMinValue = this.sliderMaxValue;
    }
    if (this.sliderMinValue < this.sliderMin) this.sliderMinValue = this.sliderMin;
    if (this.sliderMaxValue > this.sliderMax) this.sliderMaxValue = this.sliderMax;
  }

  get priceTrackBackground(): string {
    const range = this.sliderMax - this.sliderMin;
    const minPct = ((this.sliderMinValue - this.sliderMin) / range) * 100;
    const maxPct = ((this.sliderMaxValue - this.sliderMin) / range) * 100;
    return `linear-gradient(to right, rgba(0,0,0,.15) ${minPct}%, #050505 ${minPct}%, #050505 ${maxPct}%, rgba(0,0,0,.15) ${maxPct}%)`;
  }

  get sliderMinPercent(): number {
    const range = this.sliderMax - this.sliderMin;
    return ((this.sliderMinValue - this.sliderMin) / range) * 100;
  }

  get sliderMaxPercent(): number {
    const range = this.sliderMax - this.sliderMin;
    return ((this.sliderMaxValue - this.sliderMin) / range) * 100;
  }

  onMinRangeInput() {
    if (this.sliderMinValue > this.sliderMaxValue) {
      this.sliderMinValue = this.sliderMaxValue;
    }
    this.priceMinSelectValue = this.sliderMinValue === this.sliderMin ? null : this.sliderMinValue;
    this.onPriceChange(this.sliderMinValue, this.sliderMaxValue);
  }

  onMaxRangeInput() {
    if (this.sliderMaxValue < this.sliderMinValue) {
      this.sliderMaxValue = this.sliderMinValue;
    }
    this.priceMaxSelectValue = this.sliderMaxValue;
    this.onPriceChange(this.sliderMinValue, this.sliderMaxValue);
  }

  onPriceSelectChange(which: 'min' | 'max', value: number | null) {
    if (which === 'min') {
      this.sliderMinValue = value == null ? this.sliderMin : value;
      if (this.sliderMinValue > this.sliderMaxValue) {
        this.sliderMaxValue = this.sliderMinValue;
      }
      this.priceMinSelectValue = value;
    } else {
      this.sliderMaxValue = value == null ? this.sliderMax : Number(value);
      if (this.sliderMaxValue < this.sliderMinValue) {
        this.sliderMinValue = this.sliderMaxValue;
      }
      this.priceMaxSelectValue = this.sliderMaxValue;
    }
    this.onPriceChange(this.sliderMinValue, this.sliderMaxValue);
  }

  clearPrice() {
    this.sliderMinValue = this.sliderMin;
    this.sliderMaxValue = this.sliderMax;
    this.priceMinSelectValue = null;
    this.priceMaxSelectValue = this.sliderMax;
    this.onPriceChange(this.sliderMinValue, this.sliderMaxValue);
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
