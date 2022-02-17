import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users$: AngularFireList<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.users$ = this.db.list('users');

  }

  ngOnInit(): void {
    console.log(this.users$);
  }

}
