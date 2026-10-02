import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { BasketModel } from '@shared/models/basket.model';
import { UserModel } from '@shared/models/user.model';

@Service()
export class Common {
  readonly user = signal<UserModel | undefined>(undefined);
  readonly basketCount = signal<number>(0);

  readonly #http = inject(HttpClient);

  constructor() {
    this.getBasketCount();
    const response: string | null = localStorage.getItem('response');
    if (response) {
      this.user.set(JSON.parse(response));
    }
  }

  getBasketCount() {
    this.#http
      .get<BasketModel[]>('api/baskets')
      .subscribe((res) => this.basketCount.set(res.length));
  }
}
