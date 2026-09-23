import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Toast, ToastType } from '../services/toast';

const VARIANT_CLASS: Record<ToastType, string> = {
  success: 'text-bg-success',
  error: 'text-bg-danger',
  info: 'text-bg-info',
  warning: 'text-bg-warning',
};

@Component({
  selector: 'app-toast',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1080;">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast show border-0 {{ variantClass(t.type) }}" role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <strong>{{ t.title }}</strong>
              <div>{{ t.message }}</div>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              (click)="toast.dismiss(t.id)"
            ></button>
          </div>
        </div>
      }
    </div>

    @if (toast.swal(); as s) {
      <div class="modal-backdrop fade show" style="z-index: 1090;"></div>
      <div class="modal d-block" tabindex="-1" style="z-index: 1091;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ s.title }}</h5>
            </div>
            <div class="modal-body">
              <p class="mb-0">{{ s.question }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="toast.cancelSwal()">
                {{ s.cancelBtnText }}
              </button>
              <button type="button" class="btn btn-danger" (click)="toast.confirmSwal()">
                {{ s.confirmBtnText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export default class AppToast {
  readonly toast = inject(Toast);

  variantClass(type: ToastType) {
    return VARIANT_CLASS[type];
  }
}
