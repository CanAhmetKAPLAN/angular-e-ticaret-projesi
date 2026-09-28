import { httpResource } from '@angular/common/http';
import { Component, computed, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryModel } from '@shared/models/category.model';
import { api } from '../../constants';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
  templateUrl: './layouts.html',
})
export default class Layouts {
  readonly result = httpResource<CategoryModel[]>(() => `${api}/categories`);
  readonly data = computed(() => this.result.value() ?? []);
}
