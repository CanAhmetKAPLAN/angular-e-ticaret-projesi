import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';

export interface BreadcrumbModel {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-breadcrumb',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  template: `
    <ol class="breadcrumb">
      @for (val of data(); track $index) {
        <li class="breadcrumb-item">
          <a [routerLink]="val.url" class="d-flex align-items-center">
            <span class="material-symbols-outlined">{{ val.icon }}</span>
            <span>{{ val.title }}</span>
          </a>
        </li>
      }
    </ol>
  `,
})
export default class Breadcrumb {
  readonly data = computed(() => this.#common.data());

  readonly #common = inject(Common);
}
