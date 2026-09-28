import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { Toast } from '@shared/services/toast';
import { CategoryModel } from '@shared/models/category.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './categories.html',
})
export default class Categories {
  readonly result = httpResource<CategoryModel[]>(() => `api/categories`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly isLoading = computed(() => this.result.isLoading());

  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);

  delete(id: string) {
    this.#toast.showSwal(
      'Kategori Sil ?',
      'Kategoriyi silmek istiyor musunuz ?',
      'Sil',
      () => {
        this.#http.delete(`api/${id}`).subscribe(() => {
          this.result.reload();
        });
      },
    );
  }
}
