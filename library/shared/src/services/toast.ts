import { Service, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastModel {
  id: number;
  title: string;
  message: string;
  type: ToastType;
}

export interface SwalModel {
  title: string;
  question: string;
  confirmBtnText: string;
  cancelBtnText: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Service()
export class Toast {
  readonly toasts = signal<ToastModel[]>([]);
  readonly swal = signal<SwalModel | null>(null);
  #nextId = 0;

  show(title: string, message: string, type: ToastType = 'success', timeOut = 3000) {
    const id = this.#nextId++;
    this.toasts.update((list) => [...list, { id, title, message, type }]);

    if (timeOut > 0) {
      setTimeout(() => this.dismiss(id), timeOut);
    }
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  showSwal(
    title: string,
    question: string,
    confirmBtnText: string,
    onConfirm: () => void,
    cancelBtnText = 'Vazgeç',
    onCancel?: () => void,
  ) {
    this.swal.set({ title, question, confirmBtnText, cancelBtnText, onConfirm, onCancel });
  }

  confirmSwal() {
    const s = this.swal();
    this.swal.set(null);
    s?.onConfirm();
  }

  cancelSwal() {
    const s = this.swal();
    this.swal.set(null);
    s?.onCancel?.();
  }
}
