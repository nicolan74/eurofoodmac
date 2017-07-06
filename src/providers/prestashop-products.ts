import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Product } from '../models/product';
import { PrestaShopApi } from '../providers/prestashop-api-endpoint';

/*
  Generated class for the EurofoodProducts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// Prodotto test
// export class ProductTest implements Product {
//   id: number;
//   name: string;
//   id_default_image: number;
//   price: number;
//   description: string;
//   level_depth: number;
//   id_parent: number;
// }

@Injectable()
export class PrestashopProducts {
  psShopHostName: string
  psWsKey: string

  // prestashopAllProductsApiUrl = 'http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';
  // prestashopFirstFiveProductsApiUrl = 'http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&limit=5&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';
  // prestashopProductsOfHomeCategoryApiUrl = 'http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';

  constructor(
    public http: Http,
    private psApi: PrestaShopApi
  ) {
    console.log('Hello EurofoodProducts Provider');

    this.psShopHostName = psApi.psShopHostName
    console.log('! Host Name: ', this.psShopHostName)

    this.psWsKey = psApi['psWsKey']
    console.log('! Ps Ws Key: ', this.psWsKey)
  }

  /**
   * Load prestashop products (HOME category) ! E' usato in search.ts Per velocizzare il caricamento in data 11.03 ho aggiunto &filter[id]=[1257,1324]
   */
  loadOriginalProducts(): Observable<Product[]> {
    // return this.http.get(`${this.globalVars.psShopHostName}/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=${this.psWsKey}`)
    // http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id]=[1,10]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
    let url = this.psApi.urlFor_loadOriginalProductsInSearchPage()
    // console.log('url load original product in search-page ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>res.json().products);
  }

  /** 
   * *** USATO SE GET_PRODUCT_BY_ID_CATEGORY_DEFAULT = true ***
   * Load only three product of Offerte category (for "Le nostre offerte in home.html") by providing offer category ID 
   * retrieve with the REQUEST loadOfferCategory in eurofood-categories.ts
   */
  loadOfferCategoryProducts(id: number): Observable<Product[]> {
    // return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=full&filter[id_category_default]=[${id}]&limit=3&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadOfferCategoryProductsInHomePage(id)
    // console.log('urlFor_loadOfferCategoryProductsInHomePage ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>res.json().products);
  }

  /**
   *  Carica il prodotto associato alla Categoria APP-Featured
   */
  loadAppFeaturedProduct(id: number): Observable<Product[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=${this.psWsKey}`)
    // let url = this.psApi.urlFor_loadHomeBanner()
    // console.log('urlFor_loadHomeBanner ', url)
    // return this.http.get(`${url}`)
      .map(res => <Product[]>res.json().products[0]);
  }

  /**
   * Carica il banner (in home.ts): è l'immagine che viene caricata per il prodotto che ha come reference banner-prodotto_vetrina (hard-coded nella richiesta) 
   */
  // loadHomeBanner(): Observable<Product[]> {
  //   // return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[reference]=[banner-prodotto_vetrina]&limit=3&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //   // return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[position_in_category]=[banner-prodotto_vetrina]&limit=3&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //   let url = this.psApi.urlFor_loadHomeBanner()
  //   console.log('urlFor_loadHomeBanner ', url)
  //   return this.http.get(`${url}`)
  //     .map(res => <Product[]>res.json().products[0]);
  // }

  /**
   * Carica il dettaglio del prodotto nel Banner (NOTA: il prodotto viene otteneuto con Hard-coded reference prodotto_vetrina )
   */
  // loadProductOfBannerinPD(): Observable<Product[]> {
  //   // return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[reference]=[prodotto_vetrina]&limit=3&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //   let url = this.psApi.urlFor_loadProductOfBannerinPD()
  //   console.log('urlFor_loadProductOfBannerinPD ', url)
  //   return this.http.get(`${url}`)
  //     .map(res => <Product[]>res.json().products[0]);
  // }

  /** ** CURRENTLY NOT USED ** **
   * Load only three product of App-Featured category (used for slider in home.html )
   * http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id_category_default]=[50]&limit=3&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  loadFeaturedCategoryProducts(id: number): Observable<Product[]> {
    // return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=full&filter[id_category_default]=[${id}]&limit=3&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadFeaturedCategoryProducts(id)
    // console.log('urlFor_loadFeaturedCategoryProducts ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>res.json().products);
  }

  // Get prestashop product by providing id !! MODIFICATO PER EVITARE ngFor in products-details.html
  // loadDetails(id: number): Observable<Product[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //     .map(res => <Product[]>res.json().products);
  // }


  /**
   * Get prestashop product by providing id
   */
  loadProductDetails(id: number): Observable<Product> {
    // return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadProductDetails(id)
    console.log('urlFor_loadProductDetails ', url)
    return this.http.get(`${url}`)
      .map(res => <Product>(res.json().products[0]))
  }

  /**
   * CArica il prodotto fornendo l'id
   * http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id]=[62]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  loadProductInCatAssObj(id: number): Observable<Product[]> {
    return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=${this.psWsKey}`)
      // let url = this.psApi.urlFor_loadProductDetails(id)
      // console.log('urlFor_loadProductDetails ', url)
      // return this.http.get(`${url}`)
      .map(res => <Product[]>(res.json().products))
  }
  /**
   * Get product's stock_availables by providing product id
   */
  loadProductStockAvailable(id: number): Observable<Product> {
    // return this.http.get(`${this.psShopHostName}/stock_availables?output_format=JSON&display=full&filter[id_product]=[${id}]&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadProductStockAvailable(id)
    // console.log('urlFor_loadProductStockAvailable ', url)
    return this.http.get(`${url}`)
      .map(res => <Product>(res.json().stock_availables[0]))
  }

  /**
   * Get product's tax_rule_groups by providing id_tax_rule_groups
   */
  loadProductIdTaxRulesGroup(id: number): Observable<Product> {
    // return this.http.get(`${this.psShopHostName}/tax_rule_groups?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadProductIdTaxRulesGroup(id)
    // console.log('urlFor_loadProductIdTaxRulesGroup ', url)
    return this.http.get(`${url}`)
      .map(res => <Product>(res.json().tax_rule_groups[0]))
  }

  /**
   * Get product's specific_prices by providing product id
   * http://www.nebula-projects.com/prestashop/api/specific_prices?output_format=JSON&display=full&filter[id_product]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  loadProductSpecificPrice(id: number): Observable<Product[]> {
    // return this.http.get(`${this.psShopHostName}/specific_prices?output_format=JSON&display=full&filter[id_product]=[${id}]&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_loadProductSpecificPrice(id)
    // console.log('urlFor_loadProductSpecificPrice ', url)
    let price = this.http.get(`${url}`)
      .map(res => <Product[]>(res.json().specific_prices[0]))
    // .map(res => <Product[]>(res.json().specific_prices))
    // console.log('PSP- provider Price', price)
    // if () {
    return price
    // }
  }


  // Prodotto test (NOTA: la classe è dichiarata sopra)
  // loadDetailsMock(id: number): ProductTest {
  //   var p: ProductTest = {
  //     id: 12,
  //     name: "Pippo",
  //     id_default_image: 12,
  //     price: 4344,
  //     description: "asdfasdfasdf",
  //     level_depth: 55,
  //     id_parent: 1
  //   }
  //   return p
  // }

  /**
   * Search for prestashop products  
   * http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[name]=%25[choc]%25&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */ 
  searchProducts(searchParam: string): Observable<Product[]> {
    // return this.http.get(`${this.psShopHostName}/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[name]=[${searchParam}]%25&ws_key=${this.psWsKey}`)
    let url = this.psApi.urlFor_searchProducts(searchParam)
    // console.log('urlFor_searchProducts ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>(res.json().products))
  }


}
