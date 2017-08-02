import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GlobalVars provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export enum ENVS {
  DEVELOPMENT_ENVIRONMENT_old,
  DEVELOPMENT_ENVIRONMENT_new,
  TEST_ENVIRONMENT,
  PRODUCTION_ENVIRONMENT
}

@Injectable()
export class PrestaShopApi {
  psShopHostName: string
  psWsKey: string

  // DEVELOPMENT_ENVIRONMENT_old = 0
  // DEVELOPMENT_ENVIRONMENT_new = 1
  // TEST_ENVIRONMENT = 2
  // PRODUCTION_ENVIRONMENT = 3
  //current_env : ENVS


  // urlOriginalProductsInSearchPage: "http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN"
  // urlOriginalProductsInSearchPage: string

  constructor() {
    console.log('Hello GlobalVars Provider');
    // this.myGlobalVar = "";
    // this.DEVELOPMENT_ENVIRONMENT_old = true
    // this.DEVELOPMENT_ENVIRONMENT_new = false
    // this.TEST_ENVIRONMENT = false
    // this.PRODUCTION_ENVIRONMENT = false

    let env = this.current_env()
    // let env2 = ENVS.DEVELOPMENT_ENVIRONMENT_new


    // if (env1.valueOf() == env2.valueOf()) {
    //   //
    // }
    switch (env) {
      case (ENVS.DEVELOPMENT_ENVIRONMENT_old):
        this.psShopHostName = "http://www.nebula-projects.com/prestashop/api";
        this.psWsKey = "IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN";
        break
      case (ENVS.DEVELOPMENT_ENVIRONMENT_new):
        this.psShopHostName = "https://svil.eurofoodservice.it/api/";
        this.psWsKey = "IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN";
        break
      case (ENVS.TEST_ENVIRONMENT):
        this.psShopHostName = "https://test.eurofoodservice.it/api";
        // this.psWsKey = "YDYC7AI4VHHZFVIKC6CYLXMHW511K6M2";
        this.psWsKey = "H8HD2UXR78Z2T3CLHGNQPMEWKQBLASJA"
        break
      case (ENVS.PRODUCTION_ENVIRONMENT):
        this.psShopHostName = "https://www.eurofoodservice.it/api/";
        this.psWsKey = "RKGNZR2YSP6JNC56596D2FI94JFNXY2C";
        break
      default:
        console.log("ERRORE CONFIGURAZIONE AMBIENTE. ALMENO UN AMBIENTE TRA QUELLI DISPONIBILI DEVE ESSERE SELEZIONATO")
    }
  }

  current_env(): ENVS {
    // return ENVS.DEVELOPMENT_ENVIRONMENT_old;
    // return ENVS.TEST_ENVIRONMENT
    return ENVS.PRODUCTION_ENVIRONMENT
  }
  // setMyGlobalVar(value) {
  //  let urlOriginalProductsInSearchPage = "http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN";
  // }


  // let s: string;
  // s = "ppp" 
  // s.charAt(2)


  /* ################## for the PROVIDER PRESTASHOP-PRODUCTS.ts ################## */

  /**
   * Load prestashop products (of HOME category) ! E' usato in search.ts Per velocizzare il caricamento
   */
  urlFor_loadOriginalProductsInSearchPage() {
    // let urlOriginalProductsInSearchPage = this.psShopHostName + "/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=" + this.psWsKey
    // let urlOriginalProductsInSearchPage = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id_category_default]=[2]&filter[id]=[1257,1324]&ws_key=" + this.psWsKey
    /**
     * Il alternativa al codice sopra che prendeva i prodotti da 1257 a 1324 della categoria 2 (e.g., Home) applico questo sotto. Infatti dopo delle modifiche che il team 
     * di Eurofood ha fatto in Ps la chiamata precedente restituiva solo 2 prodotti che corrispondenvano ai filtri
     * L'attuale chiamata prende i prodotti da 1 a 10 senza filtrare per categoria
     */
    let urlOriginalProductsInSearchPage = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id]=[1,10]&filter[active]=1&ws_key=" + this.psWsKey

    return urlOriginalProductsInSearchPage;
  }

  /** * *** USATO SE GET_PRODUCT_BY_ID_CATEGORY_DEFAULT = true *** 
   * Load only three product of Offerte category ("Le nostre offerte in home.html") by providing offer category ID 
   * retrieved by the REQUEST loadOfferCategory in eurofood-categories.ts
   */
  urlFor_loadOfferCategoryProductsInHomePage(id: number): string {
    let urlOfferCategoryProductsInHomePage = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id_category_default]=[" + id + "]&limit=3&ws_key=" + this.psWsKey
    return urlOfferCategoryProductsInHomePage;
  }

  /** ** CURRENTLY NOT USED ** **
   * Load only three product of App-Featured category (used for slider in home.html )
   */
  urlFor_loadFeaturedCategoryProducts(id: number): string {
    let urlFeaturedCategoryProducts = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id_category_default]=[" + id + "]&limit=3&ws_key=" + this.psWsKey
    return urlFeaturedCategoryProducts
  }

  /**
   * Get prestashop product by providing id
   */
  urlFor_loadProductDetails(id: number): string {
    let urlProductDetails = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=" + this.psWsKey
    return urlProductDetails
  }

  /**
   * Get product's stock_availables by providing product id
   */
  urlFor_loadProductStockAvailable(id: number): string {
    let urlProductStockAvailable = this.psShopHostName + "/stock_availables?output_format=JSON&display=full&filter[id_product]=[" + id + "]&ws_key=" + this.psWsKey
    return urlProductStockAvailable
  }

  /**
   * Get product's tax_rule_groups by providing id_tax_rule_groups
   */
  urlFor_loadProductIdTaxRulesGroup(id: number): string {
    let urlProductIdTaxRulesGroup = this.psShopHostName + "/tax_rule_groups?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=" + this.psWsKey
    return urlProductIdTaxRulesGroup
  }

  /**
   * Get product's specific_prices by providing product id
   */
  urlFor_loadProductSpecificPrice(id: number): string {
    let urlProductSpecificPrice = this.psShopHostName + "/specific_prices?output_format=JSON&display=full&filter[id_product]=[" + id + "]&ws_key=" + this.psWsKey
    return urlProductSpecificPrice
  }

  urlFor_searchProducts(searchParam: string): string {
    // let urlSearchProducts = this.psShopHostName + "/products?output_format=JSON&display=[id,%20name,%20id_default_image,%20price,%20description]&filter[name]=%25[" + searchParam + "]%25&ws_key=" + this.psWsKey
    let urlSearchProducts = this.psShopHostName + "/products?output_format=JSON&display=full&filter[name]=%25[" + searchParam + "]%25&filter[active]=1&ws_key=" + this.psWsKey
    return urlSearchProducts
  }

  /**
   * Carica il banner (in home.ts): è l'immagine che viene caricata per il prodotto che ha come reference banner-prodotto_vetrina (hard-coded nella richiesta) 
   */
  urlFor_loadHomeBanner(): string {
    let urlLoadHomeBanner = this.psShopHostName + "/products?output_format=JSON&display=full&filter[reference]=[banner-prodotto_vetrina]&ws_key=" + this.psWsKey
    return urlLoadHomeBanner
  }

  /**
   * Carica il dettaglio del prodotto nel Banner (NOTA: il prodotto viene otteneuto con Hard-coded reference prodotto_vetrina )
   */
  urlFor_loadProductOfBannerinPD(): string {
    let urlFor_loadProductOfBannerinPD = this.psShopHostName + "/products?output_format=JSON&display=full&filter[reference]=[prodotto_vetrina]&limit=3&ws_key=" + this.psWsKey
    return urlFor_loadProductOfBannerinPD
  }

  /* ################## END for the PROVIDER PRESTASHOP-PRODUCTS.ts ################## */

  /* ################## for the PROVIDER PRESTASHOP-CATEGORIES.ts #################### */

  /**
   * Load all PrestaShop's categories with level_depth = 2
   */
  urlFor_loadCategories(): string {
    let urlCategories = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[level_depth]=[2]]&sort=[name_ASC]&ws_key=" + this.psWsKey
    return urlCategories
  }

  /**
   * Load the 'OFFERTE' CATEGORY filtering PrestaShop's categories for (hard-coded) name = Offerte.
   * Then home.ts gets the id of the category Offerte and does a second Request to obtain its Products
   */
  urlFor_loadOfferCategory(): string {
    let urlOfferCategory = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[name]=[Offerte]&ws_key=" + this.psWsKey
    return urlOfferCategory
  }

  /**
   * Load APP-FEATURED CATEGORY filtering PrestaShop's categories for (hard-coded) name = Banner
   * Modificato era name = App-Featured 
   * Then home.ts gets the id of the category Offerte and does a second Request to obtain its Products)
   */
  urlFor_loadFeaturedCategory(): string {
    let urlOfferCategory = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[name]=[Banner]&ws_key=" + this.psWsKey
    return urlOfferCategory
  }

  urlFor_loadInEvidenzaCategory(): string {
    let urlInEvidenzaCategory = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[name]=[In Evidenza]&ws_key=" + this.psWsKey
    return urlInEvidenzaCategory
  }

  /** ** FOLLOWING CURRENTLY NOT USED ** 
   *  Load a category by providing category id (used to retrieve subcategory name in products-by-category)
   *  http://www.nebula-projects.com/prestashop/api/categories?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  urlFor_loadCategoriesDtls(id: number): string {
    let urlCategoriesDtls = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=" + this.psWsKey
    return urlCategoriesDtls
  }

  /** usato in products-by-cstegory.ts se GET_PRODUCT_BY_ID_CATEGORY_DEFAULT = true **
   * Get prestashop product by providing category id
   * http://www.nebula-projects.com/prestashop/api/products?output_format=JSON&display=full&filter[id_category_default]=[" + id + "]&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
   */
  urlFor_loadProductsByCategoryId(id: number): string {
    let urlProductsByCategoryId = this.psShopHostName + "/products?output_format=JSON&display=full&filter[id_category_default]=[" + id + "]&ws_key=" + this.psWsKey
    return urlProductsByCategoryId
  }

  /**
   * Carica le sottocategorie (22.05.17: usato solo per le sottocategorie di offerte in sub-offerte.ts)
   */
  urlFor_loadCategoriesLevelDepthThree(id: number): string {
    let urlCategoriesLevelDepthThree = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[level_depth]=[3]&filter[id_parent]=[" + id + "]&ws_key=" + this.psWsKey
    return urlCategoriesLevelDepthThree
  }

  url_loadSubCategories(id: number): string {
    let urlLoadSubCategories = this.psShopHostName + "/categories?output_format=JSON&display=full&filter[id_parent]=[" + id + "]&ws_key=" + this.psWsKey
    return urlLoadSubCategories
  }



  /* ################## END for the PROVIDER PRESTASHOP-CATEGORIES.ts ####################### */

  /* ################## for the PROVIDER PRESTASHOP-CUSTOMER-ADDRESS.ts ##################### */
  urlFor_loadCustomerAddress(id: number): string {
    let urlCustomerAddress = this.psShopHostName + "/addresses?output_format=JSON&display=full&filter[id_customer]=[" + id + "]&ws_key=" + this.psWsKey
    return urlCustomerAddress
  }
  /* ################## END the PROVIDER PRESTASHOP-CUSTOMER-ADDRESS.ts #################### */

  /* ################## for the PROVIDER PRESTASHOP-CUSTOMER-ORDERS.ts ##################### */
  urlFor_loadCustomerOrders(id: number): string {
    let urlCustomerOrders = this.psShopHostName + "/orders?output_format=JSON&display=full&filter[id_customer]=[" + id + "]&ws_key=" + this.psWsKey
    return urlCustomerOrders
  }

  urlFor_loadCustomerOrderState(id_order_current_state: number): string {
    let urlCustomerOrderState = this.psShopHostName + "/order_states?output_format=JSON&display=full&filter[id]=[" + id_order_current_state + "]&ws_key=" + this.psWsKey
    return urlCustomerOrderState
  }

  urlFor_loadOrderDetails(id: number): string {
    let urlOrderDetails = this.psShopHostName + "/order_details?output_format=JSON&display=full&filter[id_order]=[" + id + "]&ws_key=" + this.psWsKey
    return urlOrderDetails
  }

  /* ################## END for the PROVIDER PRESTASHOP-CUSTOMER-ORDERS.ts ##################### */

  /* ################## for the PROVIDER PRESTASHOP-CUSTOMER.ts ##################### */
  urlFor_loadLoggedCustomerDetails(id: number): string {
    let urlLoggedCustomerDetails = this.psShopHostName + "/customers?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=" + this.psWsKey
    return urlLoggedCustomerDetails
  }

  /**
   * Used in login.ts: does a Request of ps customers filtered by the email set by user in the login form
   * If the Request return a customer then this is logged in.
   */
  urlFor_customerAuthentication(email: string): string {
    let urlcustomerAuthentication = this.psShopHostName + "/customers?output_format=JSON&display=full&filter[email]=[" + email + "]&ws_key=" + this.psWsKey
    return urlcustomerAuthentication
  }

  /**
   * Used in signup.ts: does a Request of ps customers filtered by the email set by user in the REGISTRATION form
   * If the Request return a customer a message alerts that the email is already used
   */
  urlFor_checkEmail(email: string): string {
    let urlcheckEmail = this.psShopHostName + "/customers?output_format=JSON&display=full&filter[email]=[" + email + "]&ws_key=" + this.psWsKey
    return urlcheckEmail
  }

  urlFor_customerRegistration(id: number): string {
    let urlCustomerRegistration = this.psShopHostName + "/customers?output_format=JSON&display=full&filter[id]=[" + id + "]&ws_key=" + this.psWsKey
    return urlCustomerRegistration
  }
  /* ################## END the PROVIDER PRESTASHOP-CUSTOMER.ts ##################### */



} // End export class PrestaShopApi
