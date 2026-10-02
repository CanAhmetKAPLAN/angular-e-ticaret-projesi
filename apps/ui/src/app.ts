import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import AppToast from '@shared/components/toast';

@Component({
  imports: [RouterModule, AppToast],
  selector: 'app-root',
  template: `
    <router-outlet />
    <app-toast />
  `,
})
export class App {}
