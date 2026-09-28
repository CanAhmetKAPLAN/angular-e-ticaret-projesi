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
import { Toast } from '@shared/services/toast';
import { CategoryModel } from '@shared/models/category.model';
import { ProductModel } from '@shared/models/product.model';

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
