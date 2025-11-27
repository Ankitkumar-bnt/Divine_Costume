import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ornaments-bulk-insert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Ornaments Bulk Insert</h2>
      <p>Bulk insert ornaments functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
    h2 {
      color: #7A1F2A;
      margin-bottom: 1rem;
    }
  `]
})
export class OrnamentsBulkInsertComponent {
}
