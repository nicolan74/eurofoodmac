import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Address } from '../models/address';
import { PrestaShopApi } from '../providers/prestashop-api-endpoint';
/*
  Generated class for the EurofoodCustomerAddress provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EurofoodCustomerAddress {

  constructor(
    public http: Http,
    private psApi: PrestaShopApi
    ) {
    console.log('Hello EurofoodCustomerAddress Provider');
  }

  loadCustomerAddress(id: number): Observable<Address> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/addresses?output_format=JSON&display=full&filter[id_customer]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCustomerAddress(id)
    console.log('urlFor_loadCustomerAddress ', url)
    return this.http.get(`${url}`)
      .map(res => <Address>(res.json().addresses[0]))
  }

    loadCustomerAddressInUserDtls(id: number): Observable<Address> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/addresses?output_format=JSON&display=full&filter[id_customer]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCustomerAddress(id)
    console.log('urlFor_loadCustomerAddress ', url)
    return this.http.get(`${url}`)
      .map(res => <Address>(res.json().addresses))
  }
}
