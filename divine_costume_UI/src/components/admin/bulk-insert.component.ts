import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-insert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bulk-insert">
      <div class="page-shell">
        <header class="page-header">
          <div>
            <h1>Bulk Excel Upload</h1>
            <p>Import curated costume data in a single action.</p>
          </div>
          <span class="header-pill">
            <i class="bi bi-cloud-arrow-up"></i>
            <span>.xls & .xlsx supported</span>
          </span>
        </header>

        <section class="surface-card upload-card">
          <div class="surface-header">
            <div>
              <h2>Upload Excel File</h2>
              <span class="surface-subtitle">Select your prepared spreadsheet and trigger the ingest.</span>
            </div>
          </div>

          <div class="upload-body">
            <label class="upload-dropzone">
              <input
                type="file"
                accept=".xlsx,.xls"
                (change)="onFileSelect($event)"
              >
              <div class="dropzone-icon">
                <i class="bi bi-file-earmark-arrow-up"></i>
              </div>
              <div class="dropzone-copy">
                <strong>Click to browse</strong>
                <span>or drag and drop your Excel file here</span>
              </div>
              <span class="file-hint">Maximum compatibility with the provided admin templates.</span>
            </label>

            <div class="file-info" *ngIf="selectedFile">
              <div class="file-detail">
                <i class="bi bi-file-earmark-spreadsheet"></i>
                <div>
                  <span class="file-name">{{ selectedFile.name }}</span>
                  <span class="file-size">{{ selectedFile.size | number }} bytes</span>
                </div>
              </div>
              <button type="button" class="btn primary-action" (click)="uploadExcel()">
                <i class="bi bi-upload"></i>
                Upload Excel
              </button>
            </div>

            <p class="helper-text">
              Ensure your worksheet tabs align with the inventory schema before ingesting.
            </p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .bulk-insert {
      min-height: 100vh;
      padding: clamp(1.5rem, 3vw, 2.75rem);
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-shell {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: clamp(1.5rem, 2.5vw, 2.5rem);
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: clamp(1rem, 2vw, 1.5rem);
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.16);
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
    }

    .page-header h1 {
      margin: 0;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 600;
      color: #1f2937;
    }

    .page-header p {
      margin: 0.35rem 0 0;
      color: #64748b;
      font-size: 0.97rem;
    }

    .header-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.75rem 1.1rem;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(59, 130, 246, 0.3) 100%);
      color: #1d4ed8;
      font-weight: 600;
      box-shadow: 0 12px 28px rgba(59, 130, 246, 0.2);
    }

    .header-pill i {
      font-size: 1.1rem;
    }

    .surface-card {
      background: rgba(255, 255, 255, 0.94);
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
    }

    .surface-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      padding: clamp(1.25rem, 2vw, 1.75rem);
    }

    .surface-header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 600;
      color: #1e293b;
    }

    .surface-subtitle {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .upload-card {
      display: flex;
      flex-direction: column;
      gap: clamp(1.5rem, 2vw, 1.9rem);
    }

    .upload-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 clamp(1.75rem, 2.5vw, 2.25rem) clamp(1.75rem, 2.5vw, 2.25rem);
    }

    .upload-dropzone {
      position: relative;
      width: 100%;
      min-height: 240px;
      border: 2px dashed rgba(99, 102, 241, 0.35);
      border-radius: 22px;
      background: linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(224, 231, 255, 0.9) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      padding: 2.5rem clamp(1.5rem, 2vw, 2rem);
      text-align: center;
      cursor: pointer;
      transition: border 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }

    .upload-dropzone input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .upload-dropzone:hover {
      border-color: rgba(79, 70, 229, 0.6);
      transform: translateY(-2px);
      box-shadow: 0 22px 34px rgba(79, 70, 229, 0.18);
    }

    .dropzone-icon {
      width: 74px;
      height: 74px;
      border-radius: 24px;
      background: rgba(99, 102, 241, 0.18);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      font-size: 2rem;
      box-shadow: 0 18px 32px rgba(99, 102, 241, 0.18);
    }

    .dropzone-copy strong {
      display: block;
      font-size: 1.05rem;
      color: #1e293b;
    }

    .dropzone-copy span {
      display: block;
      margin-top: 0.35rem;
      color: #64748b;
      font-size: 0.9rem;
    }

    .file-hint {
      font-size: 0.82rem;
      color: #6366f1;
    }

    .file-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1rem 1.25rem;
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
    }

    .file-detail {
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      color: #1f2937;
    }

    .file-detail i {
      font-size: 1.8rem;
      color: #22c55e;
      background: rgba(34, 197, 94, 0.12);
      border-radius: 16px;
      padding: 0.6rem;
    }

    .file-name {
      display: block;
      font-weight: 600;
      color: #1e293b;
    }

    .file-size {
      display: block;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .btn {
      border-radius: 14px;
      font-weight: 600;
      padding: 0.85rem 1.65rem;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .primary-action {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #fff;
      box-shadow: 0 18px 32px rgba(79, 70, 229, 0.25);
    }

    .primary-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 26px 48px rgba(79, 70, 229, 0.28);
    }

    .helper-text {
      margin: 0;
      font-size: 0.88rem;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-pill {
        align-self: flex-start;
      }

      .file-info {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 576px) {
      .bulk-insert {
        padding: 1.25rem;
      }

      .upload-dropzone {
        min-height: 200px;
        padding: 2rem 1.5rem;
      }
    }
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
