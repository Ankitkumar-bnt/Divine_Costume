import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  productId: number;
  pickupDate: string;
  returnDate: string;
  status: 'Active' | 'Pending' | 'Returned' | 'Cancelled';
  rentalAmount: number;
  depositAmount: number;
  totalAmount: number;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bookings">
      <!-- Filter Section -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="filterBookings()"
                  placeholder="Search by customer name or booking ID...">
              </div>
            </div>
            <div class="col-md-4">
              <select 
                class="form-select" 
                [(ngModel)]="filterStatus"
                (ngModelChange)="filterBookings()">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div class="col-md-4">
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="filterDate"
                (ngModelChange)="filterBookings()"
                placeholder="Filter by date">
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Bookings / Rentals ({{ filteredBookings.length }})</h5>
            <div class="header-actions">
              <span class="badge bg-success me-2">Active: {{ getStatusCount('Active') }}</span>
              <span class="badge bg-warning me-2">Pending: {{ getStatusCount('Pending') }}</span>
              <span class="badge bg-secondary">Returned: {{ getStatusCount('Returned') }}</span>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th>Contact</th>
                  <th>Product Name</th>
                  <th>Pickup Date</th>
                  <th>Return Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let booking of filteredBookings">
                  <td class="fw-bold">#{{ booking.id }}</td>
                  <td>
                    <strong>{{ booking.customerName }}</strong>
                  </td>
                  <td>
                    <small>{{ booking.customerEmail }}</small><br>
                    <small>{{ booking.customerPhone }}</small>
                  </td>
                  <td>{{ booking.productName }}</td>
                  <td>{{ booking.pickupDate | date: 'dd MMM yyyy' }}</td>
                  <td>{{ booking.returnDate | date: 'dd MMM yyyy' }}</td>
                  <td class="text-primary fw-bold">₹{{ booking.totalAmount }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': booking.status === 'Active',
                      'bg-warning': booking.status === 'Pending',
                      'bg-secondary': booking.status === 'Returned',
                      'bg-danger': booking.status === 'Cancelled'
                    }">{{ booking.status }}</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-outline-primary"
                        (click)="viewBookingDetails(booking)"
                        title="View Details">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        *ngIf="booking.status === 'Active'"
                        class="btn btn-sm btn-outline-success"
                        (click)="markAsReturned(booking)"
                        title="Mark as Returned">
                        <i class="bi bi-check-circle"></i>
                      </button>
                      <button 
                        *ngIf="booking.status === 'Pending'"
                        class="btn btn-sm btn-outline-danger"
                        (click)="cancelBooking(booking)"
                        title="Cancel">
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredBookings.length === 0">
                  <td colspan="9" class="text-center text-muted py-4">
                    <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                    <p class="mt-2">No bookings found</p>
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
    .bookings {
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

    .header-actions {
      display: flex;
      align-items: center;
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

    .btn-outline-success {
      color: #28a745;
      border-color: #28a745;
    }

    .btn-outline-success:hover {
      background: #28a745;
      color: #fff;
    }

    .btn-outline-danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn-outline-danger:hover {
      background: #dc3545;
      color: #fff;
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  searchTerm = '';
  filterStatus = '';
  filterDate = '';

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    // Mock data - Replace with actual API call
    this.bookings = [
      {
        id: 1001,
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh@example.com',
        customerPhone: '+91 98765 43210',
        productName: 'Royal Sherwani - Gold Embroidery',
        productId: 101,
        pickupDate: '2025-11-15',
        returnDate: '2025-11-17',
        status: 'Active',
        rentalAmount: 3000,
        depositAmount: 5000,
        totalAmount: 8000
      },
      {
        id: 1002,
        customerName: 'Priya Sharma',
        customerEmail: 'priya@example.com',
        customerPhone: '+91 98765 43211',
        productName: 'Bridal Lehenga - Red & Gold',
        productId: 102,
        pickupDate: '2025-11-20',
        returnDate: '2025-11-22',
        status: 'Pending',
        rentalAmount: 4500,
        depositAmount: 7000,
        totalAmount: 11500
      },
      {
        id: 1003,
        customerName: 'Amit Patel',
        customerEmail: 'amit@example.com',
        customerPhone: '+91 98765 43212',
        productName: 'Kids Krishna Costume',
        productId: 103,
        pickupDate: '2025-11-10',
        returnDate: '2025-11-12',
        status: 'Returned',
        rentalAmount: 1200,
        depositAmount: 2000,
        totalAmount: 3200
      },
      {
        id: 1004,
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha@example.com',
        customerPhone: '+91 98765 43213',
        productName: 'Traditional Saree - Silk',
        productId: 104,
        pickupDate: '2025-11-18',
        returnDate: '2025-11-20',
        status: 'Active',
        rentalAmount: 2500,
        depositAmount: 4000,
        totalAmount: 6500
      }
    ];
    this.filteredBookings = [...this.bookings];
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = !this.searchTerm || 
        booking.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.id.toString().includes(this.searchTerm);
      
      const matchesStatus = !this.filterStatus || booking.status === this.filterStatus;
      
      const matchesDate = !this.filterDate || 
        booking.pickupDate === this.filterDate || 
        booking.returnDate === this.filterDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  getStatusCount(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
  }

  viewBookingDetails(booking: Booking): void {
    Swal.fire({
      title: `Booking #${booking.id}`,
      html: `
        <div style="text-align: left;">
          <h6><strong>Customer Details:</strong></h6>
          <p><strong>Name:</strong> ${booking.customerName}</p>
          <p><strong>Email:</strong> ${booking.customerEmail}</p>
          <p><strong>Phone:</strong> ${booking.customerPhone}</p>
          <hr>
          <h6><strong>Booking Details:</strong></h6>
          <p><strong>Product:</strong> ${booking.productName}</p>
          <p><strong>Pickup Date:</strong> ${booking.pickupDate}</p>
          <p><strong>Return Date:</strong> ${booking.returnDate}</p>
          <p><strong>Status:</strong> <span class="badge bg-${booking.status === 'Active' ? 'success' : booking.status === 'Pending' ? 'warning' : 'secondary'}">${booking.status}</span></p>
          <hr>
          <h6><strong>Payment Details:</strong></h6>
          <p><strong>Rental Amount:</strong> ₹${booking.rentalAmount}</p>
          <p><strong>Deposit Amount:</strong> ₹${booking.depositAmount}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
        </div>
      `,
      confirmButtonColor: '#5c1a1a',
      width: '600px'
    });
  }

  markAsReturned(booking: Booking): void {
    Swal.fire({
      title: 'Mark as Returned?',
      text: `Confirm that ${booking.customerName} has returned the product?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, mark as returned',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        booking.status = 'Returned';
        Swal.fire({
          icon: 'success',
          title: 'Marked as Returned!',
          text: 'Stock has been updated.',
          confirmButtonColor: '#5c1a1a'
        });
        this.filterBookings();
      }
    });
  }

  cancelBooking(booking: Booking): void {
    Swal.fire({
      title: 'Cancel Booking?',
      text: `Are you sure you want to cancel booking #${booking.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        booking.status = 'Cancelled';
        Swal.fire({
          icon: 'success',
          title: 'Booking Cancelled!',
          text: 'The booking has been cancelled.',
          confirmButtonColor: '#5c1a1a'
        });
        this.filterBookings();
      }
    });
  }
}
