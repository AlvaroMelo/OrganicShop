import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products$;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getAll() as Observable<any[]>;
  }

  ngOnInit(): void {
    this.products$.subscribe((products: any) => {
      this.dtTrigger.next(products);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
