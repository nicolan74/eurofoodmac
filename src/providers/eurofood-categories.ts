import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Category } from '../models/category';

import { Product } from '../models/product';

import { PrestaShopApi } from '../providers/prestashop-api-endpoint';

/*
  Generated class for the EurofoodCategories provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EurofoodCategories {
  psShopHostName: string
  psWsKey: string

  // prestashopAllCategoriesApiUrl = 'http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=[id,%20name]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';
  // prestashopCategoriesOfDepth2and3ApiUrl = 'http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=[id,%20name,id_parent]&filter[level_depth]=[2,3]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';
  // prestashopCategoriesOfDepth2and3ApiUrl = 'http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[level_depth]=[2]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN';

  constructor(
    public http: Http,
    private psApi: PrestaShopApi
  ) {
    console.log('Hello EurofoodCategories Provider');
  }

  /**
   * Load all PrestaShop's categories with level_depth = 2
   */
  loadCategories(): Observable<Category[]> {
    // return this.http.get(`${this.prestashopCategoriesOfDepth2and3ApiUrl}`)
    let url = this.psApi.urlFor_loadCategories()
    console.log('urlFor_loadCategories ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories);
  }



  /**
   * Effettua una richiesta di categorie di level_depth = 3 filtrata per l'id_parent pari all'id della categoria 
   * Restituisce le sottocategorie della categoria  
   */
  loadCategoriesLevelDepthThree(id: number): Observable<Category[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[level_depth]=[3]&filter[id_parent]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCategoriesLevelDepthThree(id)
    console.log('urlFor_loadCategoriesLevelDepthThree ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories);
  }

  /**
   * All'entrata in categories.ts se non esiste un id (perchè non viene passato) viene eseguita una chiamata che restituisce tutte le categorie
   * Quets chiamata vine eseguita al clic su  goToCategoryOrToProductsByCategory e esegue una richiesta per l'id passato
   */
  loadSubCategories(id: number): Observable<Category[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[id_parent]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.url_loadSubCategories(id)
    console.log('.url_loadSubCategories ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories);
  }


  // return this.http.get(`${this.prestashopCategoriesOfDepth2and3ApiUrl}`)

  // loadCategoriesInHomeCarousel(): Observable<Category[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[level_depth]=[2]&limit=5&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //   // let url = this.psApi.urlFor_loadCategories()
  //   // console.log('urlFor_loadCategories ', url)
  //   // return this.http.get(`${url}`)
  //     .map(res => <Category[]>res.json().categories);
  // }




  // ANCORA NON IN USO !! MI SEMBRA RINDONDANTE VEDI LoadCategoriesDtls

  // loadProductsInCategoryAssociationsById(id: number): Observable<Product[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //     .map(res => <Product[]>res.json().categories[0]);
  // }

  /**
   * Load 'OFFERTE' CATEGORY filtering PrestaShop's categories for (hard-coded) name = Offerte.
   * Then home.ts gets the id of the category Offerte and does a second Request to obtain its Products
   */
  loadOfferCategory(): Observable<Category[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[name]=[Offerte]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadOfferCategory()
    console.log('urlFor_loadOfferCategory ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories[0]);
  }

  // loadCategoryImage(id: number): Observable<Category[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/images/categories/${id}?output_format=JSON&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //   // let url = this.psApi.urlFor_loadOfferCategory()
  //   // console.log('urlFor_loadOfferCategory ', url)
  //   // return this.http.get(`${url}`)
  //     .map(res => <Category[]>res.json());
  // }

  /**
   * Load APP-FEATURED CATEGORY filtering PrestaShop's categories for (hard-coded) name = Banner
   * ** Modificata era name = App-Featured  
   * Then home.ts gets the id of the category Offerte and does a second Request to obtain its Products)
   */
  loadFeaturedCategory(): Observable<Category[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[name]=[App-Featured]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadFeaturedCategory()
    console.log('urlFor_loadFeaturedCategory ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories[0]);
  }

  /**
   * Load In Evidenza CATEGORY filtering PrestaShop's categories for (hard-coded) name = In Evidenza
   * http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[name]=[In%20Evidenza]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  loadInEvidenzaCategory(): Observable<Category[]> {
    let url = this.psApi.urlFor_loadInEvidenzaCategory()
    console.log('urlFor_loadInEvidenzaCategory ', url)
    return this.http.get(`${url}`)
      .map(res => <Category[]>res.json().categories[0]);
  }


  // Load a category by providing category id (used to retrieve subcategory name in products-by-category)
  // loadCategoriesDtls(id: number): Observable<Category[]> {
  //   return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
  //     .map(res => <Category[]>res.json().categories);
  // }

  /** **  ** 
   *  Load a category by providing category id (used to retrieve subcategory name in products-by-category)
   */
  loadCategoriesDtls(id: number): Observable<Product[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[id]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadCategoriesDtls(id)
    console.log('urlFor_loadCategoriesDtls ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>res.json().categories[0]);
  }



  /**
   * Get prestashop product by providing category id
   */
  loadProductsByCategoryId(id: number): Observable<Product[]> {
    // return this.http.get(`http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id_category_default]=[${id}]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN`)
    let url = this.psApi.urlFor_loadProductsByCategoryId(id)
    console.log('urlFor_loadProductsByCategoryId ', url)
    return this.http.get(`${url}`)
      .map(res => <Product[]>(res.json().products))
  }


}
