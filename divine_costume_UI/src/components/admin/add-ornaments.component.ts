import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-ornaments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Add Ornaments</h2>
      <p>Add ornaments functionality will be implemented here.</p>
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
export class AddOrnamentsComponent {
}
