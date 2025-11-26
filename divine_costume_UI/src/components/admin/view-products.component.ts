import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService, ItemResponseDto } from '../../services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view-products">
      <div class="page-shell">
        <header class="page-header">
          <div>
            <h1>Costume Inventory</h1>
            <p>Curate and oversee premium looks ready for rent.</p>
          </div>
          <button type="button" class="refresh-button" (click)="refreshProducts()">
            <i class="bi bi-arrow-clockwise"></i>
            <span>Refresh</span>
          </button>
        </header>

        <div class="filter-toolbar">
          <div class="search-field">
            <i class="bi bi-search"></i>
            <input
              class="toolbar-input"
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterProducts()"
              placeholder="Search costumes by name, style, or category" />
          </div>
          <div class="toolbar-filters">
            <div class="filter-item">
              <i class="bi bi-collection"></i>
              <select
                class="filter-select"
                [(ngModel)]="filterCategory"
                (ngModelChange)="filterProducts()">
                <option value="">All categories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="filter-item">
              <i class="bi bi-aspect-ratio"></i>
              <select
                class="filter-select"
                [(ngModel)]="filterSize"
                (ngModelChange)="filterProducts()">
                <option value="">All sizes</option>
                <option *ngFor="let size of sizes" [value]="size">{{ size }}</option>
              </select>
            </div>
          </div>
        </div>

        <section class="surface-card">
          <div class="surface-header">
            <div>
              <h2>All Costumes</h2>
              <span class="surface-subtitle">Showing {{ filteredProducts.length }} items</span>
            </div>
            <span class="count-badge">{{ filteredProducts.length }}</span>
          </div>
          <div class="table-wrapper">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Costume</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Rental / Day</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th class="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody *ngIf="filteredProducts.length; else emptyState">
                <tr *ngFor="let product of filteredProducts" (click)="viewDetails(product)">
                  <td>
                    <div class="costume-cell">
                      <div class="thumb-stack" *ngIf="product.images?.length; else noThumb">
                        <ng-container *ngFor="let img of product.images | slice:0:3; let i = index">
                          <img [src]="getImageDisplayUrl(img.imageUrl)" [alt]="product.variantDescription + ' ' + i">
                        </ng-container>
                        <span class="more" *ngIf="product.images.length > 3">+{{ product.images.length - 3 }}</span>
                      </div>
                      <ng-template #noThumb>
                        <div class="fallback-thumb">
                          <i class="bi bi-image"></i>
                        </div>
                      </ng-template>
                      <div class="name-block">
                        <span class="product-primary">{{ product.variantDescription }}</span>
                        <span class="product-secondary">{{ product.style || '—' }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="category-chip">{{ product.categoryName }}</span>
                  </td>
                  <td>
                    <span class="size-pill">{{ product.size }}</span>
                  </td>
                  <td>
                    <span class="price-text">₹{{ product.rentalPricePerDay }}</span>
                  </td>
                  <td>
                    <span class="inventory-pill" [ngClass]="{
                      'inventory-safe': product.numberOfItems > 5,
                      'inventory-low': product.numberOfItems > 0 && product.numberOfItems <= 5,
                      'inventory-empty': product.numberOfItems === 0
                    }">{{ product.numberOfItems }}</span>
                  </td>
                  <td>
                    <span class="status-pill" [ngClass]="product.isRentable ? 'status-available' : 'status-out'">
                      {{ product.isRentable ? 'Available' : 'Out of Stock' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        type="button"
                        class="icon-button view"
                        data-tooltip="View details"
                        aria-label="View details"
                        (click)="viewDetails(product); $event.stopPropagation()">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        type="button"
                        class="icon-button edit"
                        data-tooltip="Edit costume"
                        aria-label="Edit costume"
                        (click)="editProduct(product); $event.stopPropagation()">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        class="icon-button delete"
                        data-tooltip="Delete costume"
                        aria-label="Delete costume"
                        (click)="deleteProduct(product); $event.stopPropagation()">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyState>
            <div class="empty-state">
              <i class="bi bi-inboxes"></i>
              <h3>No costumes match your filters</h3>
              <p>Adjust the search or filter selections to discover more looks.</p>
            </div>
          </ng-template>
        </section>
      </div>

      <!-- Edit Modal -->
      <div class="modal fade" [class.show]="isEditModalOpen" [style.display]="isEditModalOpen ? 'block' : 'none'" *ngIf="isEditModalOpen">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <h5 class="modal-title">Edit Product</h5>
                <div class="id-chips" *ngIf="editingProduct">
                  <span class="chip">Category ID: {{ editingProduct.categoryId }}</span>
                  <span class="chip">Variant ID: {{ editingProduct.variantId }}</span>
                  <span class="chip">Costume ID: {{ editingProduct.costumeId }}</span>
                </div>
              </div>
              <button type="button" class="btn-close" (click)="closeEditModal()"></button>
            </div>
            <div class="modal-body">
              <form *ngIf="editForm">
                <div class="modal-section">
                  <div class="section-title">
                    <i class="bi bi-bookmark-fill"></i>
                    <div>
                      <h6>Category Information</h6>
                      <small>Update category metadata</small>
                    </div>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Category Name</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.category.categoryName" name="categoryName">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Category Description</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.category.categoryDescription" name="categoryDescription">
                    </div>
                  </div>
                </div>

                <div class="modal-section">
                  <div class="section-title">
                    <i class="bi bi-person-vcard"></i>
                    <div>
                      <h6>Variant Details</h6>
                      <small>Primary product information</small>
                    </div>
                  </div>
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Product Name</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.variant.variantDescription" name="variantDescription">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Style</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.variant.style" name="style">
                    </div>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label">Primary Color</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.variant.primaryColor" name="primaryColor">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Secondary Color</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.variant.secondaryColor" name="secondaryColor">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Tertiary Color</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.variant.tertiaryColor" name="tertiaryColor">
                    </div>
                  </div>
                </div>

                <div class="modal-section">
                  <div class="section-title">
                    <i class="bi bi-box-seam"></i>
                    <div>
                      <h6>Costume & Pricing</h6>
                      <small>Inventory and financials</small>
                    </div>
                  </div>
                  <div class="row g-3 mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Size</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.costume.size" name="size">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Serial Number</label>
                      <input type="text" class="form-control" [(ngModel)]="editForm.costume.serialNumber" name="serialNumber">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Quantity</label>
                      <input type="number" class="form-control" [(ngModel)]="editForm.costume.numberOfItems" name="numberOfItems">
                    </div>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label">Rental Price/Day (₹)</label>
                      <input type="number" class="form-control" [(ngModel)]="editForm.costume.rentalPricePerDay" name="rentalPricePerDay">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Deposit (₹)</label>
                      <input type="number" class="form-control" [(ngModel)]="editForm.costume.deposit" name="deposit">
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Purchase Price (₹)</label>
                      <input type="number" class="form-control" [(ngModel)]="editForm.costume.purchasePrice" name="purchasePrice">
                    </div>
                  </div>
                  <div class="form-check form-switch mt-3">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="editForm.costume.isRentable" name="isRentable">
                    <label class="form-check-label">Available for Rent</label>
                  </div>
                </div>

                <div class="modal-section">
                  <div class="section-title">
                    <i class="bi bi-tools"></i>
                    <div>
                      <h6>Costume Parts</h6>
                      <small *ngIf="editForm.items?.length">{{ editForm.items.length }} parts</small>
                    </div>
                  </div>
                  <ng-container *ngIf="editForm.items?.length; else noParts">
                    <div class="item-grid">
                      <div class="item-card" *ngFor="let item of editForm.items; let idx = index">
                        <div class="row g-2">
                          <div class="col-md-6">
                            <label class="form-label">Part Name</label>
                            <input type="text" class="form-control" [(ngModel)]="item.itemName" [name]="'itemName' + idx">
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Image URL</label>
                            <div class="d-flex gap-2">
                              <input type="text" class="form-control" [(ngModel)]="item.imageUrl" [name]="'itemImage' + idx">
                              <button type="button" class="btn btn-outline-danger btn-sm" title="Clear URL" (click)="item.imageUrl = ''"><i class="bi bi-x"></i></button>
                            </div>
                            <input type="file" class="form-control mt-2" accept="image/*" (change)="onEditItemImageSelect(idx, $event)" />
                            <div class="mt-2" *ngIf="itemImagePreviews[idx]">
                              <div class="thumb" style="position:relative; display:inline-block;">
                                <img [src]="itemImagePreviews[idx]" alt="item image" style="width:60px; height:60px; object-fit:cover; border-radius:4px; border:1px solid #dee2e6;" />
                                <button type="button" class="thumb-remove" style="position:absolute; top:-5px; right:-5px; background:white; border:1px solid #ccc; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; padding:0; cursor:pointer;" (click)="removeEditItemImage(idx)">
                                  <i class="bi bi-x" style="font-size:14px;"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Rental Price/Day</label>
                            <input type="number" class="form-control" [(ngModel)]="item.rentalPricePerDay" [name]="'itemRentalPrice' + idx">
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Deposit</label>
                            <input type="number" class="form-control" [(ngModel)]="item.deposit" [name]="'itemDeposit' + idx">
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-container>
                  <ng-template #noParts>
                    <p class="muted-text">No costume parts linked to this product.</p>
                  </ng-template>
                </div>

                <div class="modal-section">
                  <div class="section-title">
                    <i class="bi bi-images"></i>
                    <div>
                      <h6>Gallery</h6>
                      <small *ngIf="editForm.images?.length">{{ editForm.images.length }} images</small>
                    </div>
                  </div>
                  <div class="image-grid" *ngIf="editForm.images?.length">
                    <div class="image-card" *ngFor="let image of editForm.images; let ix = index">
                      <div class="image-preview">
                        <img [src]="getImageDisplayUrl(image.imageUrl) || 'https://via.placeholder.com/120'" alt="Costume image">
                        <button type="button" class="btn-remove-image" (click)="removeImage(ix)" title="Remove Image">
                          <i class="bi bi-x"></i>
                        </button>
                      </div>
                      <input type="text" class="form-control mt-2" [(ngModel)]="image.imageUrl" [name]="'imageUrl' + ix" placeholder="Image URL">
                      <input type="file" class="form-control mt-2" accept="image/*" (change)="onEditImageSelect(ix, $event)" />
                      <small class="text-muted">Choose a new image or update the URL above</small>
                    </div>
                  </div>
                  <p class="muted-text" *ngIf="!editForm.images?.length">No images uploaded for this costume.</p>
                  <button type="button" class="btn btn-outline-primary mt-3" (click)="addNewImage()">
                    <i class="bi bi-plus-circle"></i> Add Image
                  </button>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeEditModal()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveEdit()">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" [class.show]="isEditModalOpen" *ngIf="isEditModalOpen"></div>
    </div>
  `,
  styles: [`
    .view-products 
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-shell {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: clamp(1.5rem, 2.5vw, 2.25rem);
      max-width: 1280px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: clamp(1rem, 2vw, 1.5rem);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.15);
    }

    .page-header h1 {
      margin: 0;
      font-size: clamp(1.6rem, 3vw, 2rem);
      font-weight: 600;
      color: #1f2937;
    }

    .page-header p {
      margin: 0.35rem 0 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .refresh-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.3rem;
      border-radius: 14px;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #fff;
      border: none;
      font-weight: 600;
      letter-spacing: 0.01em;
      box-shadow: 0 12px 18px rgba(79, 70, 229, 0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .refresh-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 28px rgba(79, 70, 229, 0.28);
    }

    .refresh-button i {
      font-size: 1.1rem;
    }

    .filter-toolbar {
      display: flex;
      align-items: center;
      gap: clamp(0.75rem, 2vw, 1.2rem);
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.15);
      backdrop-filter: blur(12px);
      position: sticky;
      top: clamp(0.5rem, 2vw, 1.25rem);
      z-index: 15;
    }

    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.15rem;
      background: linear-gradient(135deg, #f9fbff 0%, #f6f7fb 100%);
      border-radius: 14px;
      border: 1px solid rgba(99, 102, 241, 0.2);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
      color: #475569;
    }

    .search-field i {
      color: #6366f1;
      font-size: 1rem;
    }

    .toolbar-input {
      flex: 1;
      border: none;
      background: transparent;
      color: #1f2937;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .toolbar-input::placeholder {
      color: #94a3b8;
    }

    .toolbar-input:focus {
      outline: none;
    }

    .toolbar-filters {
      display: flex;
      align-items: stretch;
      gap: 0.75rem;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      background: linear-gradient(135deg, #ffffff 0%, #f8f8ff 100%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
      color: #475569;
      min-width: 160px;
      position: relative;
    }

    .filter-item i {
      color: #818cf8;
    }

    .filter-select {
      flex: 1;
      border: none;
      background: transparent;
      color: #1f2937;
      font-weight: 500;
      font-size: 0.95rem;
      appearance: none;
      padding-right: 1.5rem;
    }

    .filter-select:focus {
      outline: none;
    }

    .filter-item::after {
      content: '\\f282';
      font-family: 'bootstrap-icons';
      position: absolute;
      right: 0.9rem;
      font-size: 0.85rem;
      color: #94a3b8;
      pointer-events: none;
    }

    .surface-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 22px;
      padding: clamp(1.25rem, 2vw, 1.75rem);
      border: 1px solid rgba(148, 163, 184, 0.12);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .surface-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      padding-bottom: 1rem;
    }

    .surface-header h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: 0.01em;
    }

    .surface-subtitle {
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 14px 28px rgba(99, 102, 241, 0.22);
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 760px;
      font-size: 0.95rem;
      color: #1e293b;
    }

    .modern-table thead tr {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    }

    .modern-table thead th {
      padding: 1rem 1.25rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-align: left;
      color: #312e81;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      position: sticky;
      top: 0;
      z-index: 5;
    }

    .modern-table tbody tr {
      background: rgba(255, 255, 255, 0.75);
      transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
      cursor: pointer;
    }

    .modern-table tbody tr:nth-child(even) {
      background: rgba(248, 250, 255, 0.85);
    }

    .modern-table tbody tr:hover {
      background: rgba(238, 242, 255, 0.85);
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.08);
    }

    .modern-table tbody td {
      padding: 1rem 1.25rem;
      vertical-align: middle;
      border-bottom: 1px solid rgba(226, 232, 240, 0.7);
    }

    .modern-table tbody tr:last-child td {
      border-bottom: none;
    }

    .costume-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 240px;
    }

    .thumb-stack {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .thumb-stack img {
      width: 58px;
      height: 58px;
      object-fit: cover;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      box-shadow: 0 6px 12px rgba(100, 116, 139, 0.12);
    }

    .thumb-stack .more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.12);
      color: #4338ca;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0 0.75rem;
    }

    .fallback-thumb {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      background: linear-gradient(145deg, rgba(99, 102, 241, 0.16) 0%, rgba(129, 140, 248, 0.28) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6366f1;
      font-size: 1.4rem;
    }

    .name-block {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .product-primary {
      font-weight: 600;
      color: #1e293b;
    }

    .product-secondary {
      color: #94a3b8;
      font-size: 0.85rem;
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      background: rgba(14, 165, 233, 0.12);
      color: #0369a1;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .size-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: rgba(15, 118, 110, 0.12);
      color: #0f766e;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.02em;
    }

    .price-text {
      font-weight: 600;
      color: #4338ca;
    }

    .inventory-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      padding: 0.35rem 0.65rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 0.02em;
    }

    .inventory-safe {
      background: rgba(22, 163, 74, 0.14);
      color: #166534;
    }

    .inventory-low {
      background: rgba(253, 224, 71, 0.22);
      color: #b45309;
    }

    .inventory-empty {
      background: rgba(248, 113, 113, 0.18);
      color: #b91c1c;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 0.02em;
    }

    .status-available {
      background: rgba(16, 185, 129, 0.18);
      color: #047857;
    }

    .status-out {
      background: rgba(248, 113, 113, 0.18);
      color: #b91c1c;
    }

    .actions-header {
      text-align: right;
    }

    .action-buttons {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      justify-content: flex-end;
    }

    .icon-button {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 14px;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      cursor: pointer;
    }

    .icon-button.view {
      background: rgba(59, 130, 246, 0.12);
      color: #1d4ed8;
    }

    .icon-button.edit {
      background: rgba(34, 197, 94, 0.12);
      color: #047857;
    }

    .icon-button.delete {
      background: rgba(248, 113, 113, 0.12);
      color: #b91c1c;
    }

    .icon-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.15);
    }

    .icon-button.view:hover {
      background: rgba(59, 130, 246, 0.2);
    }

    .icon-button.edit:hover {
      background: rgba(34, 197, 94, 0.2);
    }

    .icon-button.delete:hover {
      background: rgba(248, 113, 113, 0.24);
    }

    .icon-button::after {
      content: attr(data-tooltip);
      position: absolute;
      left: 50%;
      bottom: calc(100% + 8px);
      transform: translate(-50%, -6px);
      background: rgba(15, 23, 42, 0.9);
      color: #f8fafc;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.35rem 0.6rem;
      border-radius: 8px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease, transform 0.15s ease;
      z-index: 20;
    }

    .icon-button:hover::after {
      opacity: 1;
      transform: translate(-50%, -2px);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
      padding: 4rem 1rem;
      color: #94a3b8;
    }

    .empty-state i {
      font-size: 3rem;
      color: #6366f1;
    }

    .empty-state h3 {
      margin: 0;
      font-weight: 600;
      color: #1e293b;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.95rem;
    }

    .modal {
      z-index: 1050;
    }

    .modal-backdrop {
      z-index: 1040;
      background-color: rgba(15, 23, 42, 0.55);
    }

    .modal-content {
      border-radius: 18px;
      border: none;
      box-shadow: 0 30px 68px rgba(15, 23, 42, 0.35);
    }

    .modal-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #fff;
      border-radius: 18px 18px 0 0;
      border-bottom: none;
      padding: 1.25rem 1.5rem;
    }

    .modal-title {
      font-weight: 600;
      font-size: 1.15rem;
    }

    .btn-close {
      filter: invert(1);
      opacity: 0.7;
    }

    .btn-close:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 2rem;
      background: #f8fafc;
    }

    .modal-footer {
      border-top: 1px solid rgba(148, 163, 184, 0.25);
      padding: 1rem 2rem;
      background: #fff;
      border-radius: 0 0 18px 18px;
    }

    .form-control, .form-select {
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      padding: 0.65rem 0.85rem;
      transition: border 0.2s ease, box-shadow 0.2s ease;
    }

    .form-control:focus, .form-select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
      outline: none;
    }

    .form-check-input:checked {
      background-color: #6366f1;
      border-color: #6366f1;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .image-card {
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 12px;
      padding: 0.85rem;
      background: #fff;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
    }

    .image-preview {
      position: relative;
      width: 100%;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      background: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .btn-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background: rgba(248, 113, 113, 0.9);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-remove-image:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 20px rgba(248, 113, 113, 0.35);
    }

    .item-grid {
      display: grid;
      gap: 1rem;
    }

    .item-card {
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 12px;
      padding: 1rem;
      background: #fff;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
    }

    .muted-text {
      color: #94a3b8;
      font-style: italic;
    }

    .text-muted {
      color: #94a3b8;
      font-size: 0.85rem;
      display: block;
      margin-top: 0.2rem;
    }

    .modal-section {
      margin-bottom: 1.75rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }

    .modal-section:last-child {
      border-bottom: none;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
      color: #4338ca;
      font-weight: 600;
    }

    .section-title i {
      color: #facc15;
      font-size: 1.2rem;
    }

    .id-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .chip {
      background: rgba(99, 102, 241, 0.12);
      color: #4338ca;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    @media (max-width: 1200px) {
      .modern-table {
        min-width: 100%;
      }
    }

    @media (max-width: 992px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filter-toolbar {
        flex-direction: column;
        align-items: stretch;
        top: clamp(0.5rem, 3vw, 1rem);
      }

      .toolbar-filters {
        width: 100%;
        flex-wrap: wrap;
      }

      .filter-item {
        flex: 1 1 45%;
        min-width: 0;
      }

      .surface-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .action-buttons {
        justify-content: flex-start;
      }
    }

    @media (max-width: 768px) {
      .view-products {
        padding: 1.5rem;
      }

      .page-shell {
        gap: 1.5rem;
      }

      .search-field {
        padding: 0.75rem 1rem;
      }

      .thumb-stack img,
      .fallback-thumb {
        width: 48px;
        height: 48px;
        border-radius: 14px;
      }
    }

    @media (max-width: 576px) {
      .filter-item {
        flex: 1 1 100%;
      }

      .modern-table thead {
        display: none;
      }

      .modern-table tbody tr {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        padding: 1.1rem;
      }

      .modern-table tbody td {
        padding: 0;
        border: none;
      }

      .modern-table tbody td:nth-child(1) {
        grid-column: 1 / -1;
      }

      .action-buttons {
        justify-content: flex-start;
      }
    }
  `]
})
export class ViewProductsComponent implements OnInit {
  products: ItemResponseDto[] = [];
  filteredProducts: ItemResponseDto[] = [];
  searchTerm = '';
  filterCategory = '';
  filterSize = '';
  categories: string[] = [];
  sizes: string[] = [];

  // Edit functionality
  // Edit functionality
  isEditModalOpen = false;
  editingProduct: ItemResponseDto | null = null;
  editForm: any = {};

  // New properties for image upload in edit modal
  itemImageFiles: (File | null)[] = [];
  itemImagePreviews: (string | null)[] = [];

  // Gallery image upload properties
  galleryImageFiles: (File | null)[] = [];
  galleryImagePreviews: (string | null)[] = [];

  constructor(
    private itemService: ItemService,
    private router: Router
  ) { }

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

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.products = items;
        this.filteredProducts = items;
        this.extractFilters();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Products',
          text: 'Could not fetch products from server.',
          confirmButtonColor: '#5c1a1a'
        });
        console.error('Error loading products:', err);
      }
    });
  }

  extractFilters(): void {
    this.categories = [...new Set(this.products.map(p => p.categoryName))];
    this.sizes = [...new Set(this.products.map(p => p.size))];
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm ||
        product.variantDescription.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.style.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.filterCategory || product.categoryName === this.filterCategory;
      const matchesSize = !this.filterSize || product.size === this.filterSize;

      return matchesSearch && matchesCategory && matchesSize;
    });
  }

  refreshProducts(): void {
    this.loadProducts();
    Swal.fire({
      icon: 'success',
      title: 'Refreshed!',
      text: 'Product list has been updated.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  viewDetails(product: ItemResponseDto): void {
    const colors = [product.primaryColor, product.secondaryColor, product.tertiaryColor]
      .filter(color => !!color && color.trim().length)
      .join(', ') || 'N/A';

    const itemsHtml = product.items?.length ? `
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:0.5rem;">
        <thead>
          <tr style="background:#f1f3f5;">
            <th style="padding:6px;border:1px solid #e2e8f0;">#</th>
            <th style="padding:6px;border:1px solid #e2e8f0;">Part</th>
            <th style="padding:6px;border:1px solid #e2e8f0;">Rental/Day</th>
            <th style="padding:6px;border:1px solid #e2e8f0;">Deposit</th>
          </tr>
        </thead>
        <tbody>
          ${product.items.map((item, index) => `
            <tr>
              <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;">${index + 1}</td>
              <td style="padding:6px;border:1px solid #e2e8f0;">${item.itemName}</td>
              <td style="padding:6px;border:1px solid #e2e8f0;">₹${this.formatCurrency(item.rentalPricePerDay)}</td>
              <td style="padding:6px;border:1px solid #e2e8f0;">₹${this.formatCurrency(item.deposit)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p style="color:#6c757d;margin:0;">No costume parts added.</p>';

    const imagesHtml = product.images?.length ? `
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:0.75rem;">
        ${product.images.map(img => `
          <img src="${this.getImageDisplayUrl(img.imageUrl)}" alt="${product.variantDescription}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;" />
        `).join('')}
      </div>
    ` : '<p style="color:#6c757d;margin:0;">No images uploaded.</p>';

    const detailHtml = `
      <div style="text-align:left;line-height:1.6;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:1rem;">
          <div style="background:#f8fafc;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;">Category</p>
            <h4 style="margin:4px 0 0;color:#0f172a;font-size:16px;">${product.categoryName}</h4>
            <small style="color:#475569;">${product.categoryDescription || '—'}</small>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;">Size & Serial</p>
            <h4 style="margin:4px 0 0;color:#0f172a;font-size:16px;">${product.size} • SN ${product.serialNumber}</h4>
            <small style="color:#475569;">Quantity: ${product.numberOfItems}</small>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;">Status</p>
            <h4 style="margin:4px 0 0;color:#0f172a;font-size:16px;">${product.isRentable ? 'Available' : 'Not Available'}</h4>
            <small style="color:#475569;">Rental ₹${this.formatCurrency(product.rentalPricePerDay)} / Deposit ₹${this.formatCurrency(product.deposit)}</small>
          </div>
        </div>
        <div style="margin-bottom:1rem;">
          <h5 style="margin-bottom:0.25rem;color:#0f172a;">Variant Information</h5>
          <p style="margin:0;"><strong>Style:</strong> ${product.style}</p>
          <p style="margin:0;"><strong>Colors:</strong> ${colors}</p>
          <p style="margin:0;"><strong>Purchase Price:</strong> ₹${this.formatCurrency(product.purchasePrice)}</p>
        </div>
        <div style="margin-bottom:1rem;">
          <h5 style="margin-bottom:0.25rem;color:#0f172a;">Costume Parts</h5>
          ${itemsHtml}
        </div>
        <div>
          <h5 style="margin-bottom:0.25rem;color:#0f172a;">Image Gallery</h5>
          ${imagesHtml}
        </div>
      </div>
    `;

    Swal.fire({
      title: product.variantDescription,
      html: detailHtml,
      confirmButtonColor: '#5c1a1a',
      width: '650px'
    });
  }

  saveEdit(): void {
    if (!this.editingProduct) return;

    // Collect item images to upload
    const itemUploads: { index: number; file: File }[] = [];
    this.itemImageFiles.forEach((file, idx) => {
      if (file) {
        itemUploads.push({ index: idx, file: file as File });
      }
    });

    // Collect gallery images to upload
    const galleryUploads: { index: number; file: File }[] = [];
    this.galleryImageFiles.forEach((file, idx) => {
      if (file) {
        galleryUploads.push({ index: idx, file: file as File });
      }
    });

    const totalUploads = itemUploads.length + galleryUploads.length;

    if (totalUploads > 0) {
      Swal.fire({
        title: 'Uploading Images...',
        text: `Uploading ${totalUploads} image(s)...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Combine all files to upload
      const allFiles = [...itemUploads.map(u => u.file), ...galleryUploads.map(u => u.file)];

      this.itemService.uploadImages(allFiles).subscribe({
        next: (res) => {
          const urls = res.data || [];

          // Map item image URLs
          urls.slice(0, itemUploads.length).forEach((url: string, i: number) => {
            const originalIndex = itemUploads[i].index;
            if (this.editForm.items && this.editForm.items[originalIndex]) {
              this.editForm.items[originalIndex].imageUrl = url;
            }
          });

          // Map gallery image URLs
          urls.slice(itemUploads.length).forEach((url: string, i: number) => {
            const originalIndex = galleryUploads[i].index;
            if (this.editForm.images && this.editForm.images[originalIndex]) {
              this.editForm.images[originalIndex].imageUrl = url;
            }
          });

          Swal.close();
          this.submitEdit();
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
      this.submitEdit();
    }
  }

  submitEdit(): void {
    this.itemService.updateFullCostume(this.editingProduct!.costumeId, this.editForm).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Product details have been updated.',
          timer: 1500,
          showConfirmButton: false
        });
        this.closeEditModal();
        this.loadProducts(); // Reload to see changes
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.message || 'Could not update product.',
          confirmButtonColor: '#5c1a1a'
        });
      }
    });
  }

  editProduct(product: ItemResponseDto): void {
    this.editingProduct = product;

    // Map flat ItemResponseDto to nested structure for the form (and ItemRequestDto)
    this.editForm = {
      category: {
        categoryName: product.categoryName,
        categoryDescription: product.categoryDescription
      },
      variant: {
        variantDescription: product.variantDescription,
        style: product.style,
        primaryColor: product.primaryColor,
        secondaryColor: product.secondaryColor,
        tertiaryColor: product.tertiaryColor
      },
      costume: {
        numberOfItems: product.numberOfItems,
        size: product.size,
        serialNumber: product.serialNumber,
        purchasePrice: product.purchasePrice,
        rentalPricePerDay: product.rentalPricePerDay,
        deposit: product.deposit,
        isRentable: product.isRentable
      },
      // Deep copy items and images to avoid mutating original until save
      items: product.items ? JSON.parse(JSON.stringify(product.items)) : [],
      images: product.images ? JSON.parse(JSON.stringify(product.images)) : []
    };

    // Initialize image arrays for items
    const itemCount = this.editForm.items ? this.editForm.items.length : 0;
    this.itemImageFiles = new Array(itemCount).fill(null);
    this.itemImagePreviews = new Array(itemCount).fill(null);

    // Initialize image arrays for gallery
    const galleryCount = this.editForm.images ? this.editForm.images.length : 0;
    this.galleryImageFiles = new Array(galleryCount).fill(null);
    this.galleryImagePreviews = new Array(galleryCount).fill(null);

    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingProduct = null;
    this.editForm = {};

    // Cleanup item previews
    this.itemImagePreviews.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    this.itemImageFiles = [];
    this.itemImagePreviews = [];

    // Cleanup gallery previews
    this.galleryImagePreviews.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    this.galleryImageFiles = [];
    this.galleryImagePreviews = [];
  }

  onEditItemImageSelect(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;

    this.itemImageFiles[index] = file;

    if (this.itemImagePreviews[index]) {
      URL.revokeObjectURL(this.itemImagePreviews[index]!);
    }
    this.itemImagePreviews[index] = file ? URL.createObjectURL(file) : null;
  }

  removeEditItemImage(index: number): void {
    if (this.itemImagePreviews[index]) {
      URL.revokeObjectURL(this.itemImagePreviews[index]!);
    }
    this.itemImagePreviews[index] = null;
    this.itemImageFiles[index] = null;
  }

  // Helper for currency formatting
  formatCurrency(value: number): string {
    return (value || 0).toLocaleString('en-IN');
  }

  // Remove gallery image (just removes from array, needs save to persist)
  removeImage(index: number): void {
    if (this.editForm.images) {
      this.editForm.images.splice(index, 1);
    }
  }

  // Add new image to gallery
  addNewImage(): void {
    if (!this.editForm.images) {
      this.editForm.images = [];
    }
    this.editForm.images.push({ imageUrl: '' });
  }

  // Handle gallery image file selection
  onEditImageSelect(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;

    // Ensure arrays are large enough
    while (this.galleryImageFiles.length <= index) {
      this.galleryImageFiles.push(null);
    }
    while (this.galleryImagePreviews.length <= index) {
      this.galleryImagePreviews.push(null);
    }

    this.galleryImageFiles[index] = file;

    // Revoke old preview if exists
    if (this.galleryImagePreviews[index]) {
      URL.revokeObjectURL(this.galleryImagePreviews[index]!);
    }

    // Create preview for new file
    if (file) {
      this.galleryImagePreviews[index] = URL.createObjectURL(file);
      // Update the image URL in editForm to show preview
      if (this.editForm.images && this.editForm.images[index]) {
        this.editForm.images[index].imageUrl = this.galleryImagePreviews[index];
      }
    } else {
      this.galleryImagePreviews[index] = null;
    }
  }

  deleteProduct(product: ItemResponseDto): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${product.variantDescription}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itemService.deleteCostume(product.costumeId).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been deleted successfully.',
              confirmButtonColor: '#5c1a1a'
            });
            this.loadProducts();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: err.error?.message || 'Failed to delete product.',
              confirmButtonColor: '#5c1a1a'
            });
          }
        });
      }
    });
  }
}
