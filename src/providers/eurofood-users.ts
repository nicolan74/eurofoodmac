import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';

import { User } from '../models/user';

import { PrestaShopApi } from '../providers/prestashop-api-endpoint';

/*
  Generated class for the GihubUsers provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/



@Injectable()
export class EurofoodUsers {
  // eurofoodCustomersApiUrl = 'http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';

  constructor(
    public http: Http,
    private psApi: PrestaShopApi

  ) {
    console.log('Hello EurofoodUsers Provider');
  }

  // Load all github customers
  // load(): Observable<User[]> {
  //   return this.http.get(`${this.eurofoodCustomersApiUrl}`)
  //     .map(res => <User[]>res.json().customers);
  // }

  /** 
   * Load Data of Logged Customer by current user id (used in user-details.ts e.g. Il mio profilo)
   */
  loadLoggedCustomerDetails(id: number): Observable<User> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadLoggedCustomerDetails(id)
    console.log('urlFor_loadLoggedCustomerDetails ', url)
    return this.http.get(`${url}`)
      .map(res => <User>(res.json().customers))
  }

  // Search for ps users  
  // searchUsers(searchParam: string): Observable<User[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=[name]&filter[name]=[${searchParam}]%&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //     .map(res => <User[]>(res.json().products))
  // }

  /**
   * Used in login.ts: does a Request of ps customers filtered by the email set by user in the LOGIN form
   * If the Request return a customer then this is logged in the App
   */
  customerAuthentication(email: string): Observable<User> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&filter[email]=[${email}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_customerAuthentication(email)
    console.log('urlFor_customerAuthentication ', url)
    return this.http.get(`${url}`)
      .map(res => <User>(res.json().customers[0]))
  }

  /**
   * Used in signup.ts: does a Request of ps customers filtered by the email set by user in the REGISTRATION form
   * If the Request return a customer a message alerts that the email is already used
   */
  checkEmail(email: string): Observable<User> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&filter[email]=[${email}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_checkEmail(email)
    console.log('urlFor_checkEmail ', url)
    return this.http.get(`${url}`)
      .map(res => <User>(res.json().customers))
  }

  /**
   * Used in signup.ts: after the registration with the ID got from the XML in response by ps does a request 
   * for the just registred customer and then this is logged in the App
   */
  customerRegistration(id: number): Observable<User> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_customerRegistration(id)
    console.log('urlFor_customerRegistration ', url)
    return this.http.get(`${url}`)
      .map(res => <User>(res.json().customers[0]))
  }


}
