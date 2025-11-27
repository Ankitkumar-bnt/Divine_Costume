import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface OrnamentProduct {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  images: string[];
  category: string;
  size: string;
  color: string;
  material: string;
  gender: 'men' | 'women' | 'unisex';
  rentedCount: number;
  createdAt: string; // ISO date
}

@Component({
  selector: 'app-ornaments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="plp">
      <div class="container">
        <header class="plp-header">
          <div class="title-group">
            <h1 class="title">Ornaments</h1>
            <div class="dates" *ngIf="pickupDate || returnDate">
              <span *ngIf="pickupDate"><strong>Pickup:</strong> {{ pickupDate }}</span>
              <span *ngIf="returnDate"><strong>Return:</strong> {{ returnDate }}</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn-filters" (click)="mobileFiltersOpen = !mobileFiltersOpen">Filters</button>
            <select class="sort" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="most_rented">Most rented</option>
            </select>
            <a routerLink="/" class="back-link">← Home</a>
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
              <h4 class="filter-header" (click)="togglePanel('price')">
                Price range <span class="chev">{{ panelsOpen.price ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.price">
                <div class="price-row">
                  <input type="number" min="0" step="1" inputmode="numeric" placeholder="Min" [(ngModel)]="priceMin" (ngModelChange)="applyFilters()">
                  <span>—</span>
                  <input type="number" min="0" step="1" inputmode="numeric" placeholder="Max" [(ngModel)]="priceMax" (ngModelChange)="applyFilters()">
                </div>
              </div>
            </div>
            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('material')">
                Material <span class="chev">{{ panelsOpen.material ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.material">
                <label *ngFor="let m of materialOptions">
                  <input type="checkbox" [ngModel]="selectedMaterials.has(m)" (ngModelChange)="toggleMaterial(m, $event)"> {{ m }}
                </label>
                <ng-container *ngIf="showMoreMaterial">
                  <label *ngFor="let m of materialExtraOptions">
                    <input type="checkbox" [ngModel]="selectedMaterials.has(m)" (ngModelChange)="toggleMaterial(m, $event)"> {{ m }}
                  </label>
                </ng-container>
                <button type="button" class="more-link" *ngIf="!showMoreMaterial" (click)="showMoreMaterial = true">{{ materialExtraOptions.length }} MORE</button>
                <button type="button" class="more-link" *ngIf="showMoreMaterial" (click)="showMoreMaterial = false">Show less</button>
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
                Color <span class="chev">{{ panelsOpen.color ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.color">
                <label *ngFor="let col of colors">
                  <input type="checkbox" [ngModel]="selectedColors.has(col)" (ngModelChange)="toggleColor(col, $event)"> {{ col }}
                </label>
              </div>
            </div>
            <div class="filter-group">
              <h4 class="filter-header" (click)="togglePanel('gender')">
                For <span class="chev">{{ panelsOpen.gender ? '▾' : '▸' }}</span>
              </h4>
              <div class="filter-body" *ngIf="panelsOpen.gender">
                <label><input type="radio" name="gender" value="all" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> All</label>
                <label><input type="radio" name="gender" value="women" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Women</label>
                <label><input type="radio" name="gender" value="men" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Men</label>
              </div>
            </div>
            <button class="btn-clear" (click)="clearFilters()">Clear all</button>
          </aside>

          <main class="results">
            <div class="results-bar">
              <span>{{ filtered.length }} results</span>
            </div>
            <div class="grid" *ngIf="filtered.length; else empty">
              <div class="card" *ngFor="let p of filtered; trackBy: trackById">
                <div class="thumb">
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
  `,
  styles: [`
    :host { display: block; }
    .plp { padding: 1rem 0 2rem; background: #FFF8EE; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }

    .plp-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .title-group { display: flex; align-items: baseline; gap: 1rem; }
    .title { color: #7A1F2A; margin: 0; font-size: 1.75rem; }
    .dates { display: flex; gap: .75rem; color: #7A1F2A; font-weight: 600; }
    .actions { display: flex; align-items: center; gap: .75rem; }
    .back-link { color: #7A1F2A; text-decoration: none; font-weight: 600; }
    .btn-filters { display: none; background: #D4AF37; color: #7A1F2A; border: 2px solid #D4AF37; padding: .5rem .9rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .sort { border: 2px solid #D4AF37; background: #FFFDF9; border-radius: 8px; padding: .5rem .6rem; color: #7A1F2A; font-weight: 600; }

    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 1rem; }
    .sidebar { background: #FFFDF9; border: 2px solid #D4AF37; border-radius: 12px; padding: 1rem; height: max-content; }
    .filter-group { display: grid; gap: .5rem; margin-bottom: 1rem; }
    .filter-group h4 { margin: 0 0 .25rem; color: #7A1F2A; font-size: 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
    .filter-group label { display: flex; align-items: center; gap: .5rem; font-size: .95rem; color: #1B1B1B; }
    .price-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: .5rem; align-items: center; }
    .price-row input { border: 2px solid #D4AF37; background: #fff; border-radius: 8px; padding: .4rem .5rem; width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box; }
    .btn-clear { width: 100%; border: 2px solid #D4AF37; background: transparent; color: #7A1F2A; border-radius: 8px; padding: .5rem .8rem; cursor: pointer; font-weight: 700; }
    .more-link { background: transparent; border: none; color: #7A1F2A; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; justify-self: start; }

    .results { min-width: 0; }
    .results-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; color: #7A1F2A; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }

    .card { background: #FFFDF9; border: 2px solid #D4AF37; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .2s ease, transform .2s ease; }
    .card:hover { box-shadow: 0 8px 20px rgba(212, 175, 55, 0.25); transform: translateY(-2px); }
    .thumb { position: relative; height: 220px; overflow: hidden; background: #f6efe0; }
    .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity .3s ease, transform .3s ease; }
    .img-secondary { opacity: 0; transform: scale(1.05); }
    .card:hover .img-primary { opacity: 0; transform: scale(1.05); }
    .card:hover .img-secondary { opacity: 1; transform: scale(1.0); }
    .content { padding: .75rem .9rem; display: grid; grid-template-rows: auto 1fr auto; gap: .3rem; min-height: 132px; }
    .name { margin: 0; color: #7A1F2A; font-size: 1.05rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .desc { margin: 0; color: #1B1B1B; opacity: .8; font-size: .9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .meta { display: none; }
    .price { color: #7A1F2A; font-weight: 700; margin-top: .25rem; }
    .tags { color: #1B1B1B; opacity: .7; font-size: .85rem; }
    .empty { text-align: center; color: #7A1F2A; padding: 2rem; border: 2px dashed #D4AF37; border-radius: 12px; background: #FFFDF9; }

    @media (max-width: 1199px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 991px) {
      .layout { grid-template-columns: 1fr; }
      .btn-filters { display: inline-block; }
      .sidebar { display: none; }
      .sidebar.open { display: block; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 575px) { .grid { grid-template-columns: 1fr; } .thumb { height: 200px; } .content { min-height: 120px; } }
  `]
})
export class OrnamentsListComponent implements OnInit {
  pickupDate: string | null = null;
  returnDate: string | null = null;

  // facet options
  categories: string[] = [];
  sizes: string[] = [];
  colors: string[] = [];

  // selected filters
  selectedCategories = new Set<string>();
  selectedSizes = new Set<string>();
  selectedColors = new Set<string>();
  priceMin: number | null = null;
  priceMax: number | null = null;
  gender: 'all' | 'men' | 'women' = 'all';
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'most_rented' = 'newest';
  mobileFiltersOpen = false;

  // data
  allProducts: OrnamentProduct[] = [
    {
      id: 101,
      name: 'Temple Jewellery Necklace Set',
      description: 'Antique gold finish with red stones, perfect for Bharatanatyam.',
      pricePerDay: 249,
      images: [
        'https://images.pexels.com/photos/269847/pexels-photo-269847.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Necklace Set',
      size: 'One Size',
      color: 'Gold',
      material: 'Gold Plated',
      gender: 'women',
      rentedCount: 312,
      createdAt: '2025-10-23'
    },
    {
      id: 102,
      name: 'Oddiyanam (Waist Belt)',
      description: 'Adjustable waist belt with intricate motifs.',
      pricePerDay: 179,
      images: [
        'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Waist Belt',
      size: 'One Size',
      color: 'Gold',
      material: 'Brass',
      gender: 'women',
      rentedCount: 189,
      createdAt: '2025-09-12'
    },
    {
      id: 103,
      name: 'Traditional Jhumka Earrings',
      description: 'Classic jhumkas with pearl droplets.',
      pricePerDay: 129,
      images: [
        'https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1543760/pexels-photo-1543760.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Earrings',
      size: 'One Size',
      color: 'Gold',
      material: 'Alloy',
      gender: 'women',
      rentedCount: 402,
      createdAt: '2025-08-05'
    },
    {
      id: 104,
      name: 'Kada Bangles Set',
      description: 'Heavy kada bangles with red-green stones.',
      pricePerDay: 149,
      images: [
        'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bangles',
      size: 'M',
      color: 'Gold',
      material: 'Brass',
      gender: 'women',
      rentedCount: 221,
      createdAt: '2025-07-21'
    },
    {
      id: 105,
      name: 'Anklets (Payal)',
      description: 'Silver-tone anklets with ghungroos.',
      pricePerDay: 99,
      images: [
        'https://images.pexels.com/photos/16708247/pexels-photo-16708247.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/16708249/pexels-photo-16708249.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Anklets',
      size: 'One Size',
      color: 'Silver',
      material: 'Silver Tone',
      gender: 'women',
      rentedCount: 168,
      createdAt: '2025-06-16'
    },
    {
      id: 106,
      name: 'Headpiece (Nethichutti)',
      description: 'Center headpiece with ruby stones.',
      pricePerDay: 119,
      images: [
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/269728/pexels-photo-269728.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Headpiece',
      size: 'One Size',
      color: 'Gold',
      material: 'Gold Plated',
      gender: 'women',
      rentedCount: 287,
      createdAt: '2025-05-03'
    },
    {
      id: 107,
      name: 'Armlet (Vanki)',
      description: 'Armlet with floral motif.',
      pricePerDay: 139,
      images: [
        'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/267222/pexels-photo-267222.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Armlet',
      size: 'One Size',
      color: 'Gold',
      material: 'Alloy',
      gender: 'women',
      rentedCount: 96,
      createdAt: '2025-04-02'
    },
    {
      id: 108,
      name: 'Hair Accessories Set',
      description: 'Flowers and hair ornaments combo.',
      pricePerDay: 129,
      images: [
        'https://images.pexels.com/photos/454062/pexels-photo-454062.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3965541/pexels-photo-3965541.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Hair Accessories',
      size: 'One Size',
      color: 'Multi',
      material: 'Mixed',
      gender: 'women',
      rentedCount: 145,
      createdAt: '2025-03-11'
    },
    {
      id: 109,
      name: 'Pearl Necklace',
      description: 'Elegant faux pearl necklace.',
      pricePerDay: 159,
      images: [
        'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Necklace',
      size: 'One Size',
      color: 'White',
      material: 'Pearl',
      gender: 'unisex',
      rentedCount: 101,
      createdAt: '2025-02-14'
    },
    {
      id: 110,
      name: 'Kamarbandh',
      description: 'Stone-studded kamarbandh for stage.',
      pricePerDay: 169,
      images: [
        'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Waist Belt',
      size: 'One Size',
      color: 'Gold',
      material: 'Gold Plated',
      gender: 'women',
      rentedCount: 187,
      createdAt: '2025-01-29'
    },
    {
      id: 111,
      name: 'Maang Tikka',
      description: 'Statement maang tikka with polki stones.',
      pricePerDay: 109,
      images: [
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1395308/pexels-photo-1395308.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Headpiece',
      size: 'One Size',
      color: 'Gold',
      material: 'Kundan',
      gender: 'women',
      rentedCount: 233,
      createdAt: '2024-12-12'
    },
    {
      id: 112,
      name: 'Bangle Stack (Red)',
      description: 'Red bangle stack for bridal look.',
      pricePerDay: 139,
      images: [
        'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/269847/pexels-photo-269847.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      category: 'Bangles',
      size: 'S',
      color: 'Red',
      material: 'Mixed',
      gender: 'women',
      rentedCount: 75,
      createdAt: '2025-11-02'
    }
  ];

  filtered: OrnamentProduct[] = [];

  constructor(private route: ActivatedRoute) {}

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
    for (const p of this.allProducts) {
      cats.add(p.category);
      sizes.add(p.size);
      colors.add(p.color);
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
    this.selectedMaterials.clear();
    this.showMoreMaterial = false;
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

    if (this.selectedCategories.size) {
      res = res.filter(p => this.selectedCategories.has(p.category));
    }
    if (this.selectedSizes.size) {
      res = res.filter(p => this.selectedSizes.has(p.size));
    }
    if (this.selectedColors.size) {
      res = res.filter(p => this.selectedColors.has(p.color));
    }
    if (this.selectedMaterials.size) {
      res = res.filter(p => this.selectedMaterials.has(p.material));
    }
    if (this.gender !== 'all') {
      res = res.filter(p => p.gender === this.gender || p.gender === 'unisex');
    }
    if (min != null) {
      res = res.filter(p => p.pricePerDay >= min);
    }
    if (max != null) {
      res = res.filter(p => p.pricePerDay <= max);
    }

    switch (this.sortBy) {
      case 'price_asc':
        res.sort((a,b) => a.pricePerDay - b.pricePerDay); break;
      case 'price_desc':
        res.sort((a,b) => b.pricePerDay - a.pricePerDay); break;
      case 'most_rented':
        res.sort((a,b) => b.rentedCount - a.rentedCount); break;
      case 'newest':
      default:
        res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    this.filtered = res;
  }

  trackById(_: number, item: OrnamentProduct) { return item.id; }

  // collapsible + material state
  panelsOpen: Record<'category' | 'price' | 'material' | 'size' | 'color' | 'gender', boolean> = {
    category: false,
    price: false,
    material: false,
    size: false,
    color: false,
    gender: false
  };
  materialOptions: string[] = ['Gold Plated', 'Alloy', 'Brass', 'Silver Tone', 'Pearl', 'Mixed'];
  materialExtraOptions: string[] = ['Kundan', 'Meenakari', 'Oxidized'];
  selectedMaterials = new Set<string>();
  showMoreMaterial = false;

  togglePanel(section: 'category' | 'price' | 'material' | 'size' | 'color' | 'gender') {
    this.panelsOpen[section] = !this.panelsOpen[section];
  }

  toggleMaterial(m: string, checked: boolean) {
    checked ? this.selectedMaterials.add(m) : this.selectedMaterials.delete(m);
    this.applyFilters();
  }
}
