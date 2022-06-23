import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'items-quantity',
  templateUrl: './items-quantity.component.html',
  styleUrls: ['./items-quantity.component.css']
})
export class ItemsQuantityComponent {

  @Input('quantity') quantity!: number;
  @Input() productKey!: string;
  constructor(private shoppingCartService: ShoppingCartService) { }

  increase() {
    this.shoppingCartService.increase(this.productKey);
  }

  decrease() {
    this.shoppingCartService.decrease(this.productKey);
  }

}
