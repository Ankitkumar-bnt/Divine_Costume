import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Customers</h5>
        </div>
        <div class="card-body">
          <p class="text-muted">Customer management coming soon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    }
    .card-header h5 {
      color: #5c1a1a;
      font-weight: 600;
    }
  `]
})
export class CustomersComponent {}
