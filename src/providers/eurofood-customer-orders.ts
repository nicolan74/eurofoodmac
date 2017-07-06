import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Order } from '../models/order';
import { PrestaShopApi } from '../providers/prestashop-api-endpoint';
/*
  Generated class for the EurofoodCustomerOrders provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EurofoodCustomerOrders {

  constructor(public http: Http,
  private psApi: PrestaShopApi
  ) {
    console.log('Hello EurofoodCustomerOrders Provider');
  }

  // Get prestashop order by providing customer id
  loadCustomerOrders(id: number): Observable<Order[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/orders?output_format=JSON&display=full&filter[id_customer]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCustomerOrders(id)
    console.log('urlFor_loadCustomerOrders ', url)
    return this.http.get(`${url}`)
      .map(res => <Order[]>(res.json().orders))
  }

  loadCustomerOrderState(id_order_current_state: number): Observable<Order> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/order_states?output_format=JSON&display=full&filter[id]=[${id_order_current_state}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCustomerOrderState(id_order_current_state)
    console.log('urlFor_loadCustomerOrderState ', url)
    return this.http.get(`${url}`)
      .map(res => <Order>(res.json().order_states[0]))
  }

  loadOrderDetails(id: number): Observable<Order[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/order_details?output_format=JSON&display=full&filter[id_order]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadOrderDetails(id)
    console.log('urlFor_loadOrderDetails ', url)
    return this.http.get(`${url}`)
      .map(res => <Order[]>(res.json().order_details))
  }

  // TEST
  // loadCustomerOrders(): Observable<Order[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/orders?output_format=JSON&display=full&filter[id_customer]=[1]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //     .map(res => <Order[]>res.json().orders);
  // }

}
