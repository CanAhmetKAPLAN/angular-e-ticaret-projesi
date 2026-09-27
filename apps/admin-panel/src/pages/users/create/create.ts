import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { initialUser, UserModel } from '../users';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../../../services/toast';
import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { BreadcrumbModel } from '../../layouts/breadcrumb';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, Blank],
  templateUrl: './create.html',
})
export default class CreateUser {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    { title: 'Kullanıcılar', url: '/users', icon: 'group' },
  ]);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.get<UserModel>(`api/users/${this.id()}`),
      );
      this.breadcrumbs.update((prev) => [
        ...prev,
        { title: res.fullName, url: `/users/edit${this.id()}`, icon: 'edit' },
      ]);
      return;
    },
  });

  readonly data = linkedSignal(() => this.result.value() ?? { ...initialUser });
  readonly Title = computed(() =>
    this.id() ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle',
  );
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly #http = inject(HttpClient);
  readonly #activated = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #toast = inject(Toast);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          { title: 'Ekle', url: '/users/create', icon: 'add' },
        ]);
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.data.update((prev) => ({
      ...prev,
      fullName: `${prev.firstName} ${prev.lastName}`,
    }));

    if (!this.id()) {
      this.#http.post('api/users', this.data()).subscribe((res) => {
        this.#toast.show('Başarılı', 'Kullanıcı başarıyla kaydedildi');
        this.#router.navigateByUrl('/users');
      });
    } else {
      this.#http.put(`api/users/${this.id()}`, this.data()).subscribe((res) => {
        this.#toast.show('Başarılı', 'Kullanıcı başarıyla güncellendi');
        this.#router.navigateByUrl('/users');
      });
    }
  }
}
