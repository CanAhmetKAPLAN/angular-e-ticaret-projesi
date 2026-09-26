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
import { CategoryModel, initialCategory } from '../categories';
import { FlexiGridModule } from 'flexi-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Toast } from '../../../services/toast';
import { lastValueFrom } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FormsModule, FlexiGridModule],
  templateUrl: './create.html',
})
export default class CreateCategory {
  readonly id = signal<string | undefined>(undefined);
  readonly data = computed(() => this.result.value() ?? { ...initialCategory });
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly cardTitle = computed(() =>
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
        this.#http.get<CategoryModel>(
          `http://localhost:3000/categories/${this.id()}`,
        ),
      );
      return res;
    },
  });

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;
    if (!this.id()) {
      this.#http
        .post('http://localhost:3000/categories', this.data())
        .subscribe((res) => {
          this.#toast.show(
            'Başarılı',
            'Kategori kaydı başarıyla tamamlandı',
            'success',
          );
          this.#router.navigateByUrl('/categories');
        });
    } else {
      this.#http
        .put(`http://localhost:3000/categories/${this.id()}`, this.data())
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
