import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    router: Router,
    private userService: UserService) {

    authService.user$.subscribe(user => {
      if(!user) return;

      this.userService.save(user);
      let returnUrl = localStorage.getItem('returnUrl');
      if(!returnUrl) return;

      localStorage.removeItem('returnUrl');
      router.navigate([returnUrl]);
    });
  }

}
