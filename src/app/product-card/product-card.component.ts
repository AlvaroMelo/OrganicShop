import { Component, Input, OnDestroy } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnDestroy {
  @Input('product') product!: any;
  @Input('display-actions') displayActions = true;

  quantity = 0;
  key!: string;
  update: any;

  constructor(private shoppingCartService: ShoppingCartService) {
    this.getKey();
    this.updateQuantity();
  }

  addToCart() {
    console.log("Add To Cart", this.product.title, this.product.price);
    this.shoppingCartService.addToCart(this.product);
    this.product.isItemOnCart = true;
    this.updateQuantity();
  }

  async updateQuantity() {
    if (this.update)
      this.update.unsubscribe();

    this.update = (await this.shoppingCartService.getAll()).subscribe((items: SnapshotAction<any>[]) => {
      items.forEach((item: any) => {
        if (item.payload.val().title === this.product.title) {
          this.quantity = item.payload.val().quantity;
          this.product.isItemOnCart = (this.quantity >= 1);
        }
      });
    });
  }

  async getKey() {
    console.log("passei aqui");
    if (this.update)
      this.update.unsubscribe();
    this.update = (await this.shoppingCartService.getAll()).subscribe((items: SnapshotAction<any>[]) => {
      items.forEach((item: any) => {
        if (item.payload.val().title === this.product.title) {
          this.key = item.key;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.update.unsubscribe();
  }
}
