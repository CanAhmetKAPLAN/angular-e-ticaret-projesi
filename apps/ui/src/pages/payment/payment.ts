import { HttpClient, httpResource } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Common } from '../../services/common';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { OrderModel, initialOrder } from '@shared/models/order.model';
import { FormsModule, NgForm } from '@angular/forms';
import { FlexiSelectModule } from 'flexi-select';

interface DistrictModel {
  ilce_adi: string;
}

interface CityModel {
  il_adi: string;
  ilceler: DistrictModel[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    TrCurrencyPipe,
    FormsModule,
    DatePipe,
    FlexiSelectModule,
  ],
  templateUrl: './payment.html',
})
export default class Payment {
  // Ürün fiyatları KDV dahil kabul ediliyor
  readonly taxRate = 0.18;

  readonly result = httpResource<BasketModel[]>(
    () => `api/baskets?userId=${this.#common.user()?.id}`,
  );
  readonly baskets = computed(() => this.result.value() ?? []);
  readonly total = computed(() => this.#calcTotal(this.baskets()));
  readonly subtotal = computed(() => this.total() / (1 + this.taxRate));
  readonly tax = computed(() => this.total() - this.subtotal());

  readonly citiesResult = httpResource<CityModel[]>(() => '/il-ilce.json');
  readonly cities = computed(() => this.citiesResult.value() ?? []);
  readonly districts = computed(
    () =>
      this.cities().find((c) => c.il_adi === this.data().city)?.ilceler ?? [],
  );

  readonly showSuccessPart = signal<boolean>(false);
  readonly data = signal<OrderModel>({ ...initialOrder, baskets: [] });

  // Sipariş tamamlandıktan sonra sepet boşaldığı için özet siparişteki ürünlerden hesaplanır
  readonly orderTotal = computed(() => this.#calcTotal(this.data().baskets));
  readonly orderSubtotal = computed(
    () => this.orderTotal() / (1 + this.taxRate),
  );
  readonly orderTax = computed(() => this.orderTotal() - this.orderSubtotal());

  readonly #common = inject(Common);
  readonly #http = inject(HttpClient);

  setCity(city: string) {
    // İl değişince seçili ilçe sıfırlanır
    this.data.update((prev) => ({ ...prev, city, district: '' }));
  }

  pay(form: NgForm) {
    if (!form.valid || this.baskets().length === 0) return;

    const now = new Date();
    this.data.update((prev) => ({
      ...prev,
      userId: this.#common.user()!.id!,
      orderNumber: `TS-${now.getFullYear()}-${now.getTime()}`,
      date: now,
      baskets: [...this.baskets()],
    }));

    this.#http.post<OrderModel>('api/orders', this.data()).subscribe(() => {
      // Sipariş oluşturulunca sepeti temizle
      const deletes = this.data().baskets.map((b) =>
        this.#http.delete(`api/baskets/${b.id}`),
      );
      forkJoin(deletes).subscribe(() => {
        this.#common.basketCount.set(0);
        this.result.reload();
      });
      this.showSuccessPart.set(true);
    });
  }

  #calcTotal(items: BasketModel[]) {
    return items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0,
    );
  }
}
