import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '@shared/models/user.model';
import { Toast } from '@shared/services/toast';
import { Common } from '../../../services/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export default class Login {
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);
  readonly #router = inject(Router);
  readonly #common = inject(Common);

  signIn(form: NgForm) {
    if (!form.valid) return;

    this.#http
      .get<UserModel[]>(
        `api/users?userName=${form.value['userName']}&password=${form.value['password']}`,
      )
      .subscribe({
        next: (res) => {
          if (res.length === 0) {
            this.#toast.show(
              'Hata',
              'Kullanıcı adı ya da şifre yanlış',
              'error',
            );
            return;
          }
          const user = res[0];
          localStorage.setItem('response', JSON.stringify(user));
          this.#common.user.set(user);
          this.#router.navigateByUrl('/');
        },
        error: () => {
          this.#toast.show('Hata', 'Giriş yapılırken bir hata oluştu', 'error');
        },
      });
  }
}
