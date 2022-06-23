import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CartItem } from 'src/models/cart-item';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  cartItemsCount = 0;
  totalPrice = 0;
  products$!: Observable<SnapshotAction<CartItem>[]>;
  productSubscription: any;
  cartProducts: CartItem[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {
  }

  async ngOnInit() {
    this.products$ = await this.shoppingCartService.getAll() as Observable<SnapshotAction<CartItem>[]>;
    this.productSubscription = this.products$.subscribe((products: SnapshotAction<CartItem>[]) => {
      this.updateCart(products);
    });
    console.log("this.cartProducts", this.cartProducts);

  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }

  clearShoppinCart() {
    console.log("Clear Shopping Cart");
    this.shoppingCartService.clearShoppingCart().then(() => this.updateCart());
  }

  updateCart(products?: SnapshotAction<CartItem>[]) {
    this.cartProducts.splice(0);
    this.totalPrice = 0;
    this.cartItemsCount = 0;

    if (products) {
      products.forEach((product: SnapshotAction<CartItem>) => {
        if (product.payload.val()?.quantity as number > 0) {
          let newItem = {
            title: product.payload.val()?.title as string,
            quantity: product.payload.val()?.quantity as number,
            price: product.payload.val()?.price as number,
            image: product.payload.val()?.image as string,
          };
          this.cartProducts.push({ key: product.key as string, ...newItem });
          this.cartItemsCount += newItem.quantity ? newItem.quantity : 0;
          this.totalPrice += (newItem.price && newItem.quantity) ? newItem.price * newItem.quantity : 0;
        }
      });
    }
  }
}
