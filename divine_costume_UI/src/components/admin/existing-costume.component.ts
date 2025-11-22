import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { 
  InventoryService, 
  Category, 
  VariantDescription, 
  Size, 
  CostumeInventory,
  ToastMessage 
} from '../../services/inventory.service';

@Component({
  selector: 'app-existing-costume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="existing-costume-container">
      <!-- Toast Notification -->
      <div class="toast-container" *ngIf="currentToast">
        <div class="toast" [class]="'toast-' + currentToast.type">
          <div class="toast-content">
            <i class="bi" [class]="getToastIcon(currentToast.type)"></i>
            <span>{{ currentToast.message }}</span>
          </div>
          <button class="toast-close" (click)="inventoryService.clearToast()">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <div class="page-header">
        <h2>Existing Costume Inventory</h2>
        <p class="subtitle">Manage and browse your costume inventory with dynamic filtering</p>
      </div>

      <!-- Loading Spinner -->
      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading inventory data...</p>
      </div>

      <!-- Cascading Dropdowns Section -->
      <div class="filters-section" *ngIf="!isLoading">
        <div class="dropdown-row">
          <!-- Category Dropdown -->
          <div class="dropdown-group">
            <label for="category">Category</label>
            <div class="dropdown-wrapper">
              <select 
                id="category" 
                [(ngModel)]="selectedCategory" 
                (change)="onCategoryChange()" 
                class="form-select dropdown-enhanced"
                [disabled]="categoriesLoading">
                <option value="">{{ categoriesLoading ? 'Loading categories...' : 'Select Category' }}</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{ category.categoryName }}
                </option>
              </select>
              <div class="dropdown-spinner" *ngIf="categoriesLoading">
                <div class="mini-spinner"></div>
              </div>
            </div>
          </div>

          <!-- Variant Description Dropdown -->
          <div class="dropdown-group">
            <label for="variant">Variant Description</label>
            <div class="dropdown-wrapper">
              <select 
                id="variant" 
                [(ngModel)]="selectedVariant" 
                (change)="onVariantChange()" 
                class="form-select dropdown-enhanced"
                [disabled]="!selectedCategory || variantsLoading">
                <option value="">{{ variantsLoading ? 'Loading variants...' : 'Select Variant' }}</option>
                <option *ngFor="let variant of filteredVariants" [value]="variant.id">
                  {{ variant.variantDescription }}
                </option>
              </select>
              <div class="dropdown-spinner" *ngIf="variantsLoading">
                <div class="mini-spinner"></div>
              </div>
            </div>
          </div>

          <!-- Size Dropdown -->
          <div class="dropdown-group">
            <label for="size">Size</label>
            <div class="dropdown-wrapper">
              <select 
                id="size" 
                [(ngModel)]="selectedSize" 
                (change)="onSizeChange()" 
                class="form-select dropdown-enhanced"
                [disabled]="!selectedVariant || sizesLoading">
                <option value="">{{ sizesLoading ? 'Loading sizes...' : 'Select Size' }}</option>
                <option *ngFor="let size of filteredSizes" [value]="size.id">
                  {{ size.size }} ({{ size.availableCount }} available)
                </option>
              </select>
              <div class="dropdown-spinner" *ngIf="sizesLoading">
                <div class="mini-spinner"></div>
              </div>
            </div>
          </div>

          <!-- Count Input -->
          <div class="dropdown-group">
            <label for="count">Count</label>
            <input 
              type="number" 
              id="count" 
              [(ngModel)]="selectedCount" 
              (input)="onCountChange()"
              class="form-control"
              [max]="maxAvailableCount"
              min="0"
              [disabled]="!selectedSize"
              placeholder="Enter count">
            <div class="count-hint" *ngIf="selectedSize && selectedCount > 0">
              <span class="hint-text">{{ getCountHint() }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button 
            class="btn btn-primary" 
            (click)="addToInventoryTable()"
            [disabled]="!canAddToTable()">
            <i class="bi bi-plus-circle"></i>
            Add to Table
          </button>
          <button 
            class="btn btn-secondary" 
            (click)="clearFilters()">
            <i class="bi bi-arrow-clockwise"></i>
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Dynamic Inventory Table -->
      <div class="table-section">
        <div class="table-header">
          <h3>Costume Inventory</h3>
          <div class="table-stats">
            <span class="stat-item">Total Items: {{ inventoryData.length }}</span>
            <span class="stat-item">Total Count: {{ getTotalCount() }}</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="inventory-table" *ngIf="inventoryData.length > 0; else noDataTemplate">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category</th>
                <th>Variant Description</th>
                <th>Size</th>
                <th>Count</th>
                <th>Serial Numbers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of inventoryData; let i = index" class="inventory-row" [attr.data-item-id]="item.id">
                <td class="image-cell">
                  <img 
                    [src]="item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREREREQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS02LTYtNiA2Ii8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAweiIvPgo8L3N2Zz4KPC9zdmc+'" 
                    [alt]="item.variantDescription"
                    class="costume-image"
                    (error)="onImageError($event)">
                </td>
                <td class="category-cell">{{ item.categoryName }}</td>
                <td class="variant-cell">{{ item.variantDescription }}</td>
                <td class="size-cell">
                  <span class="size-badge">{{ item.size }}</span>
                </td>
                <td class="count-cell">
                  <input 
                    type="number" 
                    [(ngModel)]="item.count" 
                    (input)="onTableCountChange(i)"
                    class="count-input"
                    min="0">
                </td>
                <td class="serial-cell">
                  <div class="serial-numbers">
                    <span *ngFor="let serial of item.serialNumbers" class="serial-tag">
                      {{ serial }}
                    </span>
                  </div>
                </td>
                <td class="actions-cell">
                  <button 
                    class="btn btn-sm btn-success" 
                    (click)="addCostumePart(item)"
                    title="Add Costume Part">
                    <i class="bi bi-plus"></i>
                    Add Part
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    (click)="removeFromTable(i)"
                    title="Remove from table">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <ng-template #noDataTemplate>
            <div class="no-data">
              <i class="bi bi-inbox"></i>
              <h4>No Inventory Data</h4>
              <p>Select category, variant, and size to view inventory items</p>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Add Costume Part Modal -->
      <div class="modal" [class.show]="showAddPartModal" *ngIf="showAddPartModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Costume Part</h5>
              <button type="button" class="btn-close" (click)="closeAddPartModal()"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="partName">Part Name</label>
                  <input 
                    type="text" 
                    id="partName" 
                    [(ngModel)]="newPart.name" 
                    name="partName"
                    class="form-control" 
                    placeholder="Enter part name">
                </div>
                <div class="form-group">
                  <label for="partDescription">Description</label>
                  <textarea 
                    id="partDescription" 
                    [(ngModel)]="newPart.description" 
                    name="partDescription"
                    class="form-control" 
                    rows="3" 
                    placeholder="Enter part description"></textarea>
                </div>
                <div class="form-group">
                  <label for="partQuantity">Quantity</label>
                  <input 
                    type="number" 
                    id="partQuantity" 
                    [(ngModel)]="newPart.quantity" 
                    name="partQuantity"
                    class="form-control" 
                    min="1" 
                    [max]="selectedInventoryItem?.count || 1">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeAddPartModal()">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" (click)="saveCostumePart()">
                <i class="bi bi-save"></i>
                Save Part
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .existing-costume-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }


    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .page-header h2 {
      color: #7A1F2A;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .filters-section {
      background: #FFF8EE;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .dropdown-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .dropdown-group {
      display: flex;
      flex-direction: column;
    }

    .dropdown-group label {
      font-weight: 600;
      color: #7A1F2A;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .form-select, .form-control {
      padding: 0.75rem;
      border: 2px solid #D4AF37;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-select:focus, .form-control:focus {
      outline: none;
      border-color: #7A1F2A;
      box-shadow: 0 0 0 3px rgba(122, 31, 42, 0.1);
    }

    .form-select:disabled, .form-control:disabled {
      background: #f8f9fa;
      border-color: #dee2e6;
      color: #6c757d;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #D4AF37;
      color: #7A1F2A;
    }

    .btn-primary:hover:not(:disabled) {
      background: #C49D2E;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .table-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .table-header h3 {
      color: #7A1F2A;
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
    }

    .table-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      background: #FFF8EE;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      color: #7A1F2A;
      font-size: 0.9rem;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .inventory-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .inventory-table th {
      background: #7A1F2A;
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #D4AF37;
    }

    .inventory-table td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      vertical-align: middle;
    }

    .inventory-row:hover {
      background: #FFF8EE;
    }

    .costume-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #D4AF37;
    }

    .size-badge {
      background: #D4AF37;
      color: #7A1F2A;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .count-input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #D4AF37;
      border-radius: 4px;
      text-align: center;
    }

    .serial-numbers {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .serial-tag {
      background: #e9ecef;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #495057;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #218838;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .no-data {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }

    .no-data i {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: #D4AF37;
    }

    .no-data h4 {
      margin-bottom: 0.5rem;
    }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .modal.show {
      opacity: 1;
    }

    .modal-dialog {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      color: #7A1F2A;
      font-weight: 700;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6c757d;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #7A1F2A;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    /* Toast Notification Styles */
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 0.5rem;
      animation: fadeIn 0.3s ease;
    }

    .toast-success {
      background: #d4edda;
      border-left: 4px solid #28a745;
      color: #155724;
    }

    .toast-error {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
      color: #721c24;
    }

    .toast-warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      color: #856404;
    }

    .toast-info {
      background: #d1ecf1;
      border-left: 4px solid #17a2b8;
      color: #0c5460;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 1;
    }

    /* Loading Spinner Styles */
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #7A1F2A;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #D4AF37;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    .mini-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #D4AF37;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* Enhanced Dropdown Styles */
    .dropdown-wrapper {
      position: relative;
    }

    .dropdown-enhanced {
      position: relative !important;
      display: block !important;
      margin-top: 5px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dropdown-enhanced:focus {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }

    .dropdown-spinner {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Count Hint Styles */
    .count-hint {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(212, 175, 55, 0.1);
      border-radius: 6px;
      border-left: 3px solid #D4AF37;
    }

    .hint-text {
      font-size: 0.85rem;
      color: #7A1F2A;
      font-weight: 600;
    }

    /* Success Highlight Animation */
    .success-highlight {
      background: rgba(40, 167, 69, 0.2) !important;
      animation: successPulse 2s ease;
    }

    /* Animations */
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes successPulse {
      0%, 100% { background: rgba(40, 167, 69, 0.2); }
      50% { background: rgba(40, 167, 69, 0.4); }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .existing-costume-container {
        padding: 1rem;
      }

      .page-header h2 {
        font-size: 2rem;
      }

      .dropdown-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .table-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .table-stats {
        flex-direction: column;
        gap: 0.5rem;
      }

      .inventory-table {
        font-size: 0.85rem;
      }

      .inventory-table th,
      .inventory-table td {
        padding: 0.5rem;
      }

      .actions-cell {
        flex-direction: column;
      }

      .modal-dialog {
        width: 95%;
        margin: 1rem;
      }

      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
      }

      .toast {
        min-width: auto;
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .costume-image {
        width: 40px;
        height: 40px;
      }

      .serial-numbers {
        max-width: 100px;
      }

      .count-input {
        width: 60px;
      }
    }
  `]
})
export class ExistingCostumeComponent implements OnInit, OnDestroy {
  // Data arrays
  categories: Category[] = [];
  variants: VariantDescription[] = [];
  sizes: Size[] = [];
  inventoryData: CostumeInventory[] = [];

  // Filtered arrays based on selections
  filteredVariants: VariantDescription[] = [];
  filteredSizes: Size[] = [];

  // Selected values
  selectedCategory: number | null = null;
  selectedVariant: number | null = null;
  selectedSize: number | null = null;
  selectedCount: number = 0;
  maxAvailableCount: number = 0;
  currentAvailableCount: number = 0;

  // Loading states
  isLoading: boolean = true;
  categoriesLoading: boolean = false;
  variantsLoading: boolean = false;
  sizesLoading: boolean = false;

  // Modal state
  showAddPartModal: boolean = false;
  selectedInventoryItem: CostumeInventory | null = null;
  newPart = {
    name: '',
    description: '',
    quantity: 1
  };

  // Toast and subscriptions
  currentToast: ToastMessage | null = null;
  private subscriptions: Subscription[] = [];

  constructor(public inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.setupToastSubscription();
    this.loadCategories();
    this.loadInitialInventory();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupToastSubscription(): void {
    const toastSub = this.inventoryService.toast$.subscribe(toast => {
      this.currentToast = toast;
    });
    this.subscriptions.push(toastSub);
  }

  // API calls with proper error handling
  loadCategories(): void {
    this.categoriesLoading = true;
    const categorySub = this.inventoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = this.inventoryService.dedupeCategoriesByName(categories);
        this.categoriesLoading = false;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.categoriesLoading = false;
        this.isLoading = false;
        this.inventoryService.showError('Failed to load categories. Please refresh the page.');
        console.error('Error loading categories:', error);
      }
    });
    this.subscriptions.push(categorySub);
  }

  loadInitialInventory(): void {
    // Initialize with empty array - real data will come from API calls
    this.inventoryData = [];
  }

  // Enhanced event handlers with proper cascading logic
  onCategoryChange(): void {
    // Clear dependent dropdowns
    this.selectedVariant = null;
    this.selectedSize = null;
    this.selectedCount = 0;
    this.maxAvailableCount = 0;
    this.currentAvailableCount = 0;
    this.filteredVariants = [];
    this.filteredSizes = [];

    if (this.selectedCategory) {
      this.variantsLoading = true;
      const variantSub = this.inventoryService.getVariantsByCategory(this.selectedCategory).subscribe({
        next: (variants: VariantDescription[]) => {
          this.filteredVariants = this.inventoryService.dedupeVariantsByDescription(variants);
          this.variantsLoading = false;
        },
        error: (error: any) => {
          this.variantsLoading = false;
          this.inventoryService.showError('Failed to load variants for selected category.');
          console.error('Error loading variants:', error);
        }
      });
      this.subscriptions.push(variantSub);

      // Load inventory for selected category
      this.refreshInventory();
    }
  }

  onVariantChange(): void {
    // Clear dependent dropdowns only
    this.selectedSize = null;
    this.selectedCount = 0;
    this.maxAvailableCount = 0;
    this.currentAvailableCount = 0;
    this.filteredSizes = [];

    if (this.selectedVariant) {
      this.sizesLoading = true;
      const sizeSub = this.inventoryService.getSizeCountsByVariant(this.selectedVariant).subscribe({
        next: (sizeCounts: {[key: string]: number}) => {
          this.filteredSizes = this.inventoryService.mapSizeCounts(sizeCounts, this.selectedVariant!);
          this.sizesLoading = false;
        },
        error: (error: any) => {
          this.sizesLoading = false;
          this.inventoryService.showError('Failed to load sizes for selected variant.');
          console.error('Error loading sizes:', error);
        }
      });
      this.subscriptions.push(sizeSub);

      // Load inventory for selected variant
      this.refreshInventory();
    }
  }

  onSizeChange(): void {
    this.selectedCount = 0;
    
    if (this.selectedSize) {
      const selectedSizeObj = this.filteredSizes.find(s => s.id === this.selectedSize);
      this.maxAvailableCount = selectedSizeObj?.availableCount || 0;
      this.currentAvailableCount = this.maxAvailableCount;
      this.selectedCount = Math.min(1, this.maxAvailableCount);

      // Load inventory for selected variant and size
      this.refreshInventory();
    } else {
      this.maxAvailableCount = 0;
      this.currentAvailableCount = 0;
    }
  }

  onCountChange(): void {
    if (this.selectedCount > this.maxAvailableCount) {
      this.selectedCount = this.maxAvailableCount;
    }
    if (this.selectedCount < 0) {
      this.selectedCount = 0;
    }
  }

  onTableCountChange(index: number): void {
    const item = this.inventoryData[index];
    if (item.count < 0) {
      item.count = 0;
    }
    
    // Update backend
    const updateSub = this.inventoryService.updateInventoryCount(item.id, item.count).subscribe({
      next: () => {
        this.inventoryService.showSuccess(`Updated count for ${item.variantDescription} (${item.size})`);
      },
      error: (error: any) => {
        this.inventoryService.showError('Failed to update inventory count.');
        console.error('Error updating count:', error);
      }
    });
    this.subscriptions.push(updateSub);
  }

  // Enhanced utility methods
  canAddToTable(): boolean {
    return !!(this.selectedCategory && this.selectedVariant && this.selectedSize && this.selectedCount > 0);
  }

  addToInventoryTable(): void {
    if (!this.canAddToTable()) return;

    const category = this.categories.find(c => c.id === this.selectedCategory);
    const variant = this.filteredVariants.find(v => v.id === this.selectedVariant);
    const size = this.filteredSizes.find(s => s.id === this.selectedSize);

    if (category && variant && size) {
      // Check for existing item with same category+variant+size
      const existing = this.inventoryService.findExistingInventoryItem(
        this.inventoryData, 
        this.selectedCategory!, 
        this.selectedVariant!, 
        size.size
      );

      if (existing) {
        // Update existing item
        const newCount = this.inventoryService.calculateNewTotal(existing.count, this.selectedCount);
        existing.count = newCount;
        existing.serialNumbers = [
          ...existing.serialNumbers,
          ...this.inventoryService.generateSerialNumbers(this.selectedCount)
        ];
        
        this.inventoryService.showSuccess(`Updated existing item: ${this.selectedCount} items added. New total: ${newCount}`);
        this.highlightRow(existing);
      } else {
        // Create new item
        const newItem: CostumeInventory = {
          id: Date.now(),
          categoryId: this.selectedCategory!,
          variantId: this.selectedVariant!,
          categoryName: category.categoryName,
          variantDescription: variant.variantDescription,
          size: size.size,
          count: this.selectedCount,
          imageUrl: '/assets/placeholder-costume.jpg',
          serialNumbers: this.inventoryService.generateSerialNumbers(this.selectedCount)
        };

        this.inventoryData.push(newItem);
        this.inventoryService.showSuccess(`${this.selectedCount} items added successfully!`);
        this.highlightRow(newItem);
      }

      this.clearFilters();
    }
  }

  highlightRow(item: CostumeInventory): void {
    // Add success animation class temporarily
    setTimeout(() => {
      const rowElement = document.querySelector(`[data-item-id="${item.id}"]`);
      if (rowElement) {
        rowElement.classList.add('success-highlight');
        setTimeout(() => {
          rowElement.classList.remove('success-highlight');
        }, 2000);
      }
    }, 100);
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.selectedVariant = null;
    this.selectedSize = null;
    this.selectedCount = 0;
    this.maxAvailableCount = 0;
    this.currentAvailableCount = 0;
    this.filteredVariants = [];
    this.filteredSizes = [];
    this.inventoryData = [];
  }

  removeFromTable(index: number): void {
    const item = this.inventoryData[index];
    this.inventoryData.splice(index, 1);
    this.inventoryService.showInfo(`Removed ${item.variantDescription} (${item.size}) from table`);
  }

  getTotalCount(): number {
    return this.inventoryData.reduce((total, item) => total + item.count, 0);
  }

  getCountHint(): string {
    if (this.selectedSize && this.selectedCount > 0) {
      const existing = this.inventoryService.findExistingInventoryItem(
        this.inventoryData, 
        this.selectedCategory!, 
        this.selectedVariant!, 
        this.filteredSizes.find(s => s.id === this.selectedSize)?.size || ''
      );
      
      if (existing) {
        const newTotal = this.inventoryService.calculateNewTotal(existing.count, this.selectedCount);
        return `Current: ${existing.count} → New: ${newTotal}`;
      } else {
        return `New entry: ${this.selectedCount} items`;
      }
    }
    return '';
  }

  // Auto-load inventory based on current filters and sort serial numbers
  private refreshInventory(): void {
    if (this.selectedCategory && !this.selectedVariant) {
      const sub = this.inventoryService.getInventoryByCategory(this.selectedCategory).subscribe({
        next: (items: CostumeInventory[]) => this.setInventoryData(items),
        error: (err: any) => {
          console.error('Error loading inventory by category', err);
          this.inventoryService.showError('Failed to load inventory for selected category.');
        }
      });
      this.subscriptions.push(sub);
      return;
    }

    if (this.selectedVariant && !this.selectedSize) {
      const sub = this.inventoryService.getInventoryByVariant(this.selectedVariant).subscribe({
        next: (items: CostumeInventory[]) => this.setInventoryData(items),
        error: (err: any) => {
          console.error('Error loading inventory by variant', err);
          this.inventoryService.showError('Failed to load inventory for selected variant.');
        }
      });
      this.subscriptions.push(sub);
      return;
    }

    if (this.selectedVariant && this.selectedSize) {
      const sizeObj = this.filteredSizes.find(s => s.id === this.selectedSize);
      const size = sizeObj?.size || '';
      if (!size) { return; }
      const sub = this.inventoryService.getInventoryByVariantAndSize(this.selectedVariant, size).subscribe({
        next: (items: CostumeInventory[]) => this.setInventoryData(items),
        error: (err: any) => {
          console.error('Error loading inventory by variant and size', err);
          this.inventoryService.showError('Failed to load inventory for selected size.');
        }
      });
      this.subscriptions.push(sub);
      return;
    }

    // No filters -> clear table
    this.inventoryData = [];
  }

  private setInventoryData(items: CostumeInventory[]): void {
    // Sort and dedupe serial numbers for each item so highest appears last
    this.inventoryData = (items || []).map(item => ({
      ...item,
      serialNumbers: this.sortAndDedupeSerials(item.serialNumbers || [])
    }));
  }

  private sortAndDedupeSerials(serials: string[]): string[] {
    const unique = Array.from(new Set(serials));
    return unique.sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''), 10);
      const nb = parseInt(b.replace(/\D/g, ''), 10);
      if (isNaN(na) && isNaN(nb)) return a.localeCompare(b);
      if (isNaN(na)) return -1;
      if (isNaN(nb)) return 1;
      return na - nb;
    });
  }

  getToastIcon(type: string): string {
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-exclamation-triangle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type as keyof typeof icons] || 'bi-info-circle-fill';
  }

  onImageError(event: any): void {
    if (event.target.src.includes('data:image')) {
      return;
    }
    
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREREREQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS02LTYtNiA2Ii8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAweiIvPgo8L3N2Zz4KPC9zdmc+';
    event.target.alt = 'No image available';
  }

  // Enhanced Add Costume Part functionality
  addCostumePart(item: CostumeInventory): void {
    this.selectedInventoryItem = item;
    this.newPart = {
      name: '',
      description: '',
      quantity: 1
    };
    this.showAddPartModal = true;
  }

  closeAddPartModal(): void {
    this.showAddPartModal = false;
    this.selectedInventoryItem = null;
  }

  saveCostumePart(): void {
    if (this.selectedInventoryItem && this.newPart.name && this.newPart.quantity > 0) {
      const partData = {
        parentCostumeId: this.selectedInventoryItem.id,
        partName: this.newPart.name,
        partDescription: this.newPart.description,
        quantity: this.newPart.quantity,
        isEssential: false,
        partType: 'accessory',
        notes: `Added via admin panel for ${this.selectedInventoryItem.variantDescription} (${this.selectedInventoryItem.size})`
      };

      const partSub = this.inventoryService.saveCostumePart(partData).subscribe({
        next: (partId: number) => {
          this.inventoryService.showSuccess(`Costume part "${this.newPart.name}" added successfully!`);
          this.closeAddPartModal();
        },
        error: (error: any) => {
          this.inventoryService.showError('Failed to save costume part. Please try again.');
          console.error('Error saving costume part:', error);
        }
      });
      this.subscriptions.push(partSub);
    }
  }
}
