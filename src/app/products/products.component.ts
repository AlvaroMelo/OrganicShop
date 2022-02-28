import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppProduct } from 'src/models/app-product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$!: Observable<SnapshotAction<any>[]>;
  products: AppProduct[] = [{
    title: "",
    price: 0,
    category: "0",
    imageUrl: ""
  }];
  category!: string | null;
  public key = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    
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
          imageUrl: p.payload.val().imageUrl
        };
        this.products.push(temp);
      });
    });
  }

}
