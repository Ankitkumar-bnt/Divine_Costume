import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-insert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Bulk Insert (Excel)</h5>
        </div>
        <div class="card-body">
          <div class="form-section">
            <h6 class="section-title"><i class="bi bi-file-earmark-excel"></i> Upload Excel File</h6>
            <div class="row g-3">
              <div class="col-12">
                <input type="file" class="form-control" (change)="onFileSelect($event)" accept=".xlsx,.xls">
                <small class="text-muted">Upload an Excel file (.xlsx or .xls) with product data</small>
              </div>
              <div class="col-12" *ngIf="selectedFile">
                <button type="button" class="btn btn-outline-primary" (click)="uploadExcel()">
                  <i class="bi bi-upload"></i> Upload Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none; }
    .card-header { background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%); color: #fff; border-radius: 12px 12px 0 0; padding: 1.25rem 1.5rem; }
    .card-body { padding: 2rem; }
    .form-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #e9ecef; }
    .section-title { color: #5c1a1a; font-weight: 600; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
    .section-title i { color: #28a745; }
    .btn { padding: 0.625rem 1.5rem; border-radius: 8px; font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; }
    .btn-outline-primary { color: #5c1a1a; border-color: #5c1a1a; }
    .btn-outline-primary:hover { background: #5c1a1a; border-color: #5c1a1a; color: #fff; }
  `]
})
export class BulkInsertComponent {
  selectedFile: File | null = null;
  constructor(private itemService: ItemService) {}

  onFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.selectedFile = file;
  }

  uploadExcel(): void {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an Excel file to upload.',
        confirmButtonColor: '#5c1a1a'
      });
      return;
    }

    this.itemService.uploadExcel(this.selectedFile).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Excel Uploaded Successfully! ✅',
          text: `${response.data.length} products parsed from Excel.`,
          confirmButtonColor: '#5c1a1a'
        });
        this.selectedFile = null;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: err.error?.message || 'Failed to upload Excel file.',
          confirmButtonColor: '#5c1a1a'
        });
      }
    });
  }
}
