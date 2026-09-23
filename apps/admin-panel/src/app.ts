import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import AppToast from './components/toast';

@Component({
  imports: [RouterModule, AppToast],
  selector: 'app-root',
  template: `
    <router-outlet />
    <app-toast />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class App {}
