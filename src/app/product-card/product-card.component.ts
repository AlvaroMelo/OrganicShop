import { Component, Input, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { AppProduct } from 'src/models/app-product';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input('product') product!: AppProduct;
  @Input('display-actions') displayActions = true;

  constructor() { }

}
