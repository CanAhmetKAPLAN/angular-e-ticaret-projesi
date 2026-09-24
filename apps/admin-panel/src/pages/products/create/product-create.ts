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
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Toast } from '../../../services/toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { initialProduct, ProductModel } from '../products';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, RouterLink, FormsModule, NgxMaskDirective],
  templateUrl: './product-create.html',
})
export default class ProductCreate {
  readonly id = signal<string | undefined>(undefined);

  readonly result = resource({
    params: () => this.id(),
    loader: async ({ params }) => {
      var res = await lastValueFrom(
        this.#http.get<ProductModel>(`http://localhost:3000/products/${params}`),
      );
      return res;
    },
  });

  readonly cardTitle = computed(() =>
    this.id() ? 'Ürün Güncelle' : 'Ürün Ekle',
  );
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly data = linkedSignal(() => this.result.value() ?? initialProduct);

  readonly #http = inject(HttpClient);
  readonly #location = inject(Location);
  readonly #toast = inject(Toast);
  readonly #activated = inject(ActivatedRoute);

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
        .post('http://localhost:3000/products', this.data())
        .subscribe(() => {
          this.#toast.show('Başarılı', 'Ürün başarıyla eklendi', 'success');
          this.#location.back();
        });
    } else {
      this.#http
        .put(`http://localhost:3000/products/${this.id()}`, this.data())
        .subscribe(() => {
          this.#toast.show('Başarılı', 'Ürün başarıyla güncellendi', 'info');
          this.#location.back();
        });
    }
  }
}
