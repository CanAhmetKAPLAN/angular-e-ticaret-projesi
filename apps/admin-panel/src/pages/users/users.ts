import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { Toast } from '../../services/toast';

export interface UserModel {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const initialUser: UserModel = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  isAdmin: false,
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  },
};

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './users.html',
})
export default class Users {
  readonly result = httpResource<UserModel[]>(() => 'api/users');
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly #toast = inject(Toast);
  readonly #http = inject(HttpClient);

  delete(id: string) {
    this.#toast.showSwal(
      'Kullanıcıyı Sil?',
      'Kullanıcı silmek istiyor musun?',
      'Sil',
      () => {
        this.#http.delete(`api/users/${id}`).subscribe(() => {
          this.result.reload();
        });
      },
    );
  }
}
