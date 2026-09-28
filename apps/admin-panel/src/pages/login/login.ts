import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Toast } from '@shared/services/toast';
import { Router } from '@angular/router';
import { UserModel } from '@shared/models/user.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export default class Login {
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);
  readonly #router = inject(Router);

  signIn(form: NgForm) {
    if (!form.valid) return;
    const endpoint = `api/users?userName=${form.value['userName']}&password=${form.value['password']}`;
    this.#http.get<UserModel[]>(endpoint).subscribe((res) => {
      if (res.length === 0) {
        this.#toast.show('Hata', 'Kullanıcı adı veya şifre yanlış', 'error');
        return;
      } else if (!res[0].isAdmin) {
        this.#toast.show('Hata', 'Giriş yapma yetkiniz yok', 'error');
        return;
      }

      localStorage.setItem('response', JSON.stringify(res[0]));
      this.#router.navigateByUrl('/');
    });
  }
}
