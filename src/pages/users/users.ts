import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { UserDetailsPage } from '../user-details/user-details';

import { EurofoodUsers } from '../../providers/eurofood-users';

/*
  Generated class for the Users page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {

  // constructor(public navCtrl: NavController, public navParams: NavParams) {}
  // ionViewDidLoad() {
  // console.log('ionViewDidLoad UsersPage');
  users: User[]
  originalUsers: User[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private eurofoodusers: EurofoodUsers) {
    
    // eurofoodusers.load().subscribe(users => {
    //   this.users = users;
    //   this.originalUsers = users;
    //   console.log(users);
      
    // })

    // SEARCH Questo visulizza i risultato in console con il valore Olive HARD-CODED - la funzione 
    // con che cerca per i caratteri inseriti nella serch bar è fuori dal constructor
    // githubUsers.searchUsers('olive').subscribe(users => {
    //     console.log(users)
    // });

  } 

  goToDetails(id: number) {
    this.navCtrl.push(UserDetailsPage, {id});
  }

  // search(searchEvent) {
  //   let term = searchEvent.target.value
  //   // We will only perform the search if we have 3 or more characters
  //   if (term.trim() === '' || term.trim().length < 3) {
  //     // Load cached users
  //     this.users = this.originalUsers;
  //   } else {
  //     // Get the searched users from github
  //     this.eurofoodusers.searchUsers(term).subscribe(users => {
  //       this.users = users
  //     });
  //   }
  // }

  ionViewDidLoad() {
  console.log('ionViewDidLoad UsersPage');
  }
}
