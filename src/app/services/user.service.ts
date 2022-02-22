import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { AppUser } from 'src/models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
  }

  get(uid: string): Observable<AppUser>  {
    return this.db.object('/users/' + uid).valueChanges() as Observable<AppUser>;
  }

}
