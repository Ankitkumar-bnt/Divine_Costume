import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService, ItemResponseDto } from '../../services/item.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Statistics Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="bi bi-box-seam"></i>
            </div>
            <div class="stat-content">
              <h3>{{ totalProducts }}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ activeRentals }}</h3>
              <p>Active Rentals</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="stat-content">
              <h3>{{ upcomingBookings }}</h3>
              <p>Upcoming Bookings</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-info">
            <div class="stat-icon">
              <i class="bi bi-currency-rupee"></i>
            </div>
            <div class="stat-content">
              <h3>₹{{ revenueThisMonth | number }}</h3>
              <p>Revenue This Month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Recent Bookings</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Pickup Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let booking of recentBookings">
                  <td>#{{ booking.id }}</td>
                  <td>{{ booking.customerName }}</td>
                  <td>{{ booking.productName }}</td>
                  <td>{{ booking.pickupDate }}</td>
                  <td>{{ booking.returnDate }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': booking.status === 'Active',
                      'bg-warning': booking.status === 'Pending',
                      'bg-secondary': booking.status === 'Returned'
                    }">{{ booking.status }}</span>
                  </td>
                  <td>₹{{ booking.amount }}</td>
                </tr>
                <tr *ngIf="recentBookings.length === 0">
                  <td colspan="7" class="text-center text-muted">No recent bookings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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

    .stat-info {
      border-left-color: #17a2b8;
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

    .stat-info .stat-icon {
      background: rgba(23, 162, 184, 0.1);
      color: #17a2b8;
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

    .badge {
      padding: 0.375rem 0.75rem;
      font-weight: 500;
      font-size: 0.75rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  activeRentals = 12;
  upcomingBookings = 8;
  revenueThisMonth = 45000;

  recentBookings = [
    {
      id: 1001,
      customerName: 'Rajesh Kumar',
      productName: 'Royal Sherwani - Gold',
      pickupDate: '2025-11-15',
      returnDate: '2025-11-17',
      status: 'Active',
      amount: 3500
    },
    {
      id: 1002,
      customerName: 'Priya Sharma',
      productName: 'Bridal Lehenga - Red',
      pickupDate: '2025-11-20',
      returnDate: '2025-11-22',
      status: 'Pending',
      amount: 5000
    },
    {
      id: 1003,
      customerName: 'Amit Patel',
      productName: 'Kids Krishna Costume',
      pickupDate: '2025-11-10',
      returnDate: '2025-11-12',
      status: 'Returned',
      amount: 1500
    }
  ];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.totalProducts = items.length;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
      }
    });
  }
}
