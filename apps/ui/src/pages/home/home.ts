import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { ProductModel } from '@shared/models/product.model';
import { TrCurrencyPipe } from 'tr-currency';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [TrCurrencyPipe, InfiniteScrollDirective],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly categoryKey = signal<string | undefined>(undefined);
  readonly categoryKeyPrev = this.computedPrevious(this.categoryKey);
  readonly perPage = 6;
  readonly page = signal<number>(1);
  readonly hasMore = signal<boolean>(true);
  readonly result = httpResource<{ data: ProductModel[]; next: number | null }>(() => {
    let endpoint = 'api/products?';
    if (this.categoryKey()) {
      endpoint += `categoryId=${this.categoryKey()}&`;
    }
    endpoint += `_page=${this.page()}&_per_page=${this.perPage}`;

    return endpoint;
  });
  readonly data = computed(() => this.result.value()?.data ?? []);
  readonly dataSignal = signal<ProductModel[]>([]);

  readonly #activated = inject(ActivatedRoute);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['categoryKey']) {
        this.categoryKey.set(res['categoryKey']);
      }
    });

    effect(() => {
      if (this.categoryKeyPrev() !== this.categoryKey()) {
        this.dataSignal.set([...this.data()]);
        this.page.set(1);
      } else {
        this.dataSignal.update((prev) => [...prev, ...this.data()]);
      }
      this.hasMore.set(this.result.value()?.next != null);
    });
  }

  onScroll() {
    if (!this.hasMore() || this.result.isLoading()) {
      return;
    }
    this.page.update((prev) => prev + 1);
  }

  computedPrevious<T>(s: Signal<T>): Signal<T> {
    let current = null as T;
    let previous = untracked(() => s());

    return computed(() => {
      current = s();
      const result = previous;
      previous = current;
      return result;
    });
  }
}
