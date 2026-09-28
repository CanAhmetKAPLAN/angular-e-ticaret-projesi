import {
  Component,
  computed,
  inject,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryModel, initialCategory } from '@shared/models/category.model';
import { FlexiGridModule } from 'flexi-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Toast } from '@shared/services/toast';
import { lastValueFrom } from 'rxjs';
import { BreadcrumbModel } from '../../layouts/breadcrumb';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FormsModule, FlexiGridModule],
  templateUrl: './create.html',
})
export default class CreateCategory {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    { title: 'Kategoriler', url: '/categories', icon: 'category_search' },
  ]);
  readonly data = computed(() => this.result.value() ?? { ...initialCategory });
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly Title = computed(() =>
    this.id() ? 'Kategori Güncelle' : 'Kategori Ekle',
  );
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);
  readonly #router = inject(Router);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.get<CategoryModel>(`api/categories/${this.id()}`),
      );
      this.breadcrumbs.update((prev) => [
        ...prev,
        { title: res.name, url: `/categories/edit${this.id()}`, icon: 'edit' },
      ]);
      return res;
    },
  });

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          { title: 'Ekle', url: '/categories/create', icon: 'add' },
        ]);
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;
    if (!this.id()) {
      this.#http.post(`api/categories`, this.data()).subscribe((res) => {
        this.#toast.show(
          'Başarılı',
          'Kategori kaydı başarıyla tamamlandı',
          'success',
        );
        this.#router.navigateByUrl('/categories');
      });
    } else {
      this.#http
        .put(`api/categories/${this.id()}`, this.data())
        .subscribe((res) => {
          this.#toast.show(
            'Başarılı',
            'Kategori kaydı başarıyla güncellendi',
            'success',
          );
          this.#router.navigateByUrl('/categories');
        });
    }
  }
}
