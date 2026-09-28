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
  readonly page = signal<number>(1);
  readonly result = httpResource<{ data: ProductModel[]; pages: number }>(
    () => {
      const endpoint = `${api}/products?_page=${this.page()}&_per_page=${this.limit()}`;
      return endpoint;
    },
  );
  readonly data = computed(() => this.result.value()?.data ?? []);
  readonly totalPages = computed(() => this.result.value()?.pages ?? 1);
  readonly dataSignal = signal<ProductModel[]>([]);

  constructor() {
    effect(() => {
      this.dataSignal.update((prev) => [...prev, ...this.data()]);
    });
  }

  onScroll() {
    if (this.page() < this.totalPages()) {
      this.page.update((prev) => prev + 1);
    }
  }
}
