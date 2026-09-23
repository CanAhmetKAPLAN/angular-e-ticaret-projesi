import { Component, computed, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { httpResource } from '@angular/common/http';

export interface ProductModel {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FlexiGridModule],
  templateUrl: './products.html',
})
export default class Products {
  readonly result = httpResource<ProductModel[]>(
    () => 'http://localhost:3000/products',
  );
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly categoryFilter = signal<FlexiGridFilterDataModel[]>([
    {
      name: 'Telefon',
      value: 'Telefon',
    },
  ]);
}
