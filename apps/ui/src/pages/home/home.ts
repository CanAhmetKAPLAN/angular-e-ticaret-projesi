import { httpResource } from '@angular/common/http';
import { Component, computed, ViewEncapsulation } from '@angular/core';
import { ProductModel } from '@shared/models/product.model';
import { api } from '../../constants';
import { TrCurrencyPipe } from 'tr-currency';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [TrCurrencyPipe],
  templateUrl: './home.html',
})
export default class Home {
  readonly result = httpResource<ProductModel[]>(() => `${api}/products`);
  readonly data = computed(() => this.result.value() ?? []);
}
