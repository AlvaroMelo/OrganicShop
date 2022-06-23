import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AppUser } from 'src/models/app-user';
import { CartItem } from 'src/models/cart-item';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  appUser!: AppUser;
  cartItemsCount: number = 0;

  constructor(
    public authService: AuthService,
    public shoppingCartService: ShoppingCartService) {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  async ngOnInit() {
    let products$ = await this.shoppingCartService.getAll() as Observable<SnapshotAction<CartItem>[]>;
    products$.subscribe((products: SnapshotAction<CartItem>[]) => {
      this.cartItemsCount = 0;
      products.forEach((product: SnapshotAction<CartItem>) => {
        this.cartItemsCount += product.payload.val()?.quantity as number;
      });
    });
  }
}
