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
      <div class="page-shell">
        
        <section class="surface-card form-shell">
          <div class="surface-header">
            <div>
              <h2>New Costume</h2>
              <span class="surface-subtitle">Populate each segment. Required fields are flagged with *</span>
            </div>
            <div class="header-hint">
              <i class="bi bi-lightning-charge"></i>
              <span>Auto serial generation enabled</span>
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-palette"></i>
                </span>
                <div>
                  <h3>Costume Variant</h3>
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
            </section>

            <section class="form-section">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-box"></i>
                </span>
                <div>
                  <h3>Costume Inventory</h3>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 field-grid">
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
                    <label class="form-label">Serial Number</label>
                    <div class="serial-field">
                      <input 
                        type="number" 
                        class="form-control" 
                        [(ngModel)]="product.costume.serialNumber"
                        name="serialNumber"
                        min="0">
                      <span class="serial-hint">
                        <i class="bi bi-magic"></i>
                        <span>Auto-filled when possible</span>
                      </span>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Purchase Price (₹) *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="product.costume.purchasePrice"
                      name="purchasePrice"
                      required
                      min="0">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Rental Price Per Day (₹) *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="product.costume.rentalPricePerDay"
                      name="rentalPricePerDay"
                      required
                      min="0">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Deposit Amount (₹) *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="product.costume.deposit"
                      name="deposit"
                      required
                      min="0">
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

            <section class="form-section" *ngIf="product.items.length > 0">
              <div class="section-header">
                <span class="section-icon">
                  <i class="bi bi-list-check"></i>
                </span>
                <div>
                  <h3>Item Details</h3>
                </div>
              </div>
              <div class="section-content">
                <div class="row g-4 item-block" *ngFor="let it of product.items; let i = index">
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
                    <div class="input-stack">
                      <div class="url-line">
                        <input type="text" class="form-control" [(ngModel)]="product.items[i].imageUrl" name="itemImg{{i}}" />
                        <button type="button" class="btn btn-outline-danger" title="Clear URL" (click)="clearItemImageUrl(i)"><i class="bi bi-x"></i></button>
                      </div>
                      <input type="file" class="form-control" accept="image/*" (change)="onItemImageSelect(i, $event)" />
                      <div class="thumb" *ngIf="itemImagePreviews[i]">
                        <img [src]="itemImagePreviews[i]" alt="item image" />
                        <button type="button" class="thumb-remove" (click)="removeItemImageFile(i)"><i class="bi bi-x"></i></button>
                      </div>
                      <small class="text-muted">Choose an image or paste a URL</small>
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
                    <div class="chip-row">
                      <div class="chip" *ngFor="let url of imageUrlList; let idx = index">
                        <img [src]="getImageDisplayUrl(url)" (error)="onImageError($event)" alt="preview">
                        <span class="chip-text">{{ url }}</span>
                        <button type="button" (click)="removeImageUrl(idx)">×</button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12" *ngIf="productImagePreviews.length > 0">
                    <div class="thumb-row">
                      <div class="thumb" *ngFor="let p of productImagePreviews; let idx = index">
                        <img [src]="p" alt="image" />
                        <button type="button" class="thumb-remove" (click)="removeProductImage(idx)"><i class="bi bi-x"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary primary-action"
                [disabled]="!productForm.valid">
                <i class="bi bi-check-circle"></i> Add Costume
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
      align-items: center;
      gap: 0.9rem;
    }

    .section-header > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
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

    input[list]::placeholder {
      color: #94a3b8;
    }

    textarea.form-control {
      min-height: 150px;
      resize: vertical;
    }

    input[type="file"].form-control {
      padding: 0.6rem 0.85rem;
      background: rgba(248, 250, 255, 0.85);
    }

    .serial-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .serial-hint {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.78rem;
      color: #6366f1;
    }

    .serial-hint i {
      font-size: 0.85rem;
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

    .input-stack {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .url-line {
      display: flex;
      gap: 0.6rem;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background: rgba(248, 250, 255, 0.9);
      color: #0f172a;
      font-size: 0.82rem;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    }

    .chip img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(148, 163, 184, 0.35);
    }

    .chip button {
      border: none;
      background: transparent;
      color: #cbd5f5;
      font-size: 1rem;
      cursor: pointer;
      padding: 0;
    }

    .chip button:hover {
      color: #ef4444;
    }

    .chip-text {
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .thumb-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .thumb {
      position: relative;
      display: inline-flex;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
    }

    .thumb img {
      width: 70px;
      height: 70px;
      object-fit: cover;
    }

    .thumb-remove {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.85);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #1f2937;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
    }

    .thumb-remove:hover {
      background: rgba(248, 113, 113, 0.9);
      color: #fff;
    }

    .text-muted {
      font-size: 0.82rem;
      color: #64748b;
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

  constructor(private itemService: ItemService, private inventoryService: InventoryService) { }

  /**
   * Convert absolute file path to displayable URL
   * Handles both old relative paths and new absolute paths for backward compatibility
   */
  getImageDisplayUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it's an absolute file path (contains : for Windows or starts with / or \)
    if (imagePath.includes(':') || imagePath.startsWith('/') || imagePath.startsWith('\\')) {
      // Encode the path for URL
      const encodedPath = encodeURIComponent(imagePath);
      return `http://localhost:8080/api/files/display?path=${encodedPath}`;
    }

    // Fallback: treat as relative path (for backward compatibility)
    return `http://localhost:8080/api/files/images/${imagePath}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.style.display = 'none';
    }
  }

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
    // Collect all files to upload
    const productFiles = this.productImageFiles;

    // Identify item images to upload: store { index, file }
    const itemUploads: { index: number; file: File }[] = [];
    this.itemImageFiles.forEach((file, idx) => {
      if (file) {
        itemUploads.push({ index: idx, file: file });
      }
    });

    const totalFiles = productFiles.length + itemUploads.length;

    if (totalFiles > 0) {
      Swal.fire({
        title: 'Uploading Images...',
        text: `Uploading ${totalFiles} image(s)...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // We need to upload product images and item images. 
      // We can do them in parallel or sequence. Let's do parallel for speed, 
      // but we need to map results back correctly.

      // 1. Upload Product Images
      const productUpload$ = productFiles.length > 0
        ? this.itemService.uploadImages(productFiles)
        : null;

      // 2. Upload Item Images
      // Since the API takes File[], we can upload all item images in one go, 
      // and assume the order is preserved.
      const itemFilesOnly = itemUploads.map(u => u.file);
      const itemUpload$ = itemFilesOnly.length > 0
        ? this.itemService.uploadImages(itemFilesOnly)
        : null;

      // ForkJoin or simple Promise.all equivalent logic
      // Using a simple approach since we are inside a component

      const promises: Promise<any>[] = [];

      if (productUpload$) {
        promises.push(new Promise((resolve, reject) => {
          productUpload$!.subscribe({
            next: (res) => resolve({ type: 'product', urls: res.data }),
            error: (err) => reject(err)
          });
        }));
      }

      if (itemUpload$) {
        promises.push(new Promise((resolve, reject) => {
          itemUpload$!.subscribe({
            next: (res) => resolve({ type: 'item', urls: res.data }),
            error: (err) => reject(err)
          });
        }));
      }

      Promise.all(promises).then(results => {
        // Process results
        results.forEach(result => {
          if (result.type === 'product') {
            const uploadedUrls = result.urls || [];
            const textUrls = this.imagesText.trim()
              ? this.imagesText.split(',').map(url => url.trim()).filter(url => url.length > 0)
              : [];
            const allUrls = [...textUrls, ...uploadedUrls];
            this.product.images = allUrls.map(url => ({ imageUrl: url }));
          } else if (result.type === 'item') {
            const urls = result.urls || [];
            // Map back to items using the itemUploads index
            urls.forEach((url: string, i: number) => {
              if (i < itemUploads.length) {
                const originalIndex = itemUploads[i].index;
                if (this.product.items[originalIndex]) {
                  this.product.items[originalIndex].imageUrl = url;
                }
              }
            });
          }
        });

        Swal.close();
        this.submitCostume();

      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Image Upload Failed',
          text: err.error?.message || 'Failed to upload images. Please try again.',
          confirmButtonColor: '#5c1a1a'
        });
      });

    } else {
      // No files to upload
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
