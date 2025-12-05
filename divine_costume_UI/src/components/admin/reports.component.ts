import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  ReportService,
  DashboardSummaryDto,
  InventoryReportDto,
  CategoryReportDto
} from '../../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <!-- Header -->
      <div class="report-header">
        <div>
          <h2>📊 Inventory Reports</h2>
          <p>Comprehensive analytics and insights for your costume inventory</p>
        </div>
        <button class="refresh-btn" (click)="refreshCurrentReport()" [disabled]="isLoading">
          <i class="bi bi-arrow-repeat" [class.spin]="isLoading"></i>
          Refresh
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-btn" 
          [class.active]="activeTab === tab.id"
          (click)="switchTab(tab.id)">
          <i [class]="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="state-card">
        <div class="spinner"></div>
        <p>Loading report data...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading && errorMessage" class="state-card error">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary mt-3" (click)="refreshCurrentReport()">Try Again</button>
      </div>

      <!-- Dashboard Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'dashboard'" class="tab-content">
        <div *ngIf="dashboardData" class="dashboard-content">
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card stat-primary">
              <div class="stat-icon"><i class="bi bi-box-seam"></i></div>
              <div class="stat-content">
                <h3>{{ dashboardData.totalCostumes | number }}</h3>
                <p>Total Costumes</p>
              </div>
            </div>
            <div class="stat-card stat-success">
              <div class="stat-icon"><i class="bi bi-check2-circle"></i></div>
              <div class="stat-content">
                <h3>{{ dashboardData.availableCostumes | number }}</h3>
                <p>Available</p>
                <small>{{ getPercentage(dashboardData.availableCostumes, dashboardData.totalCostumes) }}%</small>
              </div>
            </div>
            <div class="stat-card stat-warning">
              <div class="stat-icon"><i class="bi bi-calendar-check"></i></div>
              <div class="stat-content">
                <h3>{{ dashboardData.rentedCostumes | number }}</h3>
                <p>Rented</p>
                <small>{{ getPercentage(dashboardData.rentedCostumes, dashboardData.totalCostumes) }}%</small>
              </div>
            </div>
            <div class="stat-card stat-info">
              <div class="stat-icon"><i class="bi bi-currency-rupee"></i></div>
              <div class="stat-content">
                <h3>₹{{ formatCurrency(dashboardData.totalInventoryValue) }}</h3>
                <p>Total Value</p>
              </div>
            </div>
          </div>

          <!-- Secondary Stats -->
          <div class="stats-grid secondary">
            <div class="stat-card">
              <div class="stat-content">
                <h4>{{ dashboardData.totalCategories }}</h4>
                <p>Categories</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h4>{{ dashboardData.totalVariants }}</h4>
                <p>Variants</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h4>{{ dashboardData.overallUtilizationRate | number:'1.1-1' }}%</h4>
                <p>Utilization Rate</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <h4>₹{{ formatCurrency(dashboardData.totalPotentialMonthlyRevenue) }}</h4>
                <p>Potential Monthly Revenue</p>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="charts-row">
            <!-- Top Categories -->
            <div class="chart-card">
              <h5>Top 5 Categories</h5>
              <div class="bar-chart">
                <div *ngFor="let item of getTopCategories()" class="bar-item">
                  <div class="bar-label">{{ item.name }}</div>
                  <div class="bar-wrapper">
                    <div class="bar-fill" [style.width.%]="getBarWidth(item.value, getMaxValue(getTopCategories()))"></div>
                    <span class="bar-value">{{ item.value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Size Distribution -->
            <div class="chart-card">
              <h5>Size Distribution</h5>
              <div class="pie-chart">
                <div *ngFor="let item of getSizeDistribution()" class="pie-item">
                  <div class="pie-color" [style.background]="getRandomColor()"></div>
                  <div class="pie-label">{{ item.name }}</div>
                  <div class="pie-value">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert -->
          <div *ngIf="dashboardData.lowStockVariants > 0" class="alert-card">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <div>
              <strong>Low Stock Alert!</strong>
              <p>{{ dashboardData.lowStockVariants }} variant(s) have low stock. Check the Low Stock tab for details.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory by Variant Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'variant'" class="tab-content">
        <div *ngIf="inventoryByVariant.length > 0" class="table-card">
          <div class="table-header">
            <h5>Inventory by Variant</h5>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search variants..."
              [(ngModel)]="searchTerm"
              (input)="filterInventory()">
          </div>
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Variant</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Rented</th>
                  <th>Avg Rental Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of filteredInventory">
                  <td>
                    <img [src]="item.imageUrl" [alt]="item.variantDescription" class="variant-img" (error)="onImageError($event)">
                  </td>
                  <td>
                    <strong>{{ item.variantDescription }}</strong>
                    <br>
                    <small class="text-muted">{{ item.primaryColor }}</small>
                  </td>
                  <td><span class="category-badge">{{ item.categoryName }}</span></td>
                  <td><strong>{{ item.totalCount }}</strong></td>
                  <td><span class="badge badge-success">{{ item.availableCount }}</span></td>
                  <td><span class="badge badge-warning">{{ item.rentedCount }}</span></td>
                  <td>₹{{ item.averageRentalPrice | number:'1.0-0' }}</td>
                  <td><strong>₹{{ formatCurrency(item.totalInventoryValue) }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div *ngIf="inventoryByVariant.length === 0" class="state-card muted">
          <i class="bi bi-inbox"></i>
          <p>No inventory data available</p>
        </div>
      </div>

      <!-- Inventory by Size Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'size'" class="tab-content">
        <div *ngIf="inventoryBySize.length > 0" class="table-card">
          <div class="table-header">
            <h5>Inventory by Variant & Size</h5>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search..."
              [(ngModel)]="searchTermSize"
              (input)="filterInventoryBySize()">
          </div>
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Variant</th>
                  <th>Size</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Rented</th>
                  <th>Avg Price</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of filteredInventoryBySize">
                  <td><strong>{{ item.variantDescription }}</strong></td>
                  <td><span class="size-badge">{{ item.size }}</span></td>
                  <td><span class="category-badge">{{ item.categoryName }}</span></td>
                  <td>{{ item.totalCount }}</td>
                  <td><span class="badge badge-success">{{ item.availableCount }}</span></td>
                  <td><span class="badge badge-warning">{{ item.rentedCount }}</span></td>
                  <td>₹{{ item.averageRentalPrice | number:'1.0-0' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Category Report Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'category'" class="tab-content">
        <div *ngIf="categoryReport.length > 0" class="category-grid">
          <div *ngFor="let category of categoryReport" class="category-report-card">
            <div class="category-header">
              <h5>{{ category.categoryName }}</h5>
              <span class="utilization-badge" [class.high]="category.utilizationRate > 50">
                {{ category.utilizationRate | number:'1.0-0' }}% Utilized
              </span>
            </div>
            <div class="category-stats">
              <div class="stat-row">
                <span>Total Variants:</span>
                <strong>{{ category.totalVariants }}</strong>
              </div>
              <div class="stat-row">
                <span>Total Costumes:</span>
                <strong>{{ category.totalCostumes }}</strong>
              </div>
              <div class="stat-row">
                <span>Available:</span>
                <strong class="text-success">{{ category.availableCostumes }}</strong>
              </div>
              <div class="stat-row">
                <span>Rented:</span>
                <strong class="text-warning">{{ category.rentedCostumes }}</strong>
              </div>
              <div class="stat-row">
                <span>Total Value:</span>
                <strong>₹{{ formatCurrency(category.totalInventoryValue) }}</strong>
              </div>
              <div class="stat-row">
                <span>Monthly Potential:</span>
                <strong class="text-primary">₹{{ formatCurrency(category.potentialMonthlyRevenue) }}</strong>
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="category.utilizationRate"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'lowstock'" class="tab-content">
        <div class="filter-row">
          <label>Threshold:</label>
          <select [(ngModel)]="lowStockThreshold" (change)="loadLowStockReport()" class="form-select">
            <option [value]="3">Less than 3</option>
            <option [value]="5">Less than 5</option>
            <option [value]="10">Less than 10</option>
          </select>
        </div>
        <div *ngIf="lowStockReport.length > 0" class="low-stock-grid">
          <div *ngFor="let item of lowStockReport" class="low-stock-card" [class.critical]="item.availableCount < 3">
            <div class="stock-header">
              <img [src]="item.imageUrl" [alt]="item.variantDescription" (error)="onImageError($event)">
              <div class="stock-info">
                <h6>{{ item.variantDescription }}</h6>
                <p>{{ item.categoryName }} - {{ item.size }}</p>
              </div>
              <div class="stock-count" [class.critical]="item.availableCount < 3">
                {{ item.availableCount }}
              </div>
            </div>
            <div class="stock-details">
              <span>Total: {{ item.totalCount }}</span>
              <span>Rented: {{ item.rentedCount }}</span>
            </div>
          </div>
        </div>
        <div *ngIf="lowStockReport.length === 0" class="state-card success">
          <i class="bi bi-check-circle"></i>
          <p>All variants have sufficient stock!</p>
        </div>
      </div>

      <!-- High Value Tab -->
      <div *ngIf="!isLoading && !errorMessage && activeTab === 'highvalue'" class="tab-content">
        <div class="filter-row">
          <label>Show Top:</label>
          <select [(ngModel)]="highValueLimit" (change)="loadHighValueReport()" class="form-select">
            <option [value]="5">Top 5</option>
            <option [value]="10">Top 10</option>
            <option [value]="20">Top 20</option>
          </select>
        </div>
        <div *ngIf="highValueReport.length > 0" class="high-value-list">
          <div *ngFor="let item of highValueReport; let i = index" class="high-value-card">
            <div class="rank-badge">{{ i + 1 }}</div>
            <img [src]="item.imageUrl" [alt]="item.variantDescription" (error)="onImageError($event)">
            <div class="value-info">
              <h6>{{ item.variantDescription }}</h6>
              <p>{{ item.categoryName }}</p>
              <div class="value-stats">
                <span>{{ item.totalCount }} costumes</span>
                <span>Avg: ₹{{ item.averagePurchasePrice | number:'1.0-0' }}</span>
              </div>
            </div>
            <div class="value-amount">
              <strong>₹{{ formatCurrency(item.totalInventoryValue) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 1.5rem;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-radius: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      margin-bottom: 2rem;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .report-header h2 {
      margin: 0 0 0.5rem 0;
      font-weight: 700;
      font-size: 2rem;
    }

    .report-header p {
      margin: 0;
      opacity: 0.9;
    }

    .refresh-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 0.75rem 1.75rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .tab-navigation {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: #fff;
      border: 2px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateY(-2px);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: #667eea;
      color: #fff;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .state-card {
      background: #fff;
      border-radius: 16px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .state-card.error {
      border: 2px solid #f87171;
      color: #b91c1c;
    }

    .state-card.success {
      border: 2px solid #4ade80;
      color: #16a34a;
    }

    .state-card.muted {
      color: #94a3b8;
    }

    .state-card i {
      font-size: 3rem;
      margin-bottom: 1rem;
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
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stats-grid.secondary {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .stat-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: #fff;
    }

    .stat-content h3, .stat-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-content p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .stat-content small {
      color: #16a34a;
      font-weight: 600;
    }

    .stat-primary .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-success .stat-icon { background: linear-gradient(135deg, #16a34a, #4ade80); }
    .stat-warning .stat-icon { background: linear-gradient(135deg, #f97316, #facc15); }
    .stat-info .stat-icon { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }

    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .chart-card h5 {
      margin: 0 0 1.5rem 0;
      font-weight: 700;
      color: #1e293b;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bar-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bar-label {
      min-width: 120px;
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
    }

    .bar-wrapper {
      flex: 1;
      position: relative;
      height: 32px;
      background: #f1f5f9;
      border-radius: 8px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 8px;
      transition: width 0.5s ease;
    }

    .bar-value {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 700;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .pie-chart {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .pie-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pie-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .pie-label {
      flex: 1;
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
    }

    .pie-value {
      font-weight: 700;
      color: #1e293b;
    }

    .alert-card {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 2px solid #fbbf24;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .alert-card i {
      font-size: 2rem;
      color: #f59e0b;
    }

    .alert-card strong {
      display: block;
      margin-bottom: 0.25rem;
      color: #92400e;
    }

    .alert-card p {
      margin: 0;
      color: #78350f;
    }

    .table-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h5 {
      margin: 0;
      font-weight: 700;
    }

    .search-input {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      width: 250px;
      font-size: 0.875rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
    }

    .modern-table thead th {
      background: #f8fafc;
      padding: 1rem 1.5rem;
      text-align: left;
      font-weight: 600;
      color: #475569;
      border-bottom: 2px solid #e2e8f0;
      white-space: nowrap;
    }

    .modern-table tbody td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .modern-table tbody tr:hover {
      background: #f8fafc;
    }

    .variant-img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }

    .category-badge {
      background: rgba(102, 126, 234, 0.15);
      color: #4338ca;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .size-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-success {
      background: rgba(34, 197, 94, 0.15);
      color: #16a34a;
    }

    .badge-warning {
      background: rgba(251, 191, 36, 0.15);
      color: #d97706;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .category-report-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
    }

    .category-report-card:hover {
      transform: translateY(-4px);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .category-header h5 {
      margin: 0;
      font-weight: 700;
      color: #1e293b;
    }

    .utilization-badge {
      background: rgba(251, 191, 36, 0.15);
      color: #d97706;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .utilization-badge.high {
      background: rgba(34, 197, 94, 0.15);
      color: #16a34a;
    }

    .category-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .stat-row span {
      color: #64748b;
    }

    .stat-row strong {
      color: #1e293b;
    }

    .text-success { color: #16a34a; }
    .text-warning { color: #d97706; }
    .text-primary { color: #667eea; }

    .progress-bar-container {
      height: 8px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 999px;
      transition: width 0.5s ease;
    }

    .filter-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .filter-row label {
      font-weight: 600;
      color: #475569;
    }

    .form-select {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .form-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .low-stock-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .low-stock-card {
      background: #fff;
      border: 2px solid #fbbf24;
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .low-stock-card.critical {
      border-color: #f87171;
      background: #fef2f2;
    }

    .low-stock-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stock-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .stock-header img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }

    .stock-info {
      flex: 1;
    }

    .stock-info h6 {
      margin: 0 0 0.25rem 0;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .stock-info p {
      margin: 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .stock-count {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fbbf24;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .stock-count.critical {
      background: #f87171;
    }

    .stock-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
    }

    .high-value-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .high-value-card {
      background: #fff;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .high-value-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .rank-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.125rem;
    }

    .high-value-card img {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
    }

    .value-info {
      flex: 1;
    }

    .value-info h6 {
      margin: 0 0 0.25rem 0;
      font-weight: 700;
    }

    .value-info p {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #64748b;
    }

    .value-stats {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .value-amount {
      text-align: right;
    }

    .value-amount strong {
      font-size: 1.25rem;
      color: #16a34a;
    }

    @media (max-width: 768px) {
      .charts-row {
        grid-template-columns: 1fr;
      }

      .search-input {
        width: 100%;
      }

      .table-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class ReportsComponent implements OnInit, OnDestroy {
  activeTab = 'dashboard';
  isLoading = false;
  errorMessage = '';

  // Data
  dashboardData: DashboardSummaryDto | null = null;
  inventoryByVariant: InventoryReportDto[] = [];
  inventoryBySize: InventoryReportDto[] = [];
  categoryReport: CategoryReportDto[] = [];
  lowStockReport: InventoryReportDto[] = [];
  highValueReport: InventoryReportDto[] = [];

  // Filters
  searchTerm = '';
  searchTermSize = '';
  lowStockThreshold = 5;
  highValueLimit = 10;

  // Filtered data
  filteredInventory: InventoryReportDto[] = [];
  filteredInventoryBySize: InventoryReportDto[] = [];

  private subscriptions: Subscription[] = [];

  tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { id: 'variant', label: 'By Variant', icon: 'bi bi-grid-3x3' },
    { id: 'size', label: 'By Size', icon: 'bi bi-rulers' },
    { id: 'category', label: 'Categories', icon: 'bi bi-collection' },
    { id: 'lowstock', label: 'Low Stock', icon: 'bi bi-exclamation-triangle' },
    { id: 'highvalue', label: 'High Value', icon: 'bi bi-gem' }
  ];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.errorMessage = '';

    switch (tabId) {
      case 'dashboard':
        if (!this.dashboardData) this.loadDashboard();
        break;
      case 'variant':
        if (this.inventoryByVariant.length === 0) this.loadInventoryByVariant();
        break;
      case 'size':
        if (this.inventoryBySize.length === 0) this.loadInventoryBySize();
        break;
      case 'category':
        if (this.categoryReport.length === 0) this.loadCategoryReport();
        break;
      case 'lowstock':
        if (this.lowStockReport.length === 0) this.loadLowStockReport();
        break;
      case 'highvalue':
        if (this.highValueReport.length === 0) this.loadHighValueReport();
        break;
    }
  }

  refreshCurrentReport(): void {
    switch (this.activeTab) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'variant':
        this.loadInventoryByVariant();
        break;
      case 'size':
        this.loadInventoryBySize();
        break;
      case 'category':
        this.loadCategoryReport();
        break;
      case 'lowstock':
        this.loadLowStockReport();
        break;
      case 'highvalue':
        this.loadHighValueReport();
        break;
    }
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  loadInventoryByVariant(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getInventoryByVariant().subscribe({
      next: (data) => {
        this.inventoryByVariant = data;
        this.filteredInventory = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory by variant:', error);
        this.errorMessage = 'Failed to load inventory data. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  loadInventoryBySize(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getInventoryByVariantAndSize().subscribe({
      next: (data) => {
        this.inventoryBySize = data;
        this.filteredInventoryBySize = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory by size:', error);
        this.errorMessage = 'Failed to load inventory data. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  loadCategoryReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getCategoryReport().subscribe({
      next: (data) => {
        this.categoryReport = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category report:', error);
        this.errorMessage = 'Failed to load category report. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  loadLowStockReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getLowStockReport(this.lowStockThreshold).subscribe({
      next: (data) => {
        this.lowStockReport = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading low stock report:', error);
        this.errorMessage = 'Failed to load low stock report. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  loadHighValueReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.reportService.getHighValueInventory(this.highValueLimit).subscribe({
      next: (data) => {
        this.highValueReport = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading high value report:', error);
        this.errorMessage = 'Failed to load high value report. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  filterInventory(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredInventory = this.inventoryByVariant.filter(item =>
      item.variantDescription.toLowerCase().includes(term) ||
      item.categoryName.toLowerCase().includes(term) ||
      item.primaryColor?.toLowerCase().includes(term)
    );
  }

  filterInventoryBySize(): void {
    const term = this.searchTermSize.toLowerCase();
    this.filteredInventoryBySize = this.inventoryBySize.filter(item =>
      item.variantDescription.toLowerCase().includes(term) ||
      item.categoryName.toLowerCase().includes(term) ||
      item.size?.toLowerCase().includes(term)
    );
  }

  getPercentage(value: number, total: number): string {
    if (total === 0) return '0';
    return ((value / total) * 100).toFixed(1);
  }

  formatCurrency(value: number): string {
    if (value >= 10000000) return (value / 10000000).toFixed(2) + 'Cr';
    if (value >= 100000) return (value / 100000).toFixed(2) + 'L';
    if (value >= 1000) return (value / 1000).toFixed(2) + 'K';
    return value.toFixed(0);
  }

  getTopCategories(): Array<{ name: string, value: number }> {
    if (!this.dashboardData) return [];
    return Object.entries(this.dashboardData.topCategoriesByCostumes)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 5);
  }

  getSizeDistribution(): Array<{ name: string, value: number }> {
    if (!this.dashboardData) return [];
    return Object.entries(this.dashboardData.sizeDistribution)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 6);
  }

  getMaxValue(items: Array<{ value: number }>): number {
    return Math.max(...items.map(i => i.value), 1);
  }

  getBarWidth(value: number, max: number): number {
    return (value / max) * 100;
  }

  getRandomColor(): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREREREQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS02LTYtNiA2Ii8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAweiIvPgo8L3N2Zz4KPC9zdmc+';
  }
}
