import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Common } from '../../services/common';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { Toast } from '@shared/services/toast';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [TrCurrencyPipe],
  templateUrl: './baskets.html',
})
export default class Baskets {
  readonly result = httpResource<BasketModel[]>(() => {
    const endpoint = `api/baskets?userId=${this.#common.user()?.id}`;
    return endpoint;
  });
  readonly data = computed(() => this.result.value() ?? []);
  // Ürün fiyatları KDV dahil kabul ediliyor
  readonly total = computed(() =>
    this.data().reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
  );
  readonly subtotal = computed(() => this.total() / 1.18);
  readonly tax = computed(() => this.total() - this.subtotal());

  readonly #common = inject(Common);
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);

  changeQuantity(item: BasketModel, change: number) {
    const quantity = item.quantity + change;
    if (quantity < 1) {
      return;
    }

    this.#http
      .patch<BasketModel>(`api/baskets/${item.id}`, { quantity })
      .subscribe(() => {
        this.result.update((prev) =>
          prev?.map((b) => (b.id === item.id ? { ...b, quantity } : b))
        );
        this.#common.basketCount.update((prev) => prev + change);
      });
  }

  remove(item: BasketModel) {
    this.#http.delete(`api/baskets/${item.id}`).subscribe(() => {
      this.result.update((prev) => prev?.filter((b) => b.id !== item.id));
      this.#common.basketCount.update((prev) => prev - item.quantity);
      this.#toast.show('Başarılı', 'Ürün sepetten kaldırıldı');
    });
  }
}
