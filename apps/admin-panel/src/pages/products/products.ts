import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { httpResource, HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Toast } from '../../services/toast';

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
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './products.html',
})
export default class Products {
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);

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

  delete(id: string) {
    this.#toast.showSwal('Ürünü Sil?', 'Ürünü silmek istiyor musunuz?', 'Sil', () => {
      this.#http.delete(`http://localhost:3000/products/${id}`).subscribe(() => {
        this.#toast.show('Başarılı', 'Ürün başarıyla silindi', 'success');
        this.result.reload();
      });
    });
  }
}
