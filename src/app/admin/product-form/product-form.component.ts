import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { AppProduct } from 'src/models/app-product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: any;
  product$!: Observable<SnapshotAction<any>[]>;
  newProductForm!: FormGroup;
  id;
  product: AppProduct = {
    title: "",
    category: "",
    price: 0,
    imageUrl: ""
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder) {

      this.categories$ = this.categoryService.getCategories();

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        this.productService.getProduct(this.id).pipe(take(1)).subscribe((p: any) => {
          p.forEach((prod: any) => {
            if (prod.key === 'title') {
              this.newProductForm.get('title')?.setValue(prod.payload.val());
              this.product.title = prod.payload.val();
            } else if (prod.key === 'price') {
              this.newProductForm.get('price')?.setValue(prod.payload.val());
              this.product.price = prod.payload.val();
            } else if (prod.key === 'category') {
              this.product.category = prod.payload.val();
              this.newProductForm.get('category')?.setValue(prod.payload.val());
            } else if (prod.key === 'imageUrl') {
              this.newProductForm.get('imageUrl')?.setValue(prod.payload.val());
              this.product.imageUrl = prod.payload.val();
            }
          });
        });
      }
  }

  ngOnInit(): void {
    this.newProductForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      imageUrl: ['', [Validators.required, Validators.pattern('((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)')]]
    });

  }

  save() {
    const product = this.newProductForm.getRawValue();
    if (this.id)
      this.productService.update(this.id, product); 
    else  
      this.productService.create(product);
    this.router.navigate(['/admin/products']);
  }

  delete() {
    console.log(this.id);
    if (confirm("Are you sure you wanna do that?")) {
      this.productService.delete(this.id as string);
      this.router.navigate(['/admin/products']);
    }
  }

  onClick() {
    this.product.title = this.newProductForm.get('title')?.value;
    this.product.price = this.newProductForm.get('price')?.value;
    this.product.imageUrl = this.newProductForm.get('imageUrl')?.value;
  }
}
