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
      <!-- Search and Filter Section -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="filterProducts()"
                  placeholder="Search by product name, style, or category...">
              </div>
            </div>
            <div class="col-md-3">
              <select 
                class="form-select" 
                [(ngModel)]="filterCategory"
                (ngModelChange)="filterProducts()">
                <option value="">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <select 
                class="form-select" 
                [(ngModel)]="filterSize"
                (ngModelChange)="filterProducts()">
                <option value="">All Sizes</option>
                <option *ngFor="let size of sizes" [value]="size">{{ size }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">All Products ({{ filteredProducts.length }})</h5>
            <button class="btn btn-sm btn-primary" (click)="refreshProducts()">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Rental Price/Day</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of filteredProducts">
                  <td>
                    <div class="thumbs" *ngIf="product.images?.length; else noImg">
                      <ng-container *ngFor="let img of product.images | slice:0:4; let i = index">
                        <img [src]="img.imageUrl" [alt]="product.variantDescription + ' ' + i">
                      </ng-container>
                      <span class="more" *ngIf="product.images.length > 4">+{{ product.images.length - 4 }}</span>
                    </div>
                    <ng-template #noImg>
                      <img src="https://via.placeholder.com/60" alt="no image" class="product-img">
                    </ng-template>
                  </td>
                  <td>
                    <strong>{{ product.variantDescription }}</strong>
                    <br>
                    <small class="text-muted">{{ product.style }}</small>
                  </td>
                  <td>{{ product.categoryName }}</td>
                  <td>
                    <span class="badge bg-secondary">{{ product.size }}</span>
                  </td>
                  <td class="text-primary fw-bold">₹{{ product.rentalPricePerDay }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': product.numberOfItems > 5,
                      'bg-warning': product.numberOfItems > 0 && product.numberOfItems <= 5,
                      'bg-danger': product.numberOfItems === 0
                    }">{{ product.numberOfItems }}</span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': product.isRentable,
                      'bg-secondary': !product.isRentable
                    }">{{ product.isRentable ? 'Available' : 'Not Available' }}</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn btn-icon view"
                        (click)="viewDetails(product)"
                        title="View Details">
                        <i class="bi bi-eye-fill"></i>
                      </button>
                      <button 
                        class="btn btn-icon edit"
                        (click)="editProduct(product)"
                        title="Edit">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        class="btn btn-icon delete"
                        (click)="deleteProduct(product)"
                        title="Delete">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredProducts.length === 0">
                  <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                    <p class="mt-2">No products found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
                            <input type="text" class="form-control" [(ngModel)]="item.imageUrl" [name]="'itemImage' + idx">
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
                  <ng-container *ngIf="editForm.images?.length; else noImages">
                    <div class="image-grid">
                      <div class="image-card" *ngFor="let image of editForm.images; let ix = index">
                        <img [src]="image.imageUrl || 'https://via.placeholder.com/120'" alt="Costume image">
                        <input type="text" class="form-control" [(ngModel)]="image.imageUrl" [name]="'imageUrl' + ix" placeholder="Image URL">
                      </div>
                    </div>
                  </ng-container>
                  <ng-template #noImages>
                    <p class="muted-text">No images uploaded for this costume.</p>
                  </ng-template>
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
    .view-products {
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
      background: #fff;
      border-bottom: 1px solid #e9ecef;
      padding: 1.25rem 1.5rem;
      border-radius: 12px 12px 0 0;
    }

    .card-header h5 {
      color: #5c1a1a;
      font-weight: 600;
    }

    .card-body {
      padding: 1.5rem;
    }

    .search-box {
      position: relative;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    .search-box .form-control {
      padding-left: 2.75rem;
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

    .table {
      margin: 0;
    }

    .table thead th {
      background: #f8f9fa;
      color: #5c1a1a;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
      padding: 0.875rem;
      white-space: nowrap;
    }

    .table tbody td {
      padding: 0.875rem;
      vertical-align: middle;
    }

    .product-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .thumbs { display: flex; align-items: center; gap: 6px; }
    .thumbs img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #dee2e6; }
    .thumbs .more { font-size: 0.8rem; color: #6c757d; background: #f1f3f5; border: 1px solid #dee2e6; border-radius: 6px; padding: 0.25rem 0.5rem; }

    .badge {
      padding: 0.375rem 0.75rem;
      font-weight: 500;
      font-size: 0.75rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.375rem 0.625rem;
      font-size: 0.875rem;
      border-radius: 6px;
    }

    .btn-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      padding: 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .btn-icon.view {
      background: rgba(13, 110, 253, 0.15);
      color: #0d6efd;
      border: 1px solid rgba(13, 110, 253, 0.25);
    }

    .btn-icon.edit {
      background: rgba(255, 193, 7, 0.15);
      color: #c28100;
      border: 1px solid rgba(255, 193, 7, 0.35);
    }

    .btn-icon.delete {
      background: rgba(220, 53, 69, 0.15);
      color: #b3182a;
      border: 1px solid rgba(220, 53, 69, 0.3);
    }

    .btn-icon:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
      background: rgba(0, 0, 0, 0.05);
    }

    .btn-outline-primary {
      color: #0d6efd;
      border-color: #0d6efd;
    }

    .btn-outline-primary:hover {
      background: #0d6efd;
      color: #fff;
    }

    .btn-outline-warning {
      color: #ffc107;
      border-color: #ffc107;
    }

    .btn-outline-warning:hover {
      background: #ffc107;
      color: #000;
    }

    .btn-outline-danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn-outline-danger:hover {
      background: #dc3545;
      color: #fff;
    }

    .btn-primary {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      border: none;
      color: #fff;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4a1515 0%, #6a1e1e 100%);
    }

    /* Modal Styles */
    .modal {
      z-index: 1050;
    }

    .modal-backdrop {
      z-index: 1040;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      color: #fff;
      border-radius: 12px 12px 0 0;
      border-bottom: none;
    }

    .modal-title {
      font-weight: 600;
    }

    .btn-close {
      filter: invert(1);
    }

    .modal-body {
      padding: 2rem;
    }

    .modal-footer {
      border-top: 1px solid #e9ecef;
      padding: 1rem 2rem;
    }

    .form-check-input:checked {
      background-color: #5c1a1a;
      border-color: #5c1a1a;
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
  isEditModalOpen = false;
  editingProduct: ItemResponseDto | null = null;
  editForm: any = {};

  constructor(
    private itemService: ItemService,
    private router: Router
  ) {}

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
          <img src="${img.imageUrl}" alt="${product.variantDescription}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;" />
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

  editProduct(product: ItemResponseDto): void {
    this.editingProduct = product;
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
      items: product.items?.map(item => ({
        itemName: item.itemName,
        rentalPricePerDay: item.rentalPricePerDay,
        deposit: item.deposit,
        imageUrl: item.imageUrl
      })) || [],
      images: product.images?.map(img => ({
        imageUrl: img.imageUrl
      })) || []
    };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingProduct = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingProduct) return;

    this.itemService.updateFullCostume(this.editingProduct.costumeId, this.editForm).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully!',
          text: 'Product has been updated.',
          confirmButtonColor: '#5c1a1a'
        });
        this.closeEditModal();
        this.loadProducts();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.message || 'Failed to update product.',
          confirmButtonColor: '#5c1a1a'
        });
      }
    });
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

  private formatCurrency(value?: number): string {
    if (value === null || value === undefined) {
      return '0';
    }
    return Number(value).toLocaleString('en-IN');
  }
}
