import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h5>Add Product</h5>
        <p class="subtitle">Choose what you want to add</p>
      </div>

      <div class="grid">
        <div class="card clickable" (click)="goToCostume()">
          <div class="icon"><i class="bi bi-person-gear"></i></div>
          <h6>Costume</h6>
          <p>Add rental costumes and variants</p>
        </div>

        <div class="card disabled">
          <div class="icon"><i class="bi bi-gem"></i></div>
          <h6>Ornaments</h6>
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    .header { margin-bottom: 1rem; }
    .subtitle { color: #6c757d; margin: 0; }

    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center; border: 1px solid #eee; }
    .card h6 { margin: 0.5rem 0; color: #5c1a1a; }
    .card p { margin: 0; color: #6c757d; font-size: 0.9rem; }
    .card.clickable { cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
    .card.clickable:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
    .card.disabled { opacity: .6; cursor: not-allowed; }
    .icon { font-size: 2rem; color: #ffd700; }

    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AddProductLandingComponent {
  constructor(private router: Router) {}
  goToCostume() { this.router.navigate(['/admin/add-product/costume']); }
}
