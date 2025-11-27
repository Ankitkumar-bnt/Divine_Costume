import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-costume-options',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h5>Costume</h5>
        <p class="subtitle">Choose how you want to proceed</p>
      </div>

      <div class="grid">
        <div class="card clickable" (click)="goTo('bulk-insert')">
          <div class="icon"><i class="bi bi-file-earmark-excel"></i></div>
          <h6>Bulk insert</h6>
          <p>Upload an Excel to add multiple costumes</p>
        </div>

        <div class="card clickable" (click)="goTo('new')">
          <div class="icon"><i class="bi bi-plus-circle"></i></div>
          <h6>New costume</h6>
          <p>Add a single costume with items</p>
        </div>

        <div class="card clickable" (click)="goToExisting()">
          <div class="icon"><i class="bi bi-collection"></i></div>
          <h6>Existing product</h6>
          <p>View and manage existing inventory</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    .header { margin-bottom: 1rem; }
    .subtitle { color: #6c757d; margin: 0; }

    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center; border: 1px solid #eee; }
    .card h6 { margin: 0.5rem 0; color: #5c1a1a; }
    .card p { margin: 0; color: #6c757d; font-size: 0.9rem; }
    .card.clickable { cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
    .card.clickable:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
    .icon { font-size: 2rem; color: #ffd700; }

    @media (max-width: 992px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CostumeOptionsComponent {
  constructor(private router: Router) {}
  goTo(segment: 'bulk-insert' | 'new') { this.router.navigate([`/admin/add-product/costume/${segment}`]); }
  goToExisting() { this.router.navigate(['/admin/view-products']); }
}
