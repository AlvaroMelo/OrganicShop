import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppProduct } from 'src/models/app-product';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products$!: Observable<SnapshotAction<any>[]>;
  products: any[] = [];
  cartProducts: any[] = [];
  category!: string | null;

  key = "";
  subscribe: any;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute
    ) { }

  async ngOnInit(): Promise<void> {

    this.subscribe = (await this.shoppingCartService.getAll()).subscribe((prod:SnapshotAction<any>[]) => {
      this.cartProducts.splice(0);
      prod.forEach(p => {
        let item = {
          title: p.payload.val().title,
          quantity: p.payload.val().quantity,
          price: p.payload.val().price,
          image: p.payload.val().image,
        };
        this.cartProducts.push({productKey: p.key, ...item});

      });
      
    });
    
    this.route.queryParamMap.subscribe(params => {
      this.category = params.get('category');
    });
    this.loadProducts(this.category);
  }

  loadProducts(param?: string | null) {
    this.products.splice(0);
    this.products$ = this.productService.loadProducts(param);
    this.products$.subscribe(prod => {
      prod.forEach(p => {
        let temp = {
          title: p.payload.val().title,
          price: p.payload.val().price,
          category: p.payload.val().category,
          imageUrl: p.payload.val().imageUrl,
        };
        this.products.push({isItemOnCart: false,  ...temp});
      });
    });
  }

  ngOnDestroy(): void {
      this.subscribe.unsubscribe();
  }

}
