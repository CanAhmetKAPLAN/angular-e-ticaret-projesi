import { HttpClient, httpResource } from '@angular/common/http';
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
import { CategoryModel } from '@shared/models/category.model';
import { BasketModel } from '@shared/models/basket.model';
import { slugify } from '@shared/utils/slug';
import { TrCurrencyPipe } from 'tr-currency';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router } from '@angular/router';
import { api } from '../../constants';
import { Toast } from '@shared/services/toast';
import { Common } from '../../services/common';

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
  readonly placeholders = Array.from({ length: this.perPage });
  readonly page = signal<number>(1);
  readonly hasMore = signal<boolean>(true);

  readonly categoriesResult = httpResource<CategoryModel[]>(
    () => `${api}/categories`,
  );
  readonly categoryId = computed(() => {
    const key = this.categoryKey();
    if (!key) {
      return undefined;
    }
    return this.categoriesResult
      .value()
      ?.find((category) => slugify(category.name) === key)?.id;
  });

  readonly result = httpResource<{ data: ProductModel[]; next: number | null }>(
    () => {
      if (this.categoryKey() && !this.categoryId()) {
        return undefined;
      }

      let endpoint = 'api/products?';
      if (this.categoryId()) {
        endpoint += `categoryId=${this.categoryId()}&`;
      }
      endpoint += `_page=${this.page()}&_per_page=${this.perPage}`;

      return endpoint;
    },
  );
  readonly data = computed(() => this.result.value()?.data ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly dataSignal = signal<ProductModel[]>([]);

  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);
  readonly #common = inject(Common);
  readonly #router = inject(Router);

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

  addBasket(data: ProductModel) {
    const userId = this.#common.user()?.id;
    if (!userId) {
      this.#toast.show(
        'Uyarı',
        'Sepete eklemek için giriş yapmalısınız',
        'warning',
      );
      this.#router.navigateByUrl('/auth/login');
      return;
    }

    const basket: BasketModel = {
      userId,
      productID: data.id,
      productName: data.name,
      price: data.price,
      quantity: 1,
    };

    this.#http.post('api/baskets', basket).subscribe((res) => {
      this.#toast.show('Başarılı', 'Ürün sepete başarıyla eklendi');
      this.#common.basketCount.update((prev) => prev + 1);
    });
  }
}
