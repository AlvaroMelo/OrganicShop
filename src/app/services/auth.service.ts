import { Injectable } from '@angular/core';
import auth from 'firebase/compat/app';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from 'firebase/compat';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User | null>;

  constructor(
      private userService: UserService,
      private afAuth: AngularFireAuth,
      private router: Router,
      private route: ActivatedRoute
    ) {

    this.user$ = afAuth.authState;
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.auth.GoogleAuthProvider())
  }

  AuthLogin(provider: any) {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.signInWithRedirect(provider);
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/'])
  }

  get appUser$(): Observable<AppUser> {
    return this.user$
      .pipe(switchMap(user => this.userService.get(user?.uid as string)));
  }
}
