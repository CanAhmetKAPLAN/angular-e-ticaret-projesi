import {
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, httpResource } from '@angular/common/http';
import { Location } from '@angular/common';
import { Toast } from '@shared/services/toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { initialProduct, ProductModel } from '@shared/models/product.model';
import { CategoryModel } from '@shared/models/category.model';
import { FlexiSelectModule } from 'flexi-select';
import { BreadcrumbModel } from '../../layouts/breadcrumb';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    Blank,
    RouterLink,
    FormsModule,
    NgxMaskDirective,
    FlexiSelectModule,
  ],
  templateUrl: './product-create.html',
})
export default class ProductCreate {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    { title: 'Ürünler', url: '/products', icon: 'package_2' },
  ]);

  readonly result = resource({
    params: () => this.id(),
    loader: async ({ params }) => {
      const res = await lastValueFrom(
        this.#http.get<ProductModel>(`api/products/${params}`),
      );
      this.breadcrumbs.update((prev) => [
        ...prev,
        { title: res.name, url: `/products/edit/${this.id()}`, icon: 'edit' },
      ]);
      return res;
    },
  });

  readonly cardTitle = computed(() =>
    this.id() ? 'Ürün Güncelle' : 'Ürün Ekle',
  );
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialProduct },
  );

  readonly categoryResult = httpResource<CategoryModel[]>(
    () => 'api/categories',
  );
  readonly categories = computed(() => this.categoryResult.value() ?? []);
  readonly categoryLoading = computed(() => this.categoryResult.isLoading());

  readonly #http = inject(HttpClient);
  readonly #location = inject(Location);
  readonly #toast = inject(Toast);
  readonly #activated = inject(ActivatedRoute);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          { title: 'Ekle', url: '/products/create', icon: 'add' },
        ]);
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;
    if (!this.id()) {
      this.#http.post(`api/products`, this.data()).subscribe(() => {
        this.#toast.show('Başarılı', 'Ürün başarıyla eklendi', 'success');
        this.#location.back();
      });
    } else {
      this.#http.put(`api/products/${this.id()}`, this.data()).subscribe(() => {
        this.#toast.show('Başarılı', 'Ürün başarıyla güncellendi', 'info');
        this.#location.back();
      });
    }
  }
  setCategoryName() {
    const id = this.data().categoryId;
    const category = this.categories().find((p) => p.id == id);
    this.data.update((prev) => ({
      ...prev,
      categoryName: category?.name ?? '',
    }));
  }
}
