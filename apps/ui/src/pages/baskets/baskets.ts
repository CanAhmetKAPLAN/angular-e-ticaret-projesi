import { httpResource } from '@angular/common/http';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Common } from '../../services/common';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';

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

  readonly #common = inject(Common);
}
