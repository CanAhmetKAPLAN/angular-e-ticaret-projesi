import { Component, computed, signal, ViewEncapsulation } from '@angular/core';
import Breadcrumb from './breadcrumb';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { navigations } from '../../navigation';
import { NavPipe } from '../../pipes/nav-pipe';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Breadcrumb, RouterLink, RouterLinkActive, NavPipe, FormsModule],
  templateUrl: './layouts.html',
})
export default class Layouts {
  readonly search = signal<string>('');
  readonly navigations = computed(() => navigations);
}
