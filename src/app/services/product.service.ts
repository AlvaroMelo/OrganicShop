import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AppProduct } from 'src/models/app-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private db: AngularFireDatabase) { }

  create(product: AppProduct) {
    return this.db.list('/products').push(product);
  }

  update(id: string, product: AppProduct) {
    return this.db.list('/products').update(id, product);
  }

  delete(id: string) {
    return this.db.list('/products/').remove(id);
  }

  getAll() {
    return this.db.list('products').snapshotChanges();
  }

  getProduct(productId: string) {
    return this.db.list('/products/' + productId).snapshotChanges();
  }

  filterByCategory(category: string) {
    return this.db.list('/products/', ref => ref.orderByChild("category").equalTo(category)).snapshotChanges();
  }

  loadProducts(category?: string | null) {
    return category ? this.filterByCategory(category) : this.getAll();
  }
}
