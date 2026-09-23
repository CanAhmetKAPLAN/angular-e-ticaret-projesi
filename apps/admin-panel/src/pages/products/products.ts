import { Component, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';

export interface ProductModel {
  id?: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [Blank, FlexiGridModule],
  templateUrl: './products.html',
})
export default class Products {
  readonly data = signal<ProductModel[]>([
    {
      imageUrl:
        'https://cdn.dsmcdn.com/mnresize/400/-/ty1000446/product/media/images/prod/PIM/20260911/12/481767d3-f797-414f-be74-7d3647c196c9/1_org_zoom.jpg',
      name: 'Iphone 18',
      price: 137999,
      stock: 15,
    },
  ]);
}
