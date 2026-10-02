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
    const response: string | null = localStorage.getItem('response');
    if (response) {
      this.user.set(JSON.parse(response));
    }
    this.getBasketCount();
  }

  getBasketCount() {
    const userId = this.user()?.id;
    if (!userId) {
      this.basketCount.set(0);
      return;
    }

    this.#http
      .get<BasketModel[]>(`api/baskets?userId=${userId}`)
      .subscribe((res) =>
        this.basketCount.set(res.reduce((sum, b) => sum + b.quantity, 0))
      );
  }

  clearUser() {
    this.user.set(undefined);
    this.basketCount.set(0);
  }
}
