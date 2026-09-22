import { Component, ViewEncapsulation } from '@angular/core';
import Breadcrumb from './breadcrumb';
import { RouterLink } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Breadcrumb, RouterLink],
  templateUrl: './layouts.html',
})
export default class Layouts {}
