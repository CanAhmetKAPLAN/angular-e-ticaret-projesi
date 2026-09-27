import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
  templateUrl: './layouts.html',
})
export default class Layouts {}
