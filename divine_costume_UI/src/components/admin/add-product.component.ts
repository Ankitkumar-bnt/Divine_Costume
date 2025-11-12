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
                    [(ngModel)]="product.categoryName"
                    name="categoryName"
                    required
                    placeholder="e.g., Wedding, Traditional, Kids">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Category Description</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.categoryDescription"
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
                    [(ngModel)]="product.variantDescription"
                    name="variantDescription"
                    required
                    placeholder="e.g., Royal Sherwani - Gold Embroidery">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Style *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.style"
                    name="style"
                    required
                    placeholder="e.g., Traditional, Modern, Fusion">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Primary Color *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.primaryColor"
                    name="primaryColor"
                    required
                    placeholder="e.g., Gold">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Secondary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.secondaryColor"
                    name="secondaryColor"
                    placeholder="e.g., Red">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Tertiary Color</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.tertiaryColor"
                    name="tertiaryColor"
                    placeholder="e.g., White">
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
                    [(ngModel)]="product.numberOfItemsAvailable"
                    name="numberOfItemsAvailable"
                    required
                    min="0"
                    placeholder="e.g., 5">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Size *</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="product.size"
                    name="size"
                    required>
                    <option value="">Select Size</option>
                    <option value="Kids-Small">Kids - Small</option>
                    <option value="Kids-Medium">Kids - Medium</option>
                    <option value="Kids-Large">Kids - Large</option>
                    <option value="Adult-S">Adult - S</option>
                    <option value="Adult-M">Adult - M</option>
                    <option value="Adult-L">Adult - L</option>
                    <option value="Adult-XL">Adult - XL</option>
                    <option value="Adult-XXL">Adult - XXL</option>
                    <option value="Free Size">Free Size</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Serial Number *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="product.serialNumber"
                    name="serialNumber"
                    required
                    placeholder="e.g., DC-001">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Purchase Price (₹) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="product.purchasePrice"
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
                    [(ngModel)]="product.rentalPricePerDay"
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
                    [(ngModel)]="product.depositAmount"
                    name="depositAmount"
                    required
                    min="0"
                    placeholder="e.g., 5000">
                </div>
                <div class="col-md-12">
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="product.isRentable"
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
                    class="form-control" 
                    [(ngModel)]="imageUrlsText"
                    name="imageUrls"
                    rows="3"
                    placeholder="Enter image URLs separated by commas&#10;e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"></textarea>
                  <small class="text-muted">Enter multiple image URLs separated by commas</small>
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
    categoryName: '',
    categoryDescription: '',
    variantDescription: '',
    style: '',
    primaryColor: '',
    secondaryColor: '',
    tertiaryColor: '',
    numberOfItemsAvailable: 0,
    size: '',
    serialNumber: '',
    purchasePrice: 0,
    rentalPricePerDay: 0,
    depositAmount: 0,
    isRentable: true,
    imageUrls: []
  };

  imageUrlsText = '';
  selectedFile: File | null = null;

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

  onSubmit(): void {
    // Parse image URLs
    if (this.imageUrlsText.trim()) {
      this.product.imageUrls = this.imageUrlsText
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    }

    this.itemService.addFullCostume(this.product).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully! ✅',
          text: `${this.product.variantDescription} has been added to inventory.`,
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
      categoryName: '',
      categoryDescription: '',
      variantDescription: '',
      style: '',
      primaryColor: '',
      secondaryColor: '',
      tertiaryColor: '',
      numberOfItemsAvailable: 0,
      size: '',
      serialNumber: '',
      purchasePrice: 0,
      rentalPricePerDay: 0,
      depositAmount: 0,
      isRentable: true,
      imageUrls: []
    };
    this.imageUrlsText = '';
    this.selectedFile = null;
  }
}
