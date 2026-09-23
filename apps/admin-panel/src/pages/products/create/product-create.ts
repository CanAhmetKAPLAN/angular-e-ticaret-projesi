import { Component, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../../components/blank';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, RouterLink, FormsModule],
  templateUrl: './product-create.html',
})
export default class ProductCreate {
  readonly #http = inject(HttpClient);
  readonly #location = inject(Location);

  save(form: NgForm) {
    if (!form.valid) return;
    this.#http
      .post('http://localhost:3000/products', form.value)
      .subscribe(() => {
        this.#location.back();
      });
  }
}
