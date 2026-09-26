import {
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { httpResource, HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Toast } from '../../services/toast';
import { CategoryModel } from '../categories/categories';

export interface ProductModel {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
}

export const initialProduct: ProductModel = {
  id: '',
  name: '',
  imageUrl: '',
  price: 0,
  stock: 0,
  categoryId: '123',
  categoryName: 'Telefon',
};

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './products.html',
})
export default class Products {
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);

  readonly result = httpResource<ProductModel[]>(() => `api/products`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly categoryResult = httpResource<CategoryModel[]>(
    () => 'api/categories',
  );
  readonly categoryFilter = computed<FlexiGridFilterDataModel[]>(() => {
    const categories = this.categoryResult.value() ?? [];
    return categories.map<FlexiGridFilterDataModel>((val) => ({
      name: val.name,
      value: val.name,
    }));
  });

  delete(id: string) {
    this.#toast.showSwal(
      'Ürünü Sil?',
      'Ürünü silmek istiyor musunuz?',
      'Sil',
      () => {
        this.#http.delete(`api/products/${id}`).subscribe(() => {
          this.#toast.show('Başarılı', 'Ürün başarıyla silindi', 'success');
          this.result.reload();
        });
      },
    );
  }
}
