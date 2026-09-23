import {
  AfterViewInit,
  Component,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb';
import { Common } from '../services/common';

@Component({
  selector: 'app-blank',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  template: `
    <title>e-Ticaret Admin | {{ pageTitle() }}</title>
    <ng-content></ng-content>
  `,
})
export default class Blank implements AfterViewInit {
  readonly pageTitle = input.required<string>();
  readonly breadcrumbs = input.required<BreadcrumbModel[]>();
  readonly #common = inject(Common);

  ngAfterViewInit(): void {
    this.#common.set(this.breadcrumbs());
  }
}
