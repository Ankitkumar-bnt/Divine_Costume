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
      <div class="page-shell">
        <header class="page-header">
          <div>
            <h1>Costume Product Builder</h1>
            <p>Design, price, and publish premium ensembles in one streamlined flow.</p>
          </div>
          <div class="header-pill">
            <i class="bi bi-stars"></i>
            <span>New Entry</span>
          </div>
        </header>

        <section class="surface-card form-shell">
          <div class="surface-header">
            <div>
              <h2>Costume Blueprint</h2>
              <span class="surface-subtitle">Complete every section below. Fields marked * are mandatory.</span>
            </div>
            <div class="header-hint">
              <i class="bi bi-lightning-charge"></i>
              <span>Instant storefront availability</span>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" #productForm="ngForm" class="form-body">
            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-tag"></i>
                </span>
                <div>
                  <h3>Costume Category</h3>
                  <p>Organize the product within your catalog structure.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-palette"></i>
                </span>
                <div>
                  <h3>Costume Variant</h3>
                  <p>Describe styling and palette for this ensemble.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
                </div>
                <div class="row g-4 field-grid">
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-list-check"></i>
                </span>
                <div>
                  <h3>Item Details</h3>
                  <p>Outline each part of the costume set with pricing.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 item-block" *ngFor="let it of product.items; let i = index">
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
                  <div class="col-12 d-flex gap-2 item-actions">
                    <button type="button" class="btn btn-outline-primary" (click)="addItem()"><i class="bi bi-plus-circle"></i> Add Item</button>
                    <button type="button" class="btn btn-outline-danger" (click)="removeItem(i)" [disabled]="product.items.length === 1"><i class="bi bi-trash"></i> Remove</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-box"></i>
                </span>
                <div>
                  <h3>Stock Details</h3>
                  <p>Control availability, sizing, and financials.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
                  <div class="col-md-12 toggle-row">
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-images"></i>
                </span>
                <div>
                  <h3>Product Images</h3>
                  <p>Showcase the costume with high-quality visuals.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-file-earmark-excel"></i>
                </span>
                <div>
                  <h3>Or Upload Excel File</h3>
                  <p>Import costume data directly from a spreadsheet.</p>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
            </section>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary primary-action"
                [disabled]="!productForm.valid">
                <i class="bi bi-check-circle"></i> Add Product
              </button>
              <button 
                type="button" 
                class="btn btn-secondary secondary-action"
                (click)="resetForm()">
                <i class="bi bi-x-circle"></i> Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .add-product {
      min-height: 100vh;
      padding: clamp(1.5rem, 3vw, 2.75rem);
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-shell {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: clamp(1.5rem, 2.5vw, 2.5rem);
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: clamp(1rem, 2vw, 1.5rem);
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.15);
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
    }

    .page-header h1 {
      margin: 0;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 600;
      color: #1f2937;
    }

    .page-header p {
      margin: 0.4rem 0 0;
      color: #64748b;
      font-size: 0.97rem;
    }

    .header-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.1rem;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.28) 100%);
      color: #1d4ed8;
      font-weight: 600;
      letter-spacing: 0.01em;
      box-shadow: 0 12px 28px rgba(59, 130, 246, 0.18);
    }

    .header-pill i {
      font-size: 1.1rem;
    }

    .surface-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.12);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
    }

    .form-shell {
      display: flex;
      flex-direction: column;
      gap: clamp(1.75rem, 2.5vw, 2.5rem);
      padding: clamp(1.75rem, 2.5vw, 2.5rem);
    }

    .surface-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      padding-bottom: 1.25rem;
    }

    .surface-header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 600;
      color: #1e293b;
    }

    .surface-subtitle {
      font-size: 0.92rem;
      color: #94a3b8;
    }

    .header-hint {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.9rem;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(236, 253, 245, 0.75) 0%, rgba(209, 250, 229, 0.75) 100%);
      color: #047857;
      font-weight: 600;
      font-size: 0.85rem;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    .header-hint i {
      font-size: 1rem;
    }

    .form-body {
      display: flex;
      flex-direction: column;
      gap: clamp(1.75rem, 2.5vw, 2.5rem);
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: clamp(1.1rem, 2vw, 1.6rem);
      padding: clamp(1.25rem, 2vw, 1.75rem);
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(248, 250, 255, 0.92) 0%, rgba(241, 245, 249, 0.95) 100%);
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 0.9rem;
    }

    .section-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(129, 140, 248, 0.3) 100%);
      color: #4f46e5;
      font-size: 1.25rem;
      box-shadow: 0 12px 24px rgba(99, 102, 241, 0.18);
      flex-shrink: 0;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
      color: #1e293b;
    }

    .section-header p {
      margin: 0.35rem 0 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .section-content {
      display: grid;
      gap: 1.25rem;
    }

    .field-grid {
      --bs-gutter-x: 1.75rem;
      --bs-gutter-y: 1.15rem;
      margin: 0;
      padding: clamp(1rem, 2vw, 1.4rem);
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      background: rgba(255, 255, 255, 0.94);
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
    }

    .item-block {
      --bs-gutter-x: 1.75rem;
      --bs-gutter-y: 1.15rem;
      margin: 0;
      padding: clamp(1rem, 2vw, 1.4rem);
      border-radius: 18px;
      border: 1px dashed rgba(99, 102, 241, 0.35);
      background: rgba(238, 242, 255, 0.85);
      box-shadow: 0 14px 30px rgba(79, 70, 229, 0.15);
    }

    .form-label {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.4rem;
    }

    .form-control {
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.32);
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, rgba(248, 250, 255, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%);
      color: #0f172a;
      font-weight: 500;
      transition: border 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .form-control:focus {
      border-color: rgba(99, 102, 241, 0.65);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
      background: #fff;
      color: #1f2937;
      transform: translateY(-1px);
    }

    textarea.form-control {
      min-height: 150px;
      resize: vertical;
    }

    input[type="file"].form-control {
      padding: 0.6rem 0.85rem;
      background: rgba(248, 250, 255, 0.85);
    }

    .text-muted {
      font-size: 0.82rem;
      color: #64748b;
      margin-top: 0.35rem;
    }

    .item-actions {
      justify-content: flex-end;
      padding-top: 0.5rem;
      flex-wrap: wrap;
    }

    .toggle-row {
      display: flex;
      align-items: center;
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.1rem;
      border-radius: 14px;
      background: rgba(238, 242, 255, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.18);
    }

    .form-check-input {
      width: 3.1rem;
      height: 1.6rem;
      border: none;
      background-color: rgba(226, 232, 240, 0.8);
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .form-check-input:checked {
      background-color: #4f46e5;
    }

    .form-check-label {
      margin: 0;
      color: #334155;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1.75rem;
      border-top: 1px solid rgba(148, 163, 184, 0.18);
    }

    .btn {
      border-radius: 14px;
      font-weight: 600;
      padding: 0.75rem 1.6rem;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    }

    .btn i {
      font-size: 1.05rem;
    }

    .primary-action {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      border: none;
      color: #fff;
      box-shadow: 0 18px 32px rgba(79, 70, 229, 0.25);
    }

    .primary-action:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 26px 48px rgba(79, 70, 229, 0.28);
    }

    .primary-action:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .secondary-action {
      background: rgba(148, 163, 184, 0.2);
      border: 1px solid rgba(148, 163, 184, 0.45);
      color: #334155;
    }

    .secondary-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 32px rgba(148, 163, 184, 0.25);
    }

    .btn-outline-primary {
      border-color: rgba(99, 102, 241, 0.6);
      color: #4f46e5;
      background: rgba(255, 255, 255, 0.9);
    }

    .btn-outline-primary:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(129, 140, 248, 0.28) 100%);
      color: #3730a3;
      border-color: rgba(79, 70, 229, 0.65);
      transform: translateY(-1px);
      box-shadow: 0 16px 30px rgba(79, 70, 229, 0.22);
    }

    .btn-outline-danger {
      border-color: rgba(248, 113, 113, 0.55);
      color: #b91c1c;
      background: rgba(254, 242, 242, 0.85);
    }

    .btn-outline-danger:hover:not(:disabled) {
      background: rgba(248, 113, 113, 0.22);
      color: #991b1b;
      transform: translateY(-1px);
      box-shadow: 0 16px 30px rgba(248, 113, 113, 0.22);
    }

    .btn-outline-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 992px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-pill {
        align-self: flex-start;
      }

      .surface-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .header-hint {
        align-self: stretch;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .form-actions .btn {
        width: 100%;
        justify-content: center;
      }

      .item-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 576px) {
      .add-product {
        padding: 1.25rem;
      }

      .form-shell {
        padding: 1.5rem;
      }

      .form-section {
        padding: 1.1rem;
      }

      .field-grid,
      .item-block {
        padding: 1rem;
      }
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
