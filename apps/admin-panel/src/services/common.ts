import { Service } from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb';

@Service()
export class Common {
  data: BreadcrumbModel[] = [];

  set(data: BreadcrumbModel[]) {
    const val: BreadcrumbModel = {
      title: 'Ana Sayfa',
      icon: 'home',
      url: '/',
    };

    this.data = data;
    this.data.unshift(val);
  }
}
