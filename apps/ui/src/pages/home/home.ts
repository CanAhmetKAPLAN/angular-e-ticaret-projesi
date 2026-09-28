import { httpResource } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ProductModel } from '@shared/models/product.model';
import { api } from '../../constants';
import { TrCurrencyPipe } from 'tr-currency';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [TrCurrencyPipe, InfiniteScrollDirective],
  templateUrl: './home.html',
})
export default class Home {
  readonly limit = signal<number>(6);
  readonly start = signal<number>(0);
  readonly result = httpResource<ProductModel[]>(() => {
    const endpoint = `${api}/products?_limit=${this.limit()}&_start=${this.start()}`;
    return endpoint;
  });
  readonly data = computed(() => this.result.value() ?? []);
  readonly dataSignal = signal<ProductModel[]>([]);

  constructor() {
    effect(() => {
      this.dataSignal.update((prev) => [...prev, ...this.data()]);
    });
  }

  onScroll() {
    this.start.update((prev) => prev + this.limit());
  }
}
