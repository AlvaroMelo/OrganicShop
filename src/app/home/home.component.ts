import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AppUser } from 'src/models/app-user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users$!: AngularFireList<AppUser[]>;
  users: any
  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.users$ = this.db.list('/users');
    this.users$.valueChanges().subscribe(users => {
      this.users = users;
      console.log(this.users);
    });
  }

  submit(f: any) {
    console.log(f);
    this.users$.push(f);
  }

}
