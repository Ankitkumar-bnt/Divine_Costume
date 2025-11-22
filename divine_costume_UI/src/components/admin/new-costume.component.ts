import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, ItemRequestDto } from '../../services/item.service';
import { InventoryService, Category } from '../../services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-costume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-product">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Add New Costume</h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #productForm="ngForm">
            <!-- Costume Category Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-tag"></i> Costume Category
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Category Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.category.categoryName"
                    name="categoryName"
                    list="categoryOptions"
                    (ngModelChange)="onCategoryChange($event); fetchNextSerialIfReady()"
                    required>
                  <datalist id="categoryOptions">
                    <option *ngFor="let c of categories" [value]="c"></option>
                  </datalist>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Category Description</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.category.categoryDescription"
                    name="categoryDescription">
                </div>
              </div>
            </div>

            <!-- Costume Variant Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-palette"></i> Costume Variant
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Variant Description *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.variantDescription"
                    name="variantDescription"
                    required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Style *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.style"
                    name="style"
                    required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Primary Color *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.primaryColor"
                    name="primaryColor"
                    required
                    (ngModelChange)="fetchNextSerialIfReady()">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Secondary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.secondaryColor"
                    name="secondaryColor"
                    (ngModelChange)="fetchNextSerialIfReady()">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Tertiary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.tertiaryColor"
                    name="tertiaryColor"
                    (ngModelChange)="fetchNextSerialIfReady()">
                </div>
              </div>
            </div>

            <!-- Costumes Section (Stock Details) -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-box"></i> Costumes
              </h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Number of Items *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.costume.numberOfItems"
                    name="numberOfItems"
                    required
                    min="0"
                    (ngModelChange)="syncItemsToCount()">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Size *</label>
                  <input 
                    class="form-control"
                    list="sizeOptions"
                    [(ngModel)]="product.costume.size"
                    name="size"
                    required
                    (ngModelChange)="fetchNextSerialIfReady()">
                  <datalist id="sizeOptions">
                    <option value="24"></option>
                    <option value="26"></option>
                    <option value="28"></option>
                    <option value="30"></option>
                    <option value="32"></option>
                    <option value="34"></option>
                    <option value="36"></option>
                    <option value="36+"></option>
                    <option value="38"></option>
                    <option value="40"></option>
                    <option value="40+"></option>
                    <option value="40++"></option>
                    <option value="42"></option>
                    <option value="42+"></option>
                  </datalist>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Purchase Price (₹) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.costume.purchasePrice"
                    name="purchasePrice"
                    required
                    min="0"
                    >
                </div>
                <div class="col-md-4">
                  <label class="form-label">Rental Price Per Day (₹) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.costume.rentalPricePerDay"
                    name="rentalPricePerDay"
                    required
                    min="0"
                    >
                </div>
                <div class="col-md-4">
                  <label class="form-label">Deposit Amount (₹) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.costume.deposit"
                    name="deposit"
                    required
                    min="0"
                    >
                </div>
                <div class="col-md-12">
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="product.costume.isRentable"
                      name="isRentable"
                      id="isRentable">
                    <label class="form-check-label" for="isRentable">
                      Is Rentable (Available for Rent)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Item Details Section (after Costumes) -->
            <div class="form-section" *ngIf="product.items.length > 0">
              <h6 class="section-title">
                <i class="bi bi-list-check"></i> Item Details
              </h6>
              <div class="row g-3" *ngFor="let it of product.items; let i = index">
                <div class="col-md-3">
                  <label class="form-label">Item Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="product.items[i].itemName" name="itemName{{i}}" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Rental / Day (₹)</label>
                  <input type="number" class="form-control" [(ngModel)]="product.items[i].rentalPricePerDay" name="itemRent{{i}}" min="0" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Deposit (₹)</label>
                  <input type="number" class="form-control" [(ngModel)]="product.items[i].deposit" name="itemDeposit{{i}}" min="0" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Image URL</label>
                  <div class="d-flex gap-2">
                    <input type="text" class="form-control" [(ngModel)]="product.items[i].imageUrl" name="itemImg{{i}}" />
                    <button type="button" class="btn btn-outline-danger" title="Clear URL" (click)="clearItemImageUrl(i)"><i class="bi bi-x"></i></button>
                  </div>
                  <input type="file" class="form-control mt-2" accept="image/*" (change)="onItemImageSelect(i, $event)" />
                  <div class="mt-2" *ngIf="itemImagePreviews[i]">
                    <div class="thumb">
                      <img [src]="itemImagePreviews[i]" alt="item image" />
                      <button type="button" class="thumb-remove" (click)="removeItemImageFile(i)"><i class="bi bi-x"></i></button>
                    </div>
                  </div>
                  <small class="text-muted">Choose an image or paste a URL</small>
                </div>
              </div>
            </div>

            <!-- Image URLs Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-images"></i> Product Images
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Image URLs (comma-separated)</label>
                  <textarea 
                    class="form-control mb-2" 
                    [(ngModel)]="imagesText"
                    name="imagesText"
                    rows="3"
                    (ngModelChange)="onImagesTextChange($event)"></textarea>
                  <input 
                    type="file" 
                    class="form-control"
                    accept="image/*"
                    multiple
                    (change)="onProductImagesSelect($event)" />
                  <small class="text-muted">Choose one or more images or paste URLs above</small>
                </div>
                <div class="col-md-12" *ngIf="imageUrlList.length > 0">
                  <div class="preview-row">
                    <div class="chip" *ngFor="let url of imageUrlList; let idx = index">
                      <img [src]="url" alt="preview" class="chip-img" onerror="this.style.display='none'">
                      <span class="chip-text">{{ url }}</span>
                      <button type="button" class="chip-close" (click)="removeImageUrl(idx)">×</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-12" *ngIf="productImagePreviews.length > 0">
                  <div class="preview-row">
                    <div class="thumb" *ngFor="let p of productImagePreviews; let idx = index">
                      <img [src]="p" alt="image" />
                      <button type="button" class="thumb-remove" (click)="removeProductImage(idx)"><i class="bi bi-x"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!productForm.valid">
                <i class="bi bi-check-circle"></i> Add Costume
              </button>
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="resetForm()">
                <i class="bi bi-x-circle"></i> Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-product { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none; }
    .card-header { background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%); color: #fff; border-radius: 12px 12px 0 0; padding: 1.25rem 1.5rem; }
    .card-header h5 { margin: 0; font-weight: 600; }
    .card-body { padding: 2rem; }
    .form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #e9ecef; }
    .form-section:last-of-type { border-bottom: none; }
    .section-title { color: #5c1a1a; font-weight: 600; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
    .section-title i { color: #ffd700; font-size: 1.25rem; }
    .form-label { font-weight: 500; color: #495057; margin-bottom: 0.5rem; }
    .form-control, .form-select { border: 1px solid #ced4da; border-radius: 8px; padding: 0.625rem 0.875rem; transition: all 0.3s ease; }
    .form-control:focus, .form-select:focus { border-color: #5c1a1a; box-shadow: 0 0 0 0.2rem rgba(92, 26, 26, 0.15); }
    .form-check-input { width: 3rem; height: 1.5rem; cursor: pointer; }
    .form-check-input:checked { background-color: #5c1a1a; border-color: #5c1a1a; }
    .form-check-label { margin-left: 0.5rem; cursor: pointer; }
    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e9ecef; }
    .btn { padding: 0.625rem 1.5rem; border-radius: 8px; font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; }
    .btn-primary { background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%); border: none; }
    .btn-primary:hover { background: linear-gradient(135deg, #4a1515 0%, #6a1e1e 100%); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(92, 26, 26, 0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .btn-secondary { background: #6c757d; border: none; }
    .btn-secondary:hover { background: #5a6268; transform: translateY(-2px); }
    .btn-outline-primary { color: #5c1a1a; border-color: #5c1a1a; }
    .btn-outline-primary:hover { background: #5c1a1a; border-color: #5c1a1a; color: #fff; }
    .text-muted { font-size: 0.875rem; color: #6c757d; margin-top: 0.25rem; display: block; }

    @media (max-width: 768px) {
      .form-actions { flex-direction: column; }
      .form-actions .btn { width: 100%; justify-content: center; }
    }

    .preview-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #dee2e6; border-radius: 999px; padding: 4px 8px; background: #f8f9fa; max-width: 100%; }
    .chip-img { width: 24px; height: 24px; object-fit: cover; border-radius: 50%; border: 1px solid #e9ecef; }
    .chip-text { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.85rem; color: #495057; }
    .chip-close { border: none; background: transparent; color: #6c757d; cursor: pointer; font-size: 1rem; line-height: 1; }
    .chip-close:hover { color: #dc3545; }
    .thumb { position: relative; display: inline-block; }
    .thumb img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #dee2e6; }
    .thumb-remove { position: absolute; top: -8px; right: -8px; background: #fff; border: 1px solid #dee2e6; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; padding: 0; cursor: pointer; }
    .thumb-remove:hover { border-color: #dc3545; color: #dc3545; }
  `]
})
export class NewCostumeComponent implements OnInit {
  categories: string[] = [];
  private categoryMap: Map<string, string> = new Map(); // lower(name) -> description
  product: ItemRequestDto = {
    category: {
      categoryName: '',
      categoryDescription: ''
    },
    variant: {
      variantDescription: '',
      style: '',
      primaryColor: '',
      secondaryColor: '',
      tertiaryColor: ''
    },
    costume: {
      numberOfItems: 0,
      size: '',
      serialNumber: 0,
      purchasePrice: 0,
      rentalPricePerDay: 0,
      deposit: 0,
      isRentable: true
    },
    items: [],
    images: []
  };

  imagesText = '';
  itemImageFiles: (File | null)[] = [null];
  itemImagePreviews: (string | null)[] = [null];
  productImageFiles: File[] = [];
  productImagePreviews: string[] = [];
  imageUrlList: string[] = [];

  constructor(private itemService: ItemService, private inventoryService: InventoryService) {}

  ngOnInit(): void {
    // Prefer fetching categories with descriptions
    this.inventoryService.getCategories().subscribe({
      next: (cats: Category[]) => {
        const seen = new Set<string>();
        this.categoryMap.clear();
        const names: string[] = [];
        for (const c of cats || []) {
          const name = (c.categoryName || '').trim();
          if (!name) continue;
          const key = name.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          names.push(name);
          this.categoryMap.set(key, (c.categoryDescription || '').trim());
        }
        this.categories = names.sort((a, b) => a.localeCompare(b));
      },
      error: () => {
        // Fallback to existing aggregation from items if categories API fails
        this.itemService.getAllItems().subscribe({
          next: (items) => {
            const map = new Map<string, string>();
            for (const it of items) {
              const name = (it.categoryName || '').trim();
              if (!name) continue;
              const key = name.toLowerCase();
              if (!map.has(key)) map.set(key, name);
            }
            this.categories = Array.from(map.values()).sort((a, b) => a.localeCompare(b));
          },
          error: () => {
            this.categories = [];
          }
        });
      }
    });
  }

  // Handle single item image file selection
  onItemImageSelect(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    while (this.itemImageFiles.length < this.product.items.length) {
      this.itemImageFiles.push(null);
      this.itemImagePreviews.push(null);
    }
    this.itemImageFiles[index] = file;
    // revoke old
    if (this.itemImagePreviews[index]) URL.revokeObjectURL(this.itemImagePreviews[index]!);
    this.itemImagePreviews[index] = file ? URL.createObjectURL(file) : null;
  }

  // Handle multiple product images selection
  onProductImagesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    // append to existing selections
    for (const f of files) {
      this.productImageFiles.push(f);
      const url = URL.createObjectURL(f);
      this.productImagePreviews.push(url);
    }
  }

  // Add typed category to dropdown if it's new
  onCategoryChange(value: string): void {
    const v = (value || '').trim();
    if (!v) return;
    const existing = this.categories.find(c => c.toLowerCase() === v.toLowerCase());
    if (existing) {
      this.product.category.categoryName = existing;
      // Auto-fill description for known category
      const desc = this.categoryMap.get(existing.toLowerCase());
      if (desc != null) {
        this.product.category.categoryDescription = desc;
      }
      return;
    }
    this.categories = [...this.categories, v].sort((a, b) => a.localeCompare(b));
    // Clear description for truly new category
    this.product.category.categoryDescription = this.product.category.categoryDescription || '';
  }

  // Sync the number of item rows with the number entered
  syncItemsToCount(): void {
    const count = Math.max(0, Math.floor(Number(this.product.costume.numberOfItems) || 0));
    const current = this.product.items.length;
    if (count > current) {
      for (let i = current; i < count; i++) {
        this.product.items.push({ itemName: '', rentalPricePerDay: 0, deposit: 0, imageUrl: '' });
        this.itemImageFiles.push(null);
      }
    } else if (count < current) {
      this.product.items.splice(count);
      this.itemImageFiles.splice(count);
    }
  }

  // Track URL images from textarea as list
  onImagesTextChange(val: string): void {
    const list = (val || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const seen = new Set<string>();
    this.imageUrlList = list.filter(u => {
      const key = u.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    this.imagesText = this.imageUrlList.join(', ');
  }

  removeImageUrl(index: number): void {
    this.imageUrlList.splice(index, 1);
    this.imagesText = this.imageUrlList.join(', ');
  }

  removeProductImage(index: number): void {
    const url = this.productImagePreviews[index];
    if (url) URL.revokeObjectURL(url);
    this.productImagePreviews.splice(index, 1);
    this.productImageFiles.splice(index, 1);
  }

  removeItemImageFile(index: number): void {
    const url = this.itemImagePreviews[index];
    if (url) URL.revokeObjectURL(url);
    this.itemImagePreviews[index] = null;
    this.itemImageFiles[index] = null;
  }

  clearItemImageUrl(index: number): void {
    this.product.items[index].imageUrl = '';
  }

  // Fetch next serial number when category/colors/size are available
  fetchNextSerialIfReady(): void {
    const categoryName = (this.product.category.categoryName || '').trim();
    const primaryColor = (this.product.variant.primaryColor || '').trim();
    const size = (this.product.costume.size || '').trim();
    if (!categoryName || !primaryColor || !size) return;
    this.itemService.getNextSerialNumber({
      categoryName,
      primaryColor,
      secondaryColor: this.product.variant.secondaryColor || '',
      tertiaryColor: this.product.variant.tertiaryColor || '',
      size
    }).subscribe({
      next: (next) => { this.product.costume.serialNumber = next; },
      error: () => { /* ignore errors for UX */ }
    });
  }

  onSubmit(): void {
    // First, upload any selected files
    if (this.productImageFiles.length > 0) {
      // Show loading
      Swal.fire({
        title: 'Uploading Images...',
        text: 'Please wait while we upload your images.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.itemService.uploadImages(this.productImageFiles).subscribe({
        next: (response) => {
          // Add uploaded URLs to existing text URLs
          const uploadedUrls = response.data || [];
          const textUrls = this.imagesText.trim() 
            ? this.imagesText.split(',').map(url => url.trim()).filter(url => url.length > 0)
            : [];
          
          const allUrls = [...textUrls, ...uploadedUrls];
          this.product.images = allUrls.map(url => ({ imageUrl: url }));
          
          Swal.close();
          this.submitCostume();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Image Upload Failed',
            text: err.error?.message || 'Failed to upload images. Please try again.',
            confirmButtonColor: '#5c1a1a'
          });
        }
      });
    } else {
      // No files to upload, just use text URLs
      if (this.imagesText.trim()) {
        this.product.images = this.imagesText
          .split(',')
          .map(url => url.trim())
          .filter(url => url.length > 0)
          .map(url => ({ imageUrl: url }));
      } else {
        this.product.images = [];
      }
      this.submitCostume();
    }
  }

  private submitCostume(): void {
    this.itemService.addFullCostume(this.product).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Costume Added Successfully! ✅',
          text: `${this.product.variant.variantDescription} has been added to inventory.`,
          confirmButtonColor: '#5c1a1a'
        });
        this.resetForm();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Costume',
          text: err.error?.message || 'An error occurred while adding the costume.',
          confirmButtonColor: '#5c1a1a'
        });
      }
    });
  }

  resetForm(): void {
    this.product = {
      category: { categoryName: '', categoryDescription: '' },
      variant: { variantDescription: '', style: '', primaryColor: '', secondaryColor: '', tertiaryColor: '' },
      costume: { numberOfItems: 0, size: '', serialNumber: 0, purchasePrice: 0, rentalPricePerDay: 0, deposit: 0, isRentable: true },
      items: [],
      images: []
    };
    this.imagesText = '';
    // revoke preview URLs
    this.productImagePreviews.forEach(u => { if (u) URL.revokeObjectURL(u); });
    this.itemImagePreviews.forEach(u => { if (u) URL.revokeObjectURL(u); });
    this.itemImageFiles = [null];
    this.itemImagePreviews = [null];
    this.productImageFiles = [];
    this.productImagePreviews = [];
    this.imageUrlList = [];
  }
}
