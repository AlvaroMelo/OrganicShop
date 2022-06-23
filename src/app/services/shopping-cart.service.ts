import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, take } from 'rxjs';
import { AppProduct } from 'src/models/app-product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async addToCart(product: AppProduct) {

    let cart = await this.getCart();
    let newProduct = {
      title: product.title,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    };

    return cart.push(newProduct);
  }

  async getAll() {
    let cart = await this.getCart();
    return cart.snapshotChanges();
  }

  async clearShoppingCart() {
    let cart = await this.getCart();
    return cart.remove();
  }

  async increase(key: string) {
    const dbItem = await this.getCartItem(key);
    (dbItem.valueChanges() as Observable<any>).pipe(take(1)).subscribe(item => {
      dbItem.update({quantity: item.quantity + 1});
    });
  }
  
  async decrease(key: string) {
    const dbItem = await this.getCartItem(key);
    (dbItem.valueChanges() as Observable<any>).pipe(take(1)).subscribe(item => {
      dbItem.update({quantity: item.quantity - 1});
      if (item.quantity === 1) {
        this.deleteItem(key);
      }
    });
  }

  private async deleteItem(key: string) {
    let dbItem = await this.getCartItem(key);
    return dbItem.remove();
  }

  private async getCart() {
    let cartId = await this.getOrCreateCartId();
    return this.db.list('shopping-carts/' + cartId + "/items/");
  }

  private async getCartItem(key: string) {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId + "/items/" + key);
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cart');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cart', result.key as string);

    return result.key as string;

  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

}
