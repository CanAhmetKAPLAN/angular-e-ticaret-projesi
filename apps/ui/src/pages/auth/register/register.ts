import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserModel, initialUser } from '@shared/models/user.model';
import { Toast } from '@shared/services/toast';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
})
export default class Register {
  readonly data = signal<UserModel>(initialUser);
  readonly #http = inject(HttpClient);
  readonly #toast = inject(Toast);
  readonly #router = inject(Router);

  signUp(form: NgForm) {
    if (!form.valid) {
      this.data.update((prev) => ({
        ...prev,
        fullName: `${prev.firstName} ${prev.lastName}`,
      }));
    }
    this.#http.post('api/users', this.data()).subscribe(() => {
      this.#toast.show(
        'Başarılı',
        'Kaydınız başarıyla tamamlandı. Giriş yapabilirsiniz',
      );
      this.#router.navigateByUrl('/auth/login');
    });
  }
}
