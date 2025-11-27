import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, ItemRequestDto } from '../../services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-product">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Add New Costume Product</h5>
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
                    required
                    placeholder="e.g., Wedding, Traditional, Kids">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Category Description</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.category.categoryDescription"
                    name="categoryDescription"
                    placeholder="Brief description of category">
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
                    required
                    placeholder="e.g., Royal Sherwani - Gold Embroidery">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Style *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.style"
                    name="style"
                    required
                    placeholder="e.g., Traditional, Modern, Fusion">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Primary Color *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.primaryColor"
                    name="primaryColor"
                    required
                    placeholder="e.g., Gold">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Secondary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.secondaryColor"
                    name="secondaryColor"
                    placeholder="e.g., Red">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Tertiary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.variant.tertiaryColor"
                    name="tertiaryColor"
                    placeholder="e.g., White">
                </div>
              </div>
            </div>

            <!-- Item Details Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-list-check"></i> Item Details
              </h6>
              <div class="row g-3" *ngFor="let it of product.items; let i = index">
                <div class="col-md-3">
                  <label class="form-label">Item Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="product.items[i].itemName" name="itemName{{i}}" required placeholder="e.g., Turban" />
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
                  <input type="text" class="form-control mb-2" [(ngModel)]="product.items[i].imageUrl" name="itemImg{{i}}" placeholder="https://..." />
                  <input type="file" class="form-control" accept="image/*" (change)="onItemImageSelect(i, $event)" />
                  <small class="text-muted">Choose an image or paste a URL</small>
                </div>
                <div class="col-12 d-flex gap-2">
                  <button type="button" class="btn btn-outline-primary" (click)="addItem()"><i class="bi bi-plus-circle"></i> Add Item</button>
                  <button type="button" class="btn btn-outline-danger" (click)="removeItem(i)" [disabled]="product.items.length === 1"><i class="bi bi-trash"></i> Remove</button>
                </div>
              </div>
            </div>

            <!-- Stock Details Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-box"></i> Stock Details
              </h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Number of Items Available *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.costume.numberOfItems"
                    name="numberOfItems"
                    required
                    min="0"
                    placeholder="e.g., 5">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Size *</label>
                  <input 
                    class="form-control"
                    list="sizeOptions"
                    [(ngModel)]="product.costume.size"
                    name="size"
                    required
                    placeholder="e.g., 36+">
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
                  <label class="form-label">Serial Number *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.costume.serialNumber"
                    name="serialNumber"
                    required
                    placeholder="e.g., DC-001">
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
                    placeholder="e.g., 15000">
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
                    placeholder="e.g., 1500">
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
                    placeholder="e.g., 5000">
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
                    placeholder="Enter image URLs separated by commas&#10;e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"></textarea>
                  <input 
                    type="file" 
                    class="form-control"
                    accept="image/*"
                    multiple
                    (change)="onProductImagesSelect($event)" />
                  <small class="text-muted">Choose one or more images or paste URLs above</small>
                </div>
              </div>
            </div>

            <!-- Excel Upload Section -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-file-earmark-excel"></i> Or Upload Excel File
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <input 
                    type="file" 
                    class="form-control" 
                    (change)="onFileSelect($event)"
                    accept=".xlsx,.xls">
                  <small class="text-muted">Upload an Excel file (.xlsx or .xls) with product data</small>
                </div>
                <div class="col-md-12" *ngIf="selectedFile">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    (click)="uploadExcel()">
                    <i class="bi bi-upload"></i> Upload Excel
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!productForm.valid">
                <i class="bi bi-check-circle"></i> Add Product
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
    .add-product {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: none;
    }

    .card-header {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      color: #fff;
      border-radius: 12px 12px 0 0;
      padding: 1.25rem 1.5rem;
    }

    .card-header h5 {
      margin: 0;
      font-weight: 600;
    }

    .card-body {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .section-title {
      color: #5c1a1a;
      font-weight: 600;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title i {
      color: #ffd700;
      font-size: 1.25rem;
    }

    .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control, .form-select {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      border-color: #5c1a1a;
      box-shadow: 0 0 0 0.2rem rgba(92, 26, 26, 0.15);
    }

    .form-check-input {
      width: 3rem;
      height: 1.5rem;
      cursor: pointer;
    }

    .form-check-input:checked {
      background-color: #5c1a1a;
      border-color: #5c1a1a;
    }

    .form-check-label {
      margin-left: 0.5rem;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      border: none;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4a1515 0%, #6a1e1e 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(92, 26, 26, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #6c757d;
      border: none;
    }

    .btn-secondary:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    .btn-outline-primary {
      color: #5c1a1a;
      border-color: #5c1a1a;
    }

    .btn-outline-primary:hover {
      background: #5c1a1a;
      border-color: #5c1a1a;
      color: #fff;
    }

    .text-muted {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
      display: block;
    }
  `]
})
export class AddProductComponent {
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
    items: [
      { itemName: '', rentalPricePerDay: 0, deposit: 0, imageUrl: '' }
    ],
    images: []
  };

  imagesText = '';
  selectedFile: File | null = null;
  itemImageFiles: (File | null)[] = [null];
  productImageFiles: File[] = [];

  constructor(private itemService: ItemService) {}

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an Excel file to upload.',
        confirmButtonColor: '#5c1a1a'
      });
      return;
    }

    this.itemService.uploadExcel(this.selectedFile).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Excel Uploaded Successfully! ✅',
          text: `${response.data.length} products parsed from Excel.`,
          confirmButtonColor: '#5c1a1a'
        });
        this.selectedFile = null;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: err.error?.message || 'Failed to upload Excel file.',
          confirmButtonColor: '#5c1a1a'
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
    }
    this.itemImageFiles[index] = file;
  }

  // Handle multiple product images selection
  onProductImagesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.productImageFiles = files;
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
          this.submitProduct();
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
      this.submitProduct();
    }
  }

  private submitProduct(): void {
    this.itemService.addFullCostume(this.product).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully! ✅',
          text: `${this.product.variant.variantDescription} has been added to inventory.`,
          confirmButtonColor: '#5c1a1a'
        });
        this.resetForm();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Product',
          text: err.error?.message || 'An error occurred while adding the product.',
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
      items: [ { itemName: '', rentalPricePerDay: 0, deposit: 0, imageUrl: '' } ],
      images: []
    };
    this.imagesText = '';
    this.selectedFile = null;
    this.itemImageFiles = [null];
    this.productImageFiles = [];
  }

  addItem(): void {
    this.product.items.push({ itemName: '', rentalPricePerDay: 0, deposit: 0, imageUrl: '' });
    this.itemImageFiles.push(null);
  }

  removeItem(index: number): void {
    if (this.product.items.length > 1) {
      this.product.items.splice(index, 1);
      this.itemImageFiles.splice(index, 1);
    }
  }
}
