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
    <div class="existing-costume">
      <div class="page-shell">
        <div class="toast-stack" *ngIf="currentToast">
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

        <header class="page-header">
          <div>
            <h1>Existing Costume Inventory</h1>
            <p>Manage and browse your costume inventory with dynamic filtering</p>
          </div>
          <span class="header-pill">
            <i class="bi bi-box-seam"></i>
            <span>{{ inventoryData.length }} records</span>
          </span>
        </header>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading inventory data...</p>
        </div>

        <section class="surface-card filters-card" *ngIf="!isLoading">
          <div class="surface-header">
            <div>
              <h2>Filter Inventory</h2>
              <span class="surface-subtitle">Refine by category, variant, size, and count.</span>
            </div>
          </div>

          <div class="filters-body">
            <div class="filters-grid">
              <div class="field-block">
                <label class="field-label" for="category">Category</label>
                <div class="field-control">
                  <select
                    id="category"
                    [(ngModel)]="selectedCategory"
                    (change)="onCategoryChange()"
                    class="dropdown-control"
                    [disabled]="categoriesLoading">
                    <option value="">{{ categoriesLoading ? 'Loading categories...' : 'Select Category' }}</option>
                    <option *ngFor="let category of categories" [value]="category.id">
                      {{ category.categoryName }}
                    </option>
                  </select>
                  <div class="inline-spinner" *ngIf="categoriesLoading">
                    <div class="mini-spinner"></div>
                  </div>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label" for="variant">Variant Description</label>
                <div class="field-control">
                  <select
                    id="variant"
                    [(ngModel)]="selectedVariant"
                    (change)="onVariantChange()"
                    class="dropdown-control"
                    [disabled]="!selectedCategory || variantsLoading">
                    <option value="">{{ variantsLoading ? 'Loading variants...' : 'Select Variant' }}</option>
                    <option *ngFor="let variant of filteredVariants" [value]="variant.id">
                      {{ variant.variantDescription }}
                    </option>
                  </select>
                  <div class="inline-spinner" *ngIf="variantsLoading">
                    <div class="mini-spinner"></div>
                  </div>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label" for="size">Size</label>
                <div class="field-control">
                  <select
                    id="size"
                    [(ngModel)]="selectedSize"
                    (change)="onSizeChange()"
                    class="dropdown-control"
                    [disabled]="!selectedVariant || sizesLoading">
                    <option [ngValue]="null">{{ sizesLoading ? 'Loading sizes...' : 'Select Size' }}</option>
                    <option *ngFor="let size of filteredSizes" [ngValue]="size.id">
                      {{ size.size }} ({{ size.availableCount }} available)
                    </option>
                  </select>
                  <div class="inline-spinner" *ngIf="sizesLoading">
                    <div class="mini-spinner"></div>
                  </div>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label" for="count">Count</label>
                <input
                  type="number"
                  id="count"
                  [(ngModel)]="selectedCount"
                  (input)="onCountChange()"
                  class="text-input"
                  min="0"
                  [disabled]="!selectedSize"
                  placeholder="Enter count">
                <div class="count-hint" *ngIf="selectedSize && selectedCount > 0">
                  <span class="hint-text">{{ getCountHint() }}</span>
                </div>
              </div>
            </div>

            <div class="filter-actions">
              <button
                class="btn primary-action"
                (click)="addToInventoryTable()"
                [disabled]="!canAddToTable()">
                <i class="bi bi-plus-circle"></i>
                Add to Table
              </button>
              <button
                class="btn secondary-action"
                (click)="clearFilters()">
                <i class="bi bi-arrow-clockwise"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        <section class="surface-card table-card">
          <div class="surface-header table-head">
            <div>
              <h2>Costume Inventory</h2>
              <span class="surface-subtitle">Maintain real-time counts and serial numbers.</span>
            </div>
            <div class="table-stats">
              <span class="stat-chip">
                <i class="bi bi-grid"></i>
                {{ inventoryData.length }} entries
              </span>
              <span class="stat-chip">
                <i class="bi bi-123"></i>
                {{ getTotalCount() }} items
              </span>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="modern-table inventory-table" *ngIf="inventoryData.length > 0; else noDataTemplate">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Variant</th>
                  <th>Size</th>
                  <th>Count</th>
                  <th class="actions-header">Actions</th>
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
                  <td class="category-cell">
                    <span class="category-chip">{{ item.categoryName }}</span>
                  </td>
                  <td class="variant-cell">
                    <div class="variant-text">
                      <span>{{ item.variantDescription }}</span>
                    </div>
                  </td>
                  <td class="size-cell">
                    <span class="size-pill">{{ item.size }}</span>
                  </td>
                  <td class="count-cell">
                    <input
                      type="number"
                      [value]="item.count"
                      class="count-input"
                      readonly>
                  </td>
              
                  <td class="actions-cell">
                    <button
                      class="btn btn-sm success-action"
                      (click)="addCostumePart(item)"
                      title="Add Costume Part">
                      <i class="bi bi-plus"></i>
                      Add Part
                    </button>
                    <button
                      class="btn btn-sm danger-action"
                      (click)="removeFromTable(i)"
                      title="Remove from table">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <ng-template #noDataTemplate>
              <div class="empty-state">
                <div class="empty-icon">
                  <i class="bi bi-inbox"></i>
                </div>
                <h3>No inventory data yet</h3>
                <p>Select category, variant, and size to view inventory items.</p>
              </div>
            </ng-template>
          </div>
        </section>

        <div class="modal" [class.show]="showAddPartModal" *ngIf="showAddPartModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <div>
                  <h5 class="modal-title">Add Costume Part</h5>
                  <span class="modal-subtitle" *ngIf="selectedInventoryItem">
                    {{ selectedInventoryItem.variantDescription }} • Size {{ selectedInventoryItem.size }}
                  </span>
                </div>
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
                <button type="button" class="btn secondary-action" (click)="closeAddPartModal()">
                  Cancel
                </button>
                <button type="button" class="btn primary-action" (click)="saveCostumePart()">
                  <i class="bi bi-save"></i>
                  Save Part
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .existing-costume {
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
      position: relative;
    }

    .toast-stack {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 24px 40px rgba(15, 23, 42, 0.18);
      background: rgba(255, 255, 255, 0.96);
      border-left: 4px solid transparent;
      gap: 1rem;
    }

    .toast-content {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: #0f172a;
      font-weight: 600;
    }

    .toast-success { border-left-color: #16a34a; color: #166534; }
    .toast-error { border-left-color: #dc2626; color: #991b1b; }
    .toast-info { border-left-color: #2563eb; color: #1d4ed8; }
    .toast-warning { border-left-color: #f59e0b; color: #b45309; }

    .toast-close {
      border: none;
      background: rgba(241, 245, 249, 0.9);
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .toast-close:hover {
      background: rgba(15, 23, 42, 0.1);
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: clamp(1rem, 2vw, 1.5rem);
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.16);
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
      margin: 0.35rem 0 0;
      color: #64748b;
      font-size: 0.97rem;
    }

    .header-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.75rem 1.1rem;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(59, 130, 246, 0.3) 100%);
      color: #1d4ed8;
      font-weight: 600;
      box-shadow: 0 12px 28px rgba(59, 130, 246, 0.2);
    }

    .header-pill i {
      font-size: 1.1rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      gap: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
      color: #1f2937;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 6px solid rgba(226, 232, 240, 0.8);
      border-top-color: #6366f1;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .mini-spinner {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid rgba(226, 232, 240, 0.8);
      border-top-color: #6366f1;
      animation: spin 1s linear infinite;
    }

    .surface-card {
      background: rgba(255, 255, 255, 0.94);
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.12);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
      display: flex;
      flex-direction: column;
      gap: clamp(1.5rem, 2vw, 2rem);
    }

    .surface-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: clamp(1.5rem, 2vw, 1.75rem);
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    }

    .surface-header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 600;
      color: #1e293b;
    }

    .surface-subtitle {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .filters-card {
      gap: 0;
    }

    .filters-body {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding: 0 clamp(1.8rem, 2.5vw, 2.4rem) clamp(1.8rem, 2.5vw, 2.4rem);
    }

    .filters-grid {
      display: grid;
      gap: clamp(1.25rem, 2vw, 1.75rem);
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .field-block {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .field-label {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.92rem;
    }

    .field-control {
      position: relative;
    }

    .dropdown-control,
    .text-input,
    .form-control,
    .form-select {
      width: 100%;
      border-radius: 14px;
      border: 1px solid rgba(148, 163, 184, 0.32);
      padding: 0.85rem 1rem;
      background: linear-gradient(135deg, rgba(248, 250, 255, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%);
      color: #0f172a;
      font-weight: 500;
      transition: border 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .dropdown-control:focus,
    .text-input:focus,
    .form-control:focus,
    .form-select:focus {
      border-color: rgba(99, 102, 241, 0.65);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
      outline: none;
      transform: translateY(-1px);
      background: #fff;
    }

    .dropdown-control:disabled,
    .text-input:disabled {
      background: rgba(241, 245, 249, 0.65);
      color: #94a3b8;
      cursor: not-allowed;
      border-color: rgba(203, 213, 225, 0.7);
    }

    .inline-spinner {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }

    .count-hint {
      padding: 0.6rem 0.8rem;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.08);
      border-left: 3px solid rgba(99, 102, 241, 0.4);
    }

    .hint-text {
      font-size: 0.85rem;
      color: #4f46e5;
      font-weight: 600;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .btn {
      border-radius: 14px;
      font-weight: 600;
      padding: 0.85rem 1.65rem;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .btn i {
      font-size: 1.05rem;
    }

    .primary-action {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #fff;
      box-shadow: 0 18px 32px rgba(79, 70, 229, 0.24);
    }

    .primary-action:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 26px 48px rgba(79, 70, 229, 0.28);
    }

    .secondary-action {
      background: rgba(148, 163, 184, 0.18);
      color: #1f2937;
      border: 1px solid rgba(148, 163, 184, 0.4);
    }

    .secondary-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 36px rgba(148, 163, 184, 0.22);
    }

    .success-action {
      background: rgba(34, 197, 94, 0.16);
      color: #047857;
      border: 1px solid rgba(34, 197, 94, 0.4);
    }

    .success-action:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 18px 32px rgba(34, 197, 94, 0.22);
    }

    .danger-action {
      background: rgba(248, 113, 113, 0.16);
      color: #b91c1c;
      border: 1px solid rgba(248, 113, 113, 0.36);
    }

    .danger-action:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 18px 32px rgba(248, 113, 113, 0.26);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-sm {
      padding: 0.55rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .table-card {
      gap: 0;
    }

    .table-head {
      align-items: flex-start;
    }

    .table-stats {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .stat-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.95rem;
      border-radius: 14px;
      background: rgba(99, 102, 241, 0.12);
      color: #3730a3;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .stat-chip i {
      font-size: 1rem;
    }

    .table-wrapper {
      width: 100%;
      padding: 0 clamp(1.5rem, 2vw, 2rem) clamp(1.5rem, 2vw, 2rem);
    }

    .modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 100%;
      font-size: 0.95rem;
      color: #1e293b;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 18px;
      overflow: hidden;
    }

    .modern-table thead tr {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    }

    .modern-table th {
      padding: 1rem 1.25rem;
      font-weight: 600;
      text-align: left;
      color: #312e81;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }

    .modern-table tbody tr {
      transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
    }

    .modern-table tbody tr:nth-child(even) {
      background: rgba(248, 250, 255, 0.85);
    }

    .modern-table tbody tr:hover {
      background: rgba(238, 242, 255, 0.92);
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.08);
    }

    .modern-table td {
      padding: 1rem 1.25rem;
      vertical-align: middle;
      border-bottom: 1px solid rgba(226, 232, 240, 0.7);
    }

    .modern-table tbody tr:last-child td {
      border-bottom: none;
    }

    .image-cell {
      width: 80px;
    }

    .costume-image {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.3);
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      background: rgba(14, 165, 233, 0.15);
      color: #0369a1;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .variant-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .variant-text span {
      font-weight: 600;
      color: #1f2937;
    }

    .size-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: rgba(15, 118, 110, 0.18);
      color: #0f766e;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.02em;
    }

    .count-input {
      width: 90px;
      text-align: center;
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.32);
      padding: 0.6rem 0.75rem;
      background: rgba(248, 250, 255, 0.95);
      font-weight: 600;
      color: #1f2937;
      transition: border 0.2s ease, box-shadow 0.2s ease;
    }

    .count-input:focus {
      border-color: rgba(99, 102, 241, 0.65);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
      outline: none;
    }

    .serial-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .serial-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.06);
      color: #475569;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .actions-cell {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      justify-content: flex-end;
    }

    .actions-header {
      text-align: right;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
      padding: 4rem 1.5rem;
      color: #94a3b8;
    }

    .empty-icon {
      width: 72px;
      height: 72px;
      border-radius: 24px;
      background: rgba(99, 102, 241, 0.14);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      font-size: 1.8rem;
      box-shadow: 0 18px 32px rgba(99, 102, 241, 0.18);
    }

    .empty-state h3 {
      margin: 0;
      font-weight: 600;
      color: #1e293b;
    }

    .modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1200;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 1.5rem;
    }

    .modal.show {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-dialog {
      width: 100%;
      max-width: 520px;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 34px 72px rgba(15, 23, 42, 0.35);
      background: transparent;
    }

    .modal-content {
      border: none;
      border-radius: 22px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.98);
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.6rem 1.75rem;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #fff;
    }

    .modal-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .modal-subtitle {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.85rem;
      opacity: 0.85;
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-body {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: #f8fafc;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .form-group label {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.92rem;
    }

    .modal-footer {
      padding: 1.5rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      background: rgba(248, 250, 255, 0.82);
    }

    .success-highlight {
      background: rgba(34, 197, 94, 0.15) !important;
      animation: pulse 2s ease;
    }

    @keyframes pulse {
      0%, 100% { background: rgba(34, 197, 94, 0.15); }
      50% { background: rgba(34, 197, 94, 0.3); }
    }

    @media (max-width: 992px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-pill {
        align-self: flex-start;
      }

      .filter-actions {
        justify-content: center;
      }

      .table-stats {
        justify-content: flex-start;
      }

      .modal-dialog {
        max-width: 480px;
      }
    }

    @media (max-width: 768px) {
      .existing-costume {
        padding: 1.25rem;
      }

      .table-wrapper {
        padding: 0 1rem 1.5rem;
      }

      .filters-body {
        padding: 0 1.5rem 1.75rem;
      }

      .filter-actions {
        flex-direction: column;
      }

      .filter-actions .btn {
        width: 100%;
        justify-content: center;
      }

      .table-stats {
        width: 100%;
      }

      .modal {
        padding: 1rem;
      }
    }

    @media (max-width: 576px) {
      .toast-stack {
        right: 16px;
        left: 16px;
      }

      .toast {
        width: 100%;
        min-width: auto;
      }

      .modern-table {
        min-width: 100%;
      }

      .modal-dialog {
        max-width: 100%;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 1.25rem;
        padding-right: 1.25rem;
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

    if (this.selectedSize !== null) {
      const selectedSizeId = typeof this.selectedSize === 'string' ? Number(this.selectedSize) : this.selectedSize;
      const selectedSizeObj = this.filteredSizes.find(s => s.id === selectedSizeId);
      this.maxAvailableCount = selectedSizeObj?.availableCount || 0;
      this.currentAvailableCount = this.maxAvailableCount;
      this.selectedCount = this.maxAvailableCount;

      // Load inventory for selected variant and size
      this.refreshInventory();
    } else {
      this.maxAvailableCount = 0;
      this.currentAvailableCount = 0;
    }
  }

  onCountChange(): void {
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
        const previousCount = existing.count;
        existing.count = this.selectedCount;

        if (this.selectedCount > previousCount) {
          const additional = this.selectedCount - previousCount;
          existing.serialNumbers = [
            ...existing.serialNumbers,
            ...this.inventoryService.generateSerialNumbers(additional)
          ];
        } else if (this.selectedCount < previousCount) {
          existing.serialNumbers = existing.serialNumbers.slice(0, this.selectedCount);
        }

        this.inventoryService.showSuccess(`Updated count: ${previousCount} → ${this.selectedCount}`);
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
        return `Current: ${existing.count} → New: ${this.selectedCount}`;
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
