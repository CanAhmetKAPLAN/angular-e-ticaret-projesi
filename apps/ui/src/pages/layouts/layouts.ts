import { httpResource } from '@angular/common/http';
import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CategoryModel } from '@shared/models/category.model';
import { UserModel } from '@shared/models/user.model';
import { slugify } from '@shared/utils/slug';
import { filter } from 'rxjs';
import { api } from '../../constants';
import { Common } from '../../services/common';

function readCurrentUser(): UserModel | null {
  const raw = localStorage.getItem('response');
  return raw ? JSON.parse(raw) : null;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layouts.html',
})
export default class Layouts {
  readonly result = httpResource<CategoryModel[]>(() => `${api}/categories`);
  readonly data = computed(() =>
    (this.result.value() ?? []).map((category) => ({
      ...category,
      slug: slugify(category.name),
    })),
  );
  readonly #router = inject(Router);
  readonly basketCount = computed(() => this.#common.basketCount());

  readonly currentUser = signal(readCurrentUser());
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly dropdownOpen = signal(false);
  readonly #common = inject(Common);
  readonly user = computed(() => this.#common.user());

  constructor() {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.currentUser.set(readCurrentUser()));
  }

  toggleDropdown() {
    this.dropdownOpen.update((open) => !open);
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    if (!this.dropdownOpen()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.dropdownOpen.set(false);
    }
  }

  logOut() {
    localStorage.clear();
    this.#common.clearUser();
    this.#router.navigateByUrl('/auth/login');
  }
}
