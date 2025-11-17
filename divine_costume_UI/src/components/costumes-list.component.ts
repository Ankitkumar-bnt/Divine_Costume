import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
 
interface CostumeProduct {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  images: string[];
  category: string;
  size: string;
  color: string;
  gender: 'men' | 'women' | 'unisex';
  rentedCount: number;
  createdAt: string; // ISO date
}

@Component({
  selector: 'app-costumes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="plp">
      <div class="container">
        <header class="plp-header">
          <div class="title-group">
            <h1 class="title">Costumes</h1>
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
              <h4>Category</h4>
              <label *ngFor="let c of categories">
                <input type="checkbox" [ngModel]="selectedCategories.has(c)" (ngModelChange)="toggleCategory(c, $event)"> {{ c }}
              </label>
            </div>
            <div class="filter-group">
              <h4>Price range</h4>
              <div class="price-row">
                <input type="number" placeholder="Min" [(ngModel)]="priceMin" (ngModelChange)="applyFilters()">
                <span>—</span>
                <input type="number" placeholder="Max" [(ngModel)]="priceMax" (ngModelChange)="applyFilters()">
              </div>
            </div>
            <div class="filter-group">
              <h4>Size</h4>
              <label *ngFor="let s of sizes">
                <input type="checkbox" [ngModel]="selectedSizes.has(s)" (ngModelChange)="toggleSize(s, $event)"> {{ s }}
              </label>
            </div>
            <div class="filter-group">
              <h4>Color</h4>
              <label *ngFor="let col of colors">
                <input type="checkbox" [ngModel]="selectedColors.has(col)" (ngModelChange)="toggleColor(col, $event)"> {{ col }}
              </label>
            </div>
            <div class="filter-group">
              <h4>For</h4>
              <label><input type="radio" name="gender" value="all" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> All</label>
              <label><input type="radio" name="gender" value="women" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Women</label>
              <label><input type="radio" name="gender" value="men" [(ngModel)]="gender" (ngModelChange)="applyFilters()"> Men</label>
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
                  <div class="meta">
                    <span class="price">₹{{ p.pricePerDay }}/day</span>
                    <span class="tags">{{ p.category }} • {{ p.size }} • {{ p.color }}</span>
                  </div>
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
    .filter-group h4 { margin: 0 0 .25rem; color: #7A1F2A; font-size: 1rem; }
    .filter-group label { display: flex; align-items: center; gap: .5rem; font-size: .95rem; color: #1B1B1B; }
    .price-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: .5rem; align-items: center; }
    .price-row input { border: 2px solid #D4AF37; background: #fff; border-radius: 8px; padding: .4rem .5rem; }
    .btn-clear { width: 100%; border: 2px solid #D4AF37; background: transparent; color: #7A1F2A; border-radius: 8px; padding: .5rem .8rem; cursor: pointer; font-weight: 700; }

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
    .content { padding: .75rem .9rem; display: grid; gap: .35rem; }
    .name { margin: 0; color: #7A1F2A; font-size: 1.05rem; }
    .desc { margin: 0; color: #1B1B1B; opacity: .8; font-size: .9rem; }
    .meta { display: flex; align-items: center; justify-content: space-between; margin-top: .25rem; }
    .price { color: #7A1F2A; font-weight: 700; }
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
    @media (max-width: 575px) { .grid { grid-template-columns: 1fr; } .thumb { height: 200px; } }
  `]
})
export class CostumesListComponent implements OnInit {
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
      gender: 'men',
      rentedCount: 51,
      createdAt: '2025-01-22'
    }
  ];

  filtered: CostumeProduct[] = [];

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
    this.priceMin = null;
    this.priceMax = null;
    this.gender = 'all';
    this.sortBy = 'newest';
    this.applyFilters();
  }

  applyFilters() {
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
    if (this.gender !== 'all') {
      res = res.filter(p => p.gender === this.gender || p.gender === 'unisex');
    }
    if (this.priceMin != null) {
      res = res.filter(p => p.pricePerDay >= this.priceMin!);
    }
    if (this.priceMax != null) {
      res = res.filter(p => p.pricePerDay <= this.priceMax!);
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

  trackById(_: number, item: CostumeProduct) { return item.id; }
}
