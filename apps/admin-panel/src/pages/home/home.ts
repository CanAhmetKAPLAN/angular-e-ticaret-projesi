import { Component, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { BreadcrumbModel } from '../layouts/breadcrumb';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank],
  templateUrl: './home.html',
})
export default class Home {}
