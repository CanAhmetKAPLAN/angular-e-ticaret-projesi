import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
})
export default class AuthLayout {}
