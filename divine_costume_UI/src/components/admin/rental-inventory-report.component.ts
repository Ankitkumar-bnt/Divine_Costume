import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  totalQty: number;
  available: number;
  rented: number;
  reserved: number;
  maintenance: number;
}

interface PerformanceItem {
  id: number;
  name: string;
  category: string;
  timesRented: number;
  revenue: number;
  popularity: string;
  trend: string;
}

interface MaintenanceItem {
  id: number;
  name: string;
  category: string;
  lastMaintenance: string;
  repairCost: number;
  condition: string;
  status: string;
}

@Component({
  selector: 'app-rental-inventory-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-report">
      <!-- Header -->
      <div class="report-header">
        <div class="header-content">
          <h2 class="title">📊 Rental Inventory Status</h2>
          <p class="subtitle">Comprehensive costume rental analytics & insights</p>
        </div>
        <button class="export-btn" (click)="exportReport()">
          <i class="bi bi-download"></i> Export Report
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-container">
        <button 
          *ngFor="let tab of tabs" 
          [class.active]="activeTab === tab.id"
          (click)="activeTab = tab.id"
          class="tab-btn">
          <i [class]="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Inventory Report -->
        <div *ngIf="activeTab === 'inventory'" class="report-section fade-in">
          <div class="stats-grid">
            <div class="stat-card gradient-purple">
              <div class="stat-icon">📦</div>
              <div class="stat-info">
                <h3>{{ getTotalInventory() }}</h3>
                <p>Total Costumes</p>
              </div>
            </div>
            <div class="stat-card gradient-green">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ getTotalAvailable() }}</h3>
                <p>Available</p>
              </div>
            </div>
            <div class="stat-card gradient-orange">
              <div class="stat-icon">🎭</div>
              <div class="stat-info">
                <h3>{{ getTotalRented() }}</h3>
                <p>Currently Rented</p>
              </div>
            </div>
            <div class="stat-card gradient-red">
              <div class="stat-icon">🔧</div>
              <div class="stat-info">
                <h3>{{ getTotalMaintenance() }}</h3>
                <p>In Maintenance</p>
              </div>
            </div>
          </div>

          <div class="table-card">
            <h3 class="card-title">Inventory Details</h3>
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Costume Name</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>Rented</th>
                    <th>Reserved</th>
                    <th>Maintenance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of inventoryData">
                    <td class="fw-bold">{{ item.name }}</td>
                    <td><span class="category-badge">{{ item.category }}</span></td>
                    <td>{{ item.totalQty }}</td>
                    <td><span class="badge-success">{{ item.available }}</span></td>
                    <td><span class="badge-warning">{{ item.rented }}</span></td>
                    <td><span class="badge-info">{{ item.reserved }}</span></td>
                    <td><span class="badge-danger">{{ item.maintenance }}</span></td>
                    <td>
                      <div class="progress-bar-mini">
                        <div class="progress-fill" [style.width.%]="(item.available / item.totalQty) * 100"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Performance Report -->
        <div *ngIf="activeTab === 'performance'" class="report-section fade-in">
          <div class="stats-grid">
            <div class="stat-card gradient-blue">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>₹{{ getTotalRevenue() | number }}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div class="stat-card gradient-pink">
              <div class="stat-icon">🔥</div>
              <div class="stat-info">
                <h3>{{ getMostPopular() }}</h3>
                <p>Most Popular</p>
              </div>
            </div>
            <div class="stat-card gradient-cyan">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <h3>{{ getTotalRentals() }}</h3>
                <p>Total Rentals</p>
              </div>
            </div>
            <div class="stat-card gradient-yellow">
              <div class="stat-icon">⭐</div>
              <div class="stat-info">
                <h3>₹{{ getAvgRevenue() | number }}</h3>
                <p>Avg per Rental</p>
              </div>
            </div>
          </div>

          <div class="table-card">
            <h3 class="card-title">Performance Metrics</h3>
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Costume Name</th>
                    <th>Category</th>
                    <th>Times Rented</th>
                    <th>Revenue</th>
                    <th>Popularity</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of performanceData">
                    <td class="fw-bold">{{ item.name }}</td>
                    <td><span class="category-badge">{{ item.category }}</span></td>
                    <td>{{ item.timesRented }}</td>
                    <td class="text-success fw-bold">₹{{ item.revenue | number }}</td>
                    <td>
                      <span [class]="'popularity-badge ' + item.popularity.toLowerCase()">
                        {{ item.popularity }}
                      </span>
                    </td>
                    <td>
                      <span [class]="'trend-badge ' + (item.trend === 'Up' ? 'up' : 'down')">
                        <i [class]="item.trend === 'Up' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                        {{ item.trend }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Maintenance Report -->
        <div *ngIf="activeTab === 'maintenance'" class="report-section fade-in">
          <div class="stats-grid">
            <div class="stat-card gradient-teal">
              <div class="stat-icon">🛠️</div>
              <div class="stat-info">
                <h3>{{ getMaintenanceCount() }}</h3>
                <p>Items in Maintenance</p>
              </div>
            </div>
            <div class="stat-card gradient-purple">
              <div class="stat-icon">💵</div>
              <div class="stat-info">
                <h3>₹{{ getTotalRepairCost() | number }}</h3>
                <p>Total Repair Cost</p>
              </div>
            </div>
            <div class="stat-card gradient-orange">
              <div class="stat-icon">⚠️</div>
              <div class="stat-info">
                <h3>{{ getNeedingRepair() }}</h3>
                <p>Needs Repair</p>
              </div>
            </div>
            <div class="stat-card gradient-green">
              <div class="stat-icon">✨</div>
              <div class="stat-info">
                <h3>{{ getExcellentCondition() }}</h3>
                <p>Excellent Condition</p>
              </div>
            </div>
          </div>

          <div class="table-card">
            <h3 class="card-title">Maintenance History</h3>
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Costume Name</th>
                    <th>Category</th>
                    <th>Last Maintenance</th>
                    <th>Repair Cost</th>
                    <th>Condition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of maintenanceData">
                    <td class="fw-bold">{{ item.name }}</td>
                    <td><span class="category-badge">{{ item.category }}</span></td>
                    <td>{{ item.lastMaintenance }}</td>
                    <td class="text-danger">₹{{ item.repairCost | number }}</td>
                    <td>
                      <span [class]="'condition-badge ' + item.condition.toLowerCase()">
                        {{ item.condition }}
                      </span>
                    </td>
                    <td>
                      <span [class]="'status-badge ' + item.status.toLowerCase().replace(' ', '-')">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-report {
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in {
      animation: fadeIn 0.4s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .report-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 20px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .header-content .title {
      color: white;
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .header-content .subtitle {
      color: rgba(255,255,255,0.9);
      margin: 0.5rem 0 0 0;
      font-size: 1rem;
    }

    .export-btn {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .export-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .tab-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: white;
      padding: 0.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .tab-btn {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      color: #64748b;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .tab-btn:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    }

    .gradient-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .gradient-green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; }
    .gradient-orange { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
    .gradient-red { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
    .gradient-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
    .gradient-pink { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #333; }
    .gradient-cyan { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); color: #333; }
    .gradient-yellow { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; }
    .gradient-teal { background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%); color: white; }

    .stat-icon {
      font-size: 3rem;
      opacity: 0.9;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .stat-info p {
      margin: 0.25rem 0 0 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .table-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .card-title {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-weight: 700;
      font-size: 1.5rem;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .modern-table thead th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .modern-table thead th:first-child {
      border-radius: 12px 0 0 0;
    }

    .modern-table thead th:last-child {
      border-radius: 0 12px 0 0;
    }

    .modern-table tbody tr {
      transition: all 0.3s ease;
    }

    .modern-table tbody tr:hover {
      background: rgba(102, 126, 234, 0.05);
      transform: scale(1.01);
    }

    .modern-table tbody td {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .category-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-success {
      background: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .badge-warning {
      background: #f59e0b;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .badge-info {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .badge-danger {
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .progress-bar-mini {
      width: 100px;
      height: 8px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .popularity-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .popularity-badge.high {
      background: #10b981;
      color: white;
    }

    .popularity-badge.medium {
      background: #f59e0b;
      color: white;
    }

    .popularity-badge.low {
      background: #ef4444;
      color: white;
    }

    .trend-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .trend-badge.up {
      background: #dcfce7;
      color: #166534;
    }

    .trend-badge.down {
      background: #fee2e2;
      color: #991b1b;
    }

    .condition-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .condition-badge.excellent {
      background: #10b981;
      color: white;
    }

    .condition-badge.good {
      background: #3b82f6;
      color: white;
    }

    .condition-badge.fair {
      background: #f59e0b;
      color: white;
    }

    .condition-badge.poor {
      background: #ef4444;
      color: white;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.ready {
      background: #10b981;
      color: white;
    }

    .status-badge.in-maintenance {
      background: #f59e0b;
      color: white;
    }

    .status-badge.needs-repair {
      background: #ef4444;
      color: white;
    }

    .status-badge.cleaning {
      background: #3b82f6;
      color: white;
    }

    .fw-bold {
      font-weight: 600;
      color: #1e293b;
    }

    .text-success {
      color: #10b981;
    }

    .text-danger {
      color: #ef4444;
    }
  `]
})
export class RentalInventoryReportComponent implements OnInit {
  activeTab = 'inventory';

  tabs = [
    { id: 'inventory', label: 'Inventory Status', icon: 'bi bi-box-seam' },
    { id: 'performance', label: 'Performance', icon: 'bi bi-graph-up' },
    { id: 'maintenance', label: 'Maintenance', icon: 'bi bi-tools' }
  ];

  inventoryData: InventoryItem[] = [
    { id: 1, name: 'Bharatanatyam Costume - Silk', category: 'Bharatanatyam', totalQty: 18, available: 10, rented: 6, reserved: 1, maintenance: 1 },
    { id: 2, name: 'Kathak Anarkali - Royal Blue', category: 'Kathak', totalQty: 15, available: 8, rented: 5, reserved: 1, maintenance: 1 },
    { id: 3, name: 'Odissi Dance Costume - Traditional', category: 'Odissi', totalQty: 12, available: 7, rented: 4, reserved: 1, maintenance: 0 },
    { id: 4, name: 'Kuchipudi Costume Set', category: 'Kuchipudi', totalQty: 14, available: 9, rented: 4, reserved: 0, maintenance: 1 },
    { id: 5, name: 'Mohiniyattam White Kasavu', category: 'Mohiniyattam', totalQty: 10, available: 6, rented: 3, reserved: 1, maintenance: 0 },
    { id: 6, name: 'Kathakali Character Costume', category: 'Kathakali', totalQty: 8, available: 4, rented: 2, reserved: 1, maintenance: 1 },
    { id: 7, name: 'Manipuri Dance Dress', category: 'Manipuri', totalQty: 12, available: 7, rented: 4, reserved: 0, maintenance: 1 },
    { id: 8, name: 'Bharatanatyam Costume - Cotton', category: 'Bharatanatyam', totalQty: 16, available: 10, rented: 5, reserved: 1, maintenance: 0 }
  ];

  performanceData: PerformanceItem[] = [
    { id: 1, name: 'Bharatanatyam Costume - Silk', category: 'Bharatanatyam', timesRented: 52, revenue: 156000, popularity: 'High', trend: 'Up' },
    { id: 2, name: 'Kathak Anarkali - Royal Blue', category: 'Kathak', timesRented: 45, revenue: 135000, popularity: 'High', trend: 'Up' },
    { id: 3, name: 'Odissi Dance Costume - Traditional', category: 'Odissi', timesRented: 38, revenue: 114000, popularity: 'High', trend: 'Up' },
    { id: 4, name: 'Kuchipudi Costume Set', category: 'Kuchipudi', timesRented: 32, revenue: 96000, popularity: 'Medium', trend: 'Up' },
    { id: 5, name: 'Mohiniyattam White Kasavu', category: 'Mohiniyattam', timesRented: 28, revenue: 84000, popularity: 'Medium', trend: 'Down' },
    { id: 6, name: 'Kathakali Character Costume', category: 'Kathakali', timesRented: 22, revenue: 88000, popularity: 'Medium', trend: 'Up' },
    { id: 7, name: 'Manipuri Dance Dress', category: 'Manipuri', timesRented: 30, revenue: 90000, popularity: 'Medium', trend: 'Up' },
    { id: 8, name: 'Bharatanatyam Costume - Cotton', category: 'Bharatanatyam', timesRented: 48, revenue: 120000, popularity: 'High', trend: 'Up' }
  ];

  maintenanceData: MaintenanceItem[] = [
    { id: 1, name: 'Bharatanatyam Costume - Silk', category: 'Bharatanatyam', lastMaintenance: '2025-11-18', repairCost: 2800, condition: 'Good', status: 'Ready' },
    { id: 2, name: 'Kathak Anarkali - Royal Blue', category: 'Kathak', lastMaintenance: '2025-11-20', repairCost: 3200, condition: 'Excellent', status: 'Ready' },
    { id: 3, name: 'Odissi Dance Costume - Traditional', category: 'Odissi', lastMaintenance: '2025-11-15', repairCost: 2500, condition: 'Excellent', status: 'Ready' },
    { id: 4, name: 'Kuchipudi Costume Set', category: 'Kuchipudi', lastMaintenance: '2025-11-12', repairCost: 1800, condition: 'Good', status: 'Ready' },
    { id: 5, name: 'Mohiniyattam White Kasavu', category: 'Mohiniyattam', lastMaintenance: '2025-11-22', repairCost: 1500, condition: 'Excellent', status: 'Ready' },
    { id: 6, name: 'Kathakali Character Costume', category: 'Kathakali', lastMaintenance: '2025-11-10', repairCost: 3500, condition: 'Fair', status: 'In Maintenance' },
    { id: 7, name: 'Manipuri Dance Dress', category: 'Manipuri', lastMaintenance: '2025-11-08', repairCost: 2200, condition: 'Poor', status: 'Needs Repair' },
    { id: 8, name: 'Bharatanatyam Costume - Cotton', category: 'Bharatanatyam', lastMaintenance: '2025-11-19', repairCost: 1200, condition: 'Good', status: 'Cleaning' }
  ];

  ngOnInit(): void { }

  // Inventory calculations
  getTotalInventory(): number {
    return this.inventoryData.reduce((sum, item) => sum + item.totalQty, 0);
  }

  getTotalAvailable(): number {
    return this.inventoryData.reduce((sum, item) => sum + item.available, 0);
  }

  getTotalRented(): number {
    return this.inventoryData.reduce((sum, item) => sum + item.rented, 0);
  }

  getTotalMaintenance(): number {
    return this.inventoryData.reduce((sum, item) => sum + item.maintenance, 0);
  }

  // Performance calculations
  getTotalRevenue(): number {
    return this.performanceData.reduce((sum, item) => sum + item.revenue, 0);
  }

  getTotalRentals(): number {
    return this.performanceData.reduce((sum, item) => sum + item.timesRented, 0);
  }

  getMostPopular(): string {
    const sorted = [...this.performanceData].sort((a, b) => b.timesRented - a.timesRented);
    return sorted[0]?.name.split('-')[0].trim() || 'N/A';
  }

  getAvgRevenue(): number {
    const total = this.getTotalRevenue();
    const rentals = this.getTotalRentals();
    return rentals > 0 ? total / rentals : 0;
  }

  // Maintenance calculations
  getMaintenanceCount(): number {
    return this.maintenanceData.filter(item => item.status === 'In Maintenance').length;
  }

  getTotalRepairCost(): number {
    return this.maintenanceData.reduce((sum, item) => sum + item.repairCost, 0);
  }

  getNeedingRepair(): number {
    return this.maintenanceData.filter(item => item.status === 'Needs Repair').length;
  }

  getExcellentCondition(): number {
    return this.maintenanceData.filter(item => item.condition === 'Excellent').length;
  }

  exportReport(): void {
    alert('Export functionality - Download as CSV/PDF');
  }
}
