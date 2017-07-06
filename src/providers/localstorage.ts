import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { User } from '../models/user';
/*
  Generated class for the Localstorage provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Localstorage {
  // currentUser : string;
  currentUser: User;
  // currentUser2: User;

  HAS_LOGGED_IN = 'hasLoggedIn';

  // id: string;

  constructor(
    public http: Http,
    private storage: Storage,
    public events: Events
  ) {
      console.log('Hello Localstorage Provider');
    }

  //store the Current User
  // setCurrentUser(currentUser) {
  //   this.storage.set('currentuser', currentUser);
  // }


  //get the Current User
  // getCurrentUser() {
  //   this.storage.get('currentuser').then(currentUser => {
  //     console.log('stored Current User Object: ' + currentUser);
  //     console.log('stored Current User Id: ' + currentUser.id);
  //     console.log('stored Current User Id: ' + currentUser.firstname);
  //   });
  // }



  // getUsername(): Promise<string> {
  //   return this.storage.get('currentuser').then((value) => {
  //     return value;
  //   });
  // };


  // !!!! 22.03


  login(currentUser: User): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setCurrentUser(currentUser);
    this.events.publish('user:login', currentUser);
  };

  setCurrentUser(currentUser: User): void {
    this.storage.set('currentuser', currentUser);
  };


  getCurrentUser(): Promise<any> {
    return this.storage.get('currentuser').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      console.log('hasLoggedIn value: ' + value);
      return value === true;
    });
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('currentuser');
    this.events.publish('user:logout');
    // this.storage.clear()
    // console.log('Current user in after logout ', this.currentUser)
  };
  // !!!! 22.03


  //delete the Current User
  // removeCurrentUser() {
  //   this.storage.remove('currentuser').then(() => {
  //     console.log('stored Current User is removed');
  //   });
  // }

  // !! NON USATO clear the whole local storage
  clearStorage() {
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
  }

}
