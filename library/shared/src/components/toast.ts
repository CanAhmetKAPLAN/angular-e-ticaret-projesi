import { Component, inject } from '@angular/core';
import { Toast, ToastType } from '../services/toast';

const VARIANT_COLOR: Record<ToastType, string> = {
  success: '#28a745',
  error: '#dc3545',
  info: '#17a2b8',
  warning: '#ffc107',
};

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
    <div class="toast-container">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-item" [style.borderLeftColor]="variantColor(t.type)">
          <div class="toast-body">
            <strong>{{ t.title }}</strong>
            <div>{{ t.message }}</div>
          </div>
          <button
            type="button"
            class="toast-close"
            aria-label="Kapat"
            (click)="toast.dismiss(t.id)"
          >
            &times;
          </button>
        </div>
      }
    </div>

    @if (toast.swal(); as s) {
      <div class="swal-backdrop"></div>
      <div class="swal-dialog" role="dialog">
        <h5>{{ s.title }}</h5>
        <p>{{ s.question }}</p>
        <div class="swal-actions">
          <button type="button" class="swal-btn swal-btn-secondary" (click)="toast.cancelSwal()">
            {{ s.cancelBtnText }}
          </button>
          <button type="button" class="swal-btn swal-btn-danger" (click)="toast.confirmSwal()">
            {{ s.confirmBtnText }}
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .toast-item {
      background: white;
      border-left: 4px solid;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 1rem 1.25rem;
      min-width: 280px;
      max-width: 360px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .toast-body strong {
      display: block;
      margin-bottom: 0.25rem;
      color: #333;
    }

    .toast-body div {
      color: #555;
      font-size: 0.9rem;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      color: #999;
    }

    .swal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2010;
    }

    .swal-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      width: 90%;
      max-width: 400px;
      z-index: 2011;
    }

    .swal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .swal-btn {
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1.25rem;
      cursor: pointer;
      font-weight: 600;
    }

    .swal-btn-secondary {
      background: #e9ecef;
      color: #333;
    }

    .swal-btn-danger {
      background: #dc3545;
      color: white;
    }
  `,
})
export default class AppToast {
  readonly toast = inject(Toast);

  variantColor(type: ToastType) {
    return VARIANT_COLOR[type];
  }
}
