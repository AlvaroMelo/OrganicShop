import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  categories$!: Observable<SnapshotAction<any>[]>;
  @Input('category') category!: string | null;
  @Output() public selectedCategory = new EventEmitter();

  constructor(
    private categories: CategoryService) {
    this.categories$ = this.categories.getCategories();
  }

  ngOnInit(): void {
  }

  sendSelectedCategory(key?: string | null) {
    this.selectedCategory.emit(key);
  }

}
