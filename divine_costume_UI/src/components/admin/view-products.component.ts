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
                        class="btn btn-sm btn-outline-primary"
                        (click)="viewDetails(product)"
                        title="View Details">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-warning"
                        (click)="editProduct(product)"
                        title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        (click)="deleteProduct(product)"
                        title="Delete">
                        <i class="bi bi-trash"></i>
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
    Swal.fire({
      title: product.variantDescription,
      html: `
        <div style="text-align: left;">
          <p><strong>Category:</strong> ${product.categoryName}</p>
          <p><strong>Style:</strong> ${product.style}</p>
          <p><strong>Colors:</strong> ${product.primaryColor}, ${product.secondaryColor || 'N/A'}, ${product.tertiaryColor || 'N/A'}</p>
          <p><strong>Size:</strong> ${product.size}</p>
          <p><strong>Serial Number:</strong> ${product.serialNumber}</p>
          <p><strong>Available Quantity:</strong> ${product.numberOfItems}</p>
          <p><strong>Purchase Price:</strong> ₹${product.purchasePrice}</p>
          <p><strong>Rental Price/Day:</strong> ₹${product.rentalPricePerDay}</p>
          <p><strong>Deposit Amount:</strong> ₹${product.deposit}</p>
          <p><strong>Status:</strong> ${product.isRentable ? 'Available for Rent' : 'Not Available'}</p>
        </div>
      `,
      confirmButtonColor: '#5c1a1a',
      width: '600px'
    });
  }

  editProduct(product: ItemResponseDto): void {
    Swal.fire({
      title: 'Edit Product',
      text: 'Edit functionality will be implemented here.',
      icon: 'info',
      confirmButtonColor: '#5c1a1a'
    });
    // TODO: Implement edit functionality
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
