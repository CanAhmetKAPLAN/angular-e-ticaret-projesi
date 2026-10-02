import { httpResource } from '@angular/common/http';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, TrCurrencyPipe],
  templateUrl: './payment.html',
})
export default class Payment {
  readonly result = httpResource<BasketModel[]>(
    () => `api/baskets?userId=${this.#common.user()?.id}`,
  );
  readonly data = computed(() => this.result.value() ?? []);
  // Ürün fiyatları KDV dahil kabul ediliyor
  readonly total = computed(() =>
    this.data().reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
  );
  readonly subtotal = computed(() => this.total() / 1.18);
  readonly tax = computed(() => this.total() - this.subtotal());

  readonly #common = inject(Common);
}
