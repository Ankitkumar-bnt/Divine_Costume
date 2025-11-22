import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportData {
  totalRevenue: number;
  mostRentedCategory: string;
  pendingReturns: number;
  monthlyData: MonthlyData[];
}

interface MonthlyData {
  month: string;
  rentals: number;
  revenue: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports">
      <!-- Date Range Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label">From Date</label>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="fromDate">
            </div>
            <div class="col-md-4">
              <label class="form-label">To Date</label>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="toDate">
            </div>
            <div class="col-md-4">
              <button class="btn btn-primary w-100" (click)="generateReport()">
                <i class="bi bi-file-earmark-bar-graph"></i> Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="bi bi-currency-rupee"></i>
            </div>
            <div class="stat-content">
              <h3>₹{{ reportData.totalRevenue | number }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="bi bi-trophy"></i>
            </div>
            <div class="stat-content">
              <h3>{{ reportData.mostRentedCategory }}</h3>
              <p>Most Rented Category</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-content">
              <h3>{{ reportData.pendingReturns }}</h3>
              <p>Pending Returns</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Summary Table -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Monthly Rental Summary</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Rentals</th>
                  <th>Revenue Generated</th>
                  <th>Average per Rental</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let data of reportData.monthlyData">
                  <td class="fw-bold">{{ data.month }}</td>
                  <td>{{ data.rentals }}</td>
                  <td class="text-success fw-bold">₹{{ data.revenue | number }}</td>
                  <td class="text-primary">₹{{ (data.revenue / data.rentals) | number:'1.0-0' }}</td>
                </tr>
                <tr *ngIf="reportData.monthlyData.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">
                    No data available for selected period
                  </td>
                </tr>
              </tbody>
              <tfoot *ngIf="reportData.monthlyData.length > 0">
                <tr class="table-active">
                  <td class="fw-bold">Total</td>
                  <td class="fw-bold">{{ getTotalRentals() }}</td>
                  <td class="fw-bold text-success">₹{{ getTotalRevenue() | number }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="card mt-4">
        <div class="card-header">
          <h5 class="mb-0">Category-wise Performance</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6" *ngFor="let category of categoryData">
              <div class="category-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0">{{ category.name }}</h6>
                  <span class="badge bg-primary">{{ category.rentals }} rentals</span>
                </div>
                <div class="progress" style="height: 25px;">
                  <div 
                    class="progress-bar bg-success" 
                    [style.width.%]="(category.revenue / reportData.totalRevenue) * 100"
                    role="progressbar">
                    ₹{{ category.revenue | number }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #5c1a1a;
      box-shadow: 0 0 0 0.2rem rgba(92, 26, 26, 0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      border: none;
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4a1515 0%, #6a1e1e 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(92, 26, 26, 0.3);
    }

    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-left: 4px solid;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .stat-primary {
      border-left-color: #5c1a1a;
    }

    .stat-success {
      border-left-color: #28a745;
    }

    .stat-warning {
      border-left-color: #ffc107;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }

    .stat-primary .stat-icon {
      background: rgba(92, 26, 26, 0.1);
      color: #5c1a1a;
    }

    .stat-success .stat-icon {
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }

    .stat-warning .stat-icon {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }

    .stat-content p {
      margin: 0.25rem 0 0 0;
      color: #6c757d;
      font-size: 0.875rem;
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
    }

    .table tbody td {
      padding: 0.875rem;
      vertical-align: middle;
    }

    .table tfoot td {
      padding: 0.875rem;
      font-size: 1.1rem;
    }

    .category-card {
      background: #f8f9fa;
      padding: 1.25rem;
      border-radius: 10px;
      border: 1px solid #e9ecef;
    }

    .category-card h6 {
      color: #5c1a1a;
      font-weight: 600;
    }

    .progress {
      background: #e9ecef;
      border-radius: 8px;
      overflow: hidden;
    }

    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      transition: width 0.6s ease;
    }

    .badge {
      padding: 0.375rem 0.75rem;
      font-weight: 500;
      font-size: 0.75rem;
    }
  `]
})
export class ReportsComponent implements OnInit {
  fromDate = '';
  toDate = '';

  reportData: ReportData = {
    totalRevenue: 125000,
    mostRentedCategory: 'Wedding',
    pendingReturns: 5,
    monthlyData: []
  };

  categoryData = [
    { name: 'Wedding', rentals: 45, revenue: 67500 },
    { name: 'Traditional', rentals: 32, revenue: 38400 },
    { name: 'Kids', rentals: 28, revenue: 16800 },
    { name: 'Party Wear', rentals: 15, revenue: 22500 }
  ];

  ngOnInit(): void {
    this.setDefaultDates();
    this.generateReport();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.fromDate = firstDay.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
  }

  generateReport(): void {
    // Mock data - Replace with actual API call
    this.reportData.monthlyData = [
      { month: 'January 2025', rentals: 25, revenue: 37500 },
      { month: 'February 2025', rentals: 30, revenue: 45000 },
      { month: 'March 2025', rentals: 28, revenue: 42000 },
      { month: 'April 2025', rentals: 35, revenue: 52500 },
      { month: 'May 2025', rentals: 32, revenue: 48000 }
    ];
  }

  getTotalRentals(): number {
    return this.reportData.monthlyData.reduce((sum, data) => sum + data.rentals, 0);
  }

  getTotalRevenue(): number {
    return this.reportData.monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  }
}
