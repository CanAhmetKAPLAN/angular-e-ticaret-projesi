import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  template: `
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <a routerLink="/" class="d-flex align-items-center">
          <span class="material-symbols-outlined">home</span>
          <span>Ana Sayfa</span>
        </a>
      </li>
    </ol>
  `,
})
export default class Breadcrumb {}
