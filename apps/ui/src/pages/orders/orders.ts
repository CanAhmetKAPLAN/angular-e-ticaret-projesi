import { httpResource } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Common } from '../../services/common';
import { OrderModel } from '@shared/models/order.model';
import { TrCurrencyPipe } from 'tr-currency';

const PAGE_SIZE = 4;

const STATUS_STYLES: Record<string, { css: string; icon: string }> = {
  Hazırlanıyor: { css: 'pending', icon: 'fa-clock' },
  Kargoda: { css: 'shipped', icon: 'fa-truck' },
  'Teslim Edildi': { css: 'delivered', icon: 'fa-check-circle' },
  'İptal Edildi': { css: 'cancelled', icon: 'fa-times-circle' },
};

const TIME_RANGES: Record<string, number> = {
  week: 7,
  month: 30,
  '3months': 90,
  year: 365,
};

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [TrCurrencyPipe, FormsModule],
  templateUrl: './orders.html',
})
export default class Orders {
  readonly #common = inject(Common);

  readonly limit = signal<number>(PAGE_SIZE);
  readonly search = signal<string>('');
  readonly statusFilter = signal<string>('');
  readonly timeFilter = signal<string>('');

  readonly result = httpResource<OrderModel[]>(() => {
    const userId = this.#common.user()?.id;
    return userId ? `api/orders?userId=${userId}` : undefined;
  });

  readonly allOrders = computed(() =>
    [...(this.result.value() ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );

  readonly filteredOrders = computed(() => {
    const term = this.search().trim().toLocaleLowerCase('tr');
    const status = this.statusFilter();
    const days = TIME_RANGES[this.timeFilter()];
    const minDate = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;

    return this.allOrders().filter(
      (order) =>
        (!status || order.status === status) &&
        new Date(order.date).getTime() >= minDate &&
        (!term ||
          order.orderNumber.toLocaleLowerCase('tr').includes(term) ||
          order.baskets.some((b) =>
            b.productName.toLocaleLowerCase('tr').includes(term),
          )),
    );
  });

  readonly data = computed(() => this.filteredOrders().slice(0, this.limit()));
  readonly hasMore = computed(
    () => this.filteredOrders().length > this.limit(),
  );

  readonly totalCount = computed(() => this.allOrders().length);
  readonly waitingCount = computed(
    () =>
      this.allOrders().filter(
        (o) => o.status === 'Hazırlanıyor' || o.status === 'Kargoda',
      ).length,
  );
  readonly completedCount = computed(
    () => this.allOrders().filter((o) => o.status === 'Teslim Edildi').length,
  );

  showMore() {
    this.limit.update((prev) => prev + PAGE_SIZE);
  }

  resetFilters() {
    this.search.set('');
    this.statusFilter.set('');
    this.timeFilter.set('');
    this.limit.set(PAGE_SIZE);
  }

  orderTotal(order: OrderModel) {
    return order.baskets.reduce(
      (sum, b) => sum + b.productPrice * b.quantity,
      0,
    );
  }

  statusStyle(status: string) {
    return STATUS_STYLES[status] ?? STATUS_STYLES['Hazırlanıyor'];
  }

  formatDate(date: Date | string) {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
