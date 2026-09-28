import { inject, Injectable } from '@angular/core';
import { Toast } from './toast';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Error {
  readonly #toast = inject(Toast);

  handle(err: HttpErrorResponse) {
    switch (err.status) {
      case 400:
        this.#toast.show('Hata', err.message, 'error');
        break;
      case 500:
        this.#toast.show('Hata', err.message, 'error');
        break;
      default:
        break;
    }
  }
}
