import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventoryService, Category, CostumeInventory } from '../../services/inventory.service';

interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  totalQty: number;
  available: number;
  rented: number;
  reserved: number;
  maintenance: number;
}

interface CategorySummary {
  name: string;
  total: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports">
      <div class="report-header">
        <div>
          <h2>📊 Inventory Report</h2>
          <p>Live snapshot of current rental inventory</p>
        </div>
        <button class="refresh-btn" (click)="loadReport()" [disabled]="isLoading">
          <i class="bi bi-arrow-repeat" [class.spin]="isLoading"></i>
          Refresh
        </button>
      </div>

      <div *ngIf="isLoading" class="state-card">
        <div class="spinner"></div>
        <p>Loading live inventory report...</p>
      </div>

      <div *ngIf="!isLoading">
        <div *ngIf="errorMessage" class="state-card error">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ errorMessage }}</p>
        </div>

        <ng-container *ngIf="!errorMessage">
          <div class="stats-grid">
            <div class="stat-card stat-primary">
              <div class="stat-icon"><i class="bi bi-box-seam"></i></div>
              <div class="stat-content">
                <h3>{{ stats.totalCostumes || 0 }}</h3>
                <p>Total Costumes</p>
              </div>
            </div>
            <div class="stat-card stat-success">
              <div class="stat-icon"><i class="bi bi-check2-circle"></i></div>
              <div class="stat-content">
                <h3>{{ stats.available || 0 }}</h3>
                <p>Available</p>
              </div>
            </div>
            <div class="stat-card stat-info">
              <div class="stat-icon"><i class="bi bi-collection"></i></div>
              <div class="stat-content">
                <h3>{{ categorySummary.length || 0 }}</h3>
                <p>Categories Tracked</p>
              </div>
            </div>
            <div class="stat-card stat-warning">
              <div class="stat-icon"><i class="bi bi-trophy"></i></div>
              <div class="stat-content">
                <h3>{{ topCategory || 'N/A' }}</h3>
                <p>Top Category</p>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Inventory Details</h5>
            </div>
            <div class="card-body">
              <ng-container *ngIf="hasData; else emptyState">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Costume</th>
                        <th>Category</th>
                        <th>Total</th>
                        <th>Available</th>
                        <th>Rented</th>
                        <th>Reserved</th>
                        <th>Maintenance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of inventoryData; trackBy: trackByItem">
                        <td class="fw-bold">{{ item.name }}</td>
                        <td><span class="category-badge">{{ item.category }}</span></td>
                        <td>{{ item.totalQty || 0 }}</td>
                        <td><span class="badge bg-success">{{ item.available || 0 }}</span></td>
                        <td><span class="badge bg-warning text-dark">{{ item.rented || 0 }}</span></td>
                        <td><span class="badge bg-info">{{ item.reserved || 0 }}</span></td>
                        <td><span class="badge bg-danger">{{ item.maintenance || 0 }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ng-container>
              <ng-template #emptyState>
                <div class="state-card muted">
                  <i class="bi bi-box"></i>
                  <p>No inventory data available.</p>
                </div>
              </ng-template>
            </div>
          </div>

          <div class="card" *ngIf="categorySummary.length">
            <div class="card-header">
              <h5 class="mb-0">Category Breakdown</h5>
            </div>
            <div class="card-body">
              <div class="category-grid">
                <div class="category-card" *ngFor="let category of categorySummary">
                  <div class="category-header">
                    <h6>{{ category.name }}</h6>
                    <span>{{ category.total }} items</span>
                  </div>
                  <div class="progress">
                    <div 
                      class="progress-bar" 
                      role="progressbar" 
                      [style.width.%]="stats.totalCostumes ? (category.total / stats.totalCostumes) * 100 : 0">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .reports {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-radius: 18px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .report-header h2 {
      margin: 0 0 0.25rem 0;
      font-weight: 700;
    }

    .report-header p {
      margin: 0;
      opacity: 0.9;
    }

    .refresh-btn {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 0.65rem 1.5rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .refresh-btn:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }

    .refresh-btn .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .state-card {
      background: #fff;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-bottom: 1.5rem;
    }

    .state-card.error {
      border: 1px solid #f87171;
      color: #b91c1c;
    }

    .state-card.muted {
      color: #64748b;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(102, 126, 234, 0.3);
      border-top-color: #667eea;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .stat-card .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: #fff;
    }

    .stat-card .stat-content h3 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-card .stat-content p {
      margin: 0;
      color: #94a3b8;
    }

    .stat-primary .stat-icon { background: linear-gradient(135deg, #5c1a1a, #7d2424); }
    .stat-success .stat-icon { background: linear-gradient(135deg, #16a34a, #4ade80); }
    .stat-info .stat-icon { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
    .stat-warning .stat-icon { background: linear-gradient(135deg, #f97316, #facc15); }

    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: none;
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-body {
      padding: 1.5rem;
    }

    .table thead th {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
      color: #475569;
      font-weight: 600;
    }

    .category-badge {
      background: rgba(102, 126, 234, 0.15);
      color: #4338ca;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .category-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #475569;
    }

    .progress {
      background: #e2e8f0;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
    }

    .progress-bar {
      background: linear-gradient(135deg, #22d3ee, #3b82f6);
      height: 100%;
    }
  `]
})
export class ReportsComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  inventoryData: InventoryItem[] = [];
  categorySummary: CategorySummary[] = [];
  stats = { totalCostumes: 0, available: 0, rented: 0, reserved: 0, maintenance: 0 };
  topCategory: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        const normalized = this.inventoryService.dedupeCategoriesByName(categories || []);
        if (!normalized.length) {
          this.setInventory([]);
          return;
        }
        this.fetchInventory(normalized);
      },
      error: (error: any) => {
        console.error('Error loading categories for report:', error);
        this.errorMessage = 'Unable to load report data.';
        this.setInventory([]);
      }
    });
  }

  private fetchInventory(categories: Category[]): void {
    const requests = categories
      .filter(category => !!category.id)
      .map(category => this.inventoryService.getInventoryByCategory(category.id!).pipe(
        catchError(error => {
          console.error(`Error loading inventory for category ${category.id}:`, error);
          return of([]);
        })
      ));

    if (!requests.length) {
      this.setInventory([]);
      return;
    }

    forkJoin(requests).subscribe({
      next: (resultSets: CostumeInventory[][]) => {
        const flattened = resultSets.flat();
        const mapped = flattened
          .map(item => this.mapInventoryItem(item))
          .sort((a, b) => (b.totalQty || 0) - (a.totalQty || 0));
        this.setInventory(mapped);
      },
      error: (error: any) => {
        console.error('Error loading inventory report data:', error);
        this.errorMessage = 'Unable to load report data.';
        this.setInventory([]);
      }
    });
  }

  private mapInventoryItem(item: CostumeInventory): InventoryItem {
    const qty = item.count ?? 0;
    return {
      id: item.id,
      name: item.variantDescription || 'N/A',
      category: item.categoryName || 'N/A',
      totalQty: qty,
      available: qty,
      rented: 0,
      reserved: 0,
      maintenance: 0
    };
  }

  private setInventory(items: InventoryItem[]): void {
    this.inventoryData = items;
    this.recalculateStats();
    this.isLoading = false;
  }

  private recalculateStats(): void {
    const stats = { totalCostumes: 0, available: 0, rented: 0, reserved: 0, maintenance: 0 };

    for (const item of this.inventoryData) {
      stats.totalCostumes += item.totalQty || 0;
      stats.available += item.available || 0;
      stats.rented += item.rented || 0;
      stats.reserved += item.reserved || 0;
      stats.maintenance += item.maintenance || 0;
    }

    this.stats = stats;
    this.categorySummary = this.buildCategorySummary();
    this.topCategory = this.categorySummary[0]?.name ?? null;
  }

  private buildCategorySummary(): CategorySummary[] {
    const summaryMap = new Map<string, number>();

    for (const item of this.inventoryData) {
      const key = item.category || 'N/A';
      summaryMap.set(key, (summaryMap.get(key) || 0) + (item.totalQty || 0));
    }

    return Array.from(summaryMap.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }

  get hasData(): boolean {
    return this.inventoryData.length > 0;
  }

  trackByItem(_: number, item: InventoryItem): number | undefined {
    return item.id;
  }
}
