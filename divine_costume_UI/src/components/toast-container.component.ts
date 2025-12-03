import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-info]="toast.type === 'info'"
        [class.toast-error]="toast.type === 'error'">
        <div class="toast-content">
          <span class="toast-icon">
            <ng-container [ngSwitch]="toast.type">
              <span *ngSwitchCase="'success'">✓</span>
              <span *ngSwitchCase="'info'">ℹ</span>
              <span *ngSwitchCase="'error'">✕</span>
            </ng-container>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <div class="toast-actions">
          <button 
            *ngIf="toast.actionLabel" 
            class="toast-action-btn"
            (click)="handleAction(toast)">
            {{ toast.actionLabel }}
          </button>
          <button class="toast-close-btn" (click)="dismiss(toast.id)" aria-label="Close">
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-width: 320px;
      animation: slideIn 0.15s ease-out;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #16A34A;
    }

    .toast-info {
      border-left-color: #3B82F6;
    }

    .toast-error {
      border-left-color: #DC2626;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      background: #DCFCE7;
      color: #16A34A;
    }

    .toast-info .toast-icon {
      background: #DBEAFE;
      color: #3B82F6;
    }

    .toast-error .toast-icon {
      background: #FEE2E2;
      color: #DC2626;
    }

    .toast-message {
      color: #1B1B1B;
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .toast-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .toast-action-btn {
      background: transparent;
      border: none;
      color: #7A1F2A;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .toast-action-btn:hover {
      background: #FFF8EE;
    }

    .toast-close-btn {
      background: transparent;
      border: none;
      color: #6B7280;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: all 0.2s;
      line-height: 1;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-close-btn:hover {
      background: #F3F4F6;
      color: #1B1B1B;
    }

    @media (max-width: 576px) {
      .toast-container {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }

      .toast {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  handleAction(toast: Toast) {
    if (toast.onAction) {
      toast.onAction();
    }
    this.dismiss(toast.id);
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
