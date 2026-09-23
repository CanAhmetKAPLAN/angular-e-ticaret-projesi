import { Component, computed, signal, ViewEncapsulation } from '@angular/core';
import Breadcrumb from './breadcrumb';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { navigations } from '../../navigation';
import { NavPipe } from '../../pipes/nav-pipe';
import { DatePipe } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    Breadcrumb,
    RouterLink,
    RouterLinkActive,
    NavPipe,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './layouts.html',
})
export default class Layouts {
  readonly search = signal<string>('');
  readonly time = signal<Date | string>(new Date());
  readonly navigations = computed(() => navigations);

  constructor() {
    setInterval(() => {
      this.time.set(new Date());
    }, 1000);
  }
}
