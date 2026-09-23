import { Component, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank],
  templateUrl: './home.html',
})
export default class Home {}
