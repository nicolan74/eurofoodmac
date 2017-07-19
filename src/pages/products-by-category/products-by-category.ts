import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, AlertController } from 'ionic-angular';

import { Category } from '../../models/category';

import { Product } from '../../models/product';
import { EurofoodCategories } from '../../providers/eurofood-categories';
import { PrestashopProducts } from '../../providers/prestashop-products';

import { ProductDetailsPage } from '../product-details/product-details';
import { LoginPage } from '../login/login';

// import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

import { Localstorage } from '../../providers/localstorage';

import { User } from '../../models/user';
import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

import { SearchPage } from '../search/search';
import { WishlistPage } from '../wishlist/wishlist';

import { ProductInCart } from '../../models/productInCart';
import { MyCart } from '../../models/mycart';

import { EurofoodUsers } from '../../providers/eurofood-users';

/*
  Generated class for the ProductsByCategory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html'
})
export class ProductsByCategoryPage {
  products: Product[];

  id: number;
  offerCategoryID: number;

  otherCategoryID: number;
  otherCategoryName: any;
  categoryNameFromReturnToProductsByCategory: any;
  categoryNameFromSubOfferte: any;
  viewAll: any;

  categoryName: any;
  categoryId: number;

  name: string;

  currentUser: User;

  product: Product;

  productsLoadedByCatAss: Product[] = []

  product_id: number

  categoriesObject: Product[]

  categories: Category[]

  subcategories: Category[]

  productsInCart: ProductInCart[]

  isActive_currentUser: any;

  // specificprice: any;

  GET_PRODUCT_BY_ID_CATEGORY_DEFAULT: boolean

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private eurofoodCategories: EurofoodCategories,
    private localstorage: Localstorage,
    private alertCtrl: AlertController,
    private psProducts: PrestashopProducts,
    private psApi: PrestaShopApi,
    public eurofoodUsers: EurofoodUsers
  ) {

    this.productsInCart = MyCart.getInstance().products
    console.log('!->This products (categories.ts)', this.productsInCart)


    // è passato da home.ts
    this.offerCategoryID = navParams.get('idOffer');
    console.log('--> this.offerCategoryID get in products-by-category ', this.offerCategoryID)

    // è passato da 
    // - categories.ts e 
    // - da home.ts dalla categoria selezionata nel carosello
    this.otherCategoryID = navParams.get('id');
    console.log('--> this.otherCategoryID ', this.otherCategoryID)

    // il parametro categoryName è passato da
    // - home.ts 
    // - categories.ts
    // - sub-offerte.ts
    this.otherCategoryName = navParams.get('categoryName');
    console.log('--> this.otherCategoryName ', this.otherCategoryName)

    this.categoryNameFromSubOfferte = navParams.get('offerCategoryName');
    console.log('--> this.otherCategoryName when get category name passed by sub-offerte ', this.otherCategoryName)

    // il parametro name è passato da questa stessa pagina nel template è nella 
    // sezione attiva quando esistono le subcategorie
    // this.categoryNameFromReturnToProductsByCategory = navParams.get('name');
    // console.log(' - - this.categoryNameFromReturnToProductsByCategory', this.categoryNameFromReturnToProductsByCategory)

    // il parametro name è passato da home.ts dalla categoria selezionata nel carosello
    // this.otherCategoryName = navParams.get('name');

    // se esiste viewAll è uguale a true e vuol dire che dall elenco di sottocategorie è stato cliccato 'TUTTO'
    // this.viewAll = navParams.get('viewAll');
    // console.log('Get viewAll  (p-b-c.ts)', this.viewAll)

    /**
     * Se esiste offerCategoryID allora home.ts sta passando l'ID della categoria Offerte.
     * Al this.id (passato come filtro in loadProductsByCategoryId) viene assegnato offerCategoryID
     * Se NON ESISTE offerCategoryID vuol dire che è categories.ts a passare l'ID e dunque
     * ad this.id viene assegnato otherCategoryID
     */
    if (this.offerCategoryID) {
      this.id = this.offerCategoryID
      console.log('--> this.id ', this.id)
    }
    else {

      this.id = this.otherCategoryID

    }
    console.log('--> this.id ', this.id)

    //Create the Loading popup
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    //Show the popup
    loadingPopup.present();

    //Dismiss yje popup
    setTimeout(() => {
      loadingPopup.dismiss();
    }, 2000);

  } // end constructor

  ngOnInit() {
    /**
     * SE IMPOSTATO A TRUE I PRODOTTI VENGONO OTTENUTI CON UNA CHIAMATA A PRODOTTI FILTRATA X ID_CATEGORY_DEFAULT 
     * SE IMPOSTATO A FALSE VIENE PRIMA CHIOAMATA LA CATEGORIA CON L'ID PASSATO, DA QUESTA VENGONO OTTENUTI GLI ID DEI PRODOTTI
     * DA OGGETTO PRODUCTS NESTED IN ASSOCIATIONS, SUCCESSIVAMENTE CON GLI ID DEI PRODOTTI VIENE EFFETTUATE TANTE CHIAMATE A PRODOTTI
     * PER GLI ID OTTENUTO, I RESPONSE VENGONO QUINDI PUSH NELL' ARRAY VUOTO productsLoadedByCatAss
     */
    this.GET_PRODUCT_BY_ID_CATEGORY_DEFAULT = false

    if (this.GET_PRODUCT_BY_ID_CATEGORY_DEFAULT) {

      // Create the Loading popup
      let loadingPopup = this.loadingCtrl.create({
        content: 'Loading data...'
      });
      // Show the popup
      loadingPopup.present();

      this.eurofoodCategories.loadProductsByCategoryId(this.id).subscribe(products => {
        // eurofoodCategories.loadCategoriesDtls(this.id).subscribe(category => {

        this.products = products;

        loadingPopup.dismiss();

        console.log('Prodotti ', products)

        let lengthOfProducsObject = products.length
        console.log('Lenght Array Prodotti ', lengthOfProducsObject)

        let i = 0
        for (i = 0; i < lengthOfProducsObject; ++i) {
          console.log(i);

          let id_product = this.products[i]['id']
          console.log('ID Prodotto ', id_product)

          /**
           * Assegno ad associations il nested OBJECT ASSOCIATIONS
           */
          let associations = this.products[i]['associations']
          console.log('-> OBJECT ASSOCIATIONS ', associations)

          /** 
           * Assegno a categoriesInAssociationsObiect 
           * l'Array CATEGORIES contenuto nell'object associations 
           */

          let categoriesInAssociationsObiect = this.products[i]['associations']['categories']
          console.log('--> ARRAY CATEGORIES contenuto in Associations ', categoriesInAssociationsObiect)

          /**
           * Numero elementi contenuti nell'ARRAY CATEGORIES 
           * Gli elementi in pratica sono ID. Ad ogni ID corrisponde una categoria a cui il prodotto è associato )
           */
          let lengthOf_categoriesInAssociationsObiect = categoriesInAssociationsObiect.length
          console.log('---> N° Object nell ARRAY CATEGORIES: ' + lengthOf_categoriesInAssociationsObiect + ' (x Prodotto: ' + id_product + ')')

          /**
           * Ricavo il value della key ID degli objects all'interno dell'ARRAY CATEGORIES  
           */
          for (let j = 0; j < lengthOf_categoriesInAssociationsObiect; j++) {
            let id_categoryInAssociationsObiect = categoriesInAssociationsObiect[j]['id']
            console.log('----> ID CATEGORIA: ' + id_categoryInAssociationsObiect + ' x Prodotto: ' + id_product)

          }

          /**********************************************************************************************************
          * ###################################### 29.04
          */

          /**
           * Chiedo a prestashop l'oggetto categoria che corrisponde all'ID prima ottenuto (chiamata filtrata per ID)
           */
          // this.eurofoodCategories.loadCategoriesDtls(id_categoryInAssociationsObiect).subscribe(categories => {
          //   this.categories = categories;

          //   console.log('-----> object CATEGORIA: ' + categories)

          //   for (let category of this.categories) {
          //     let categoryName = category.name
          //     console.log('------> NOME CATEGORIA: ' + categoryName + ' (x Prodotto ID: ' + id_product + ')')

          //   }

          // });

          /**
           * Ricavo il value della key ID degli objects all'interno dell'ARRAY CATEGORIES  
           */
          // for (i = 0; i < lengthOf_categoriesInAssociationsObiect; ++i) {
          //   let id_categoryInAssociationsObiect = categoriesInAssociationsObiect[i]['id']
          //   console.log('----> ID CATEGORIA ' + id_categoryInAssociationsObiect + ' x Prodotto: ' +id_product)
          // }

          /**
           * Se la CATEGORIA HA ID = 51 (è CIOè QUELLA DELLE OFFERTE)
           * eseguo una richiesta per ottenere lo SPECIFIC PRICE
           */
          let id_defaultCategory = this.products[i]['id_category_default']
          if (id_defaultCategory = this.offerCategoryID) {
            let id_product = this.products[i]['id']
            console.log('Id Prodotto se Categoria = Offerte', id_product)
            this.psProducts.loadProductSpecificPrice(id_product).subscribe(specificprice => {
              if (specificprice) {

                console.log('Specific Price Array ', specificprice)

                let reduction = specificprice['reduction']

                for (let product of this.products) {
                  if (product.id == id_product) {
                    product.reduction = reduction
                    console.log('Sconto percentuale ', product.reduction)
                    product.discountedPrice = product.price - (product.price * product.reduction)
                    console.log('Prezzo scontato ', product.discountedPrice)
                    product.id_category_default = id_defaultCategory
                  }
                }

              } // end if specificprice
            });
          } // end if id_defaultCategory == 44

        } // end PRIMO FOR

      });

    } // end GET_PRODUCT_BY_ID_CATEGORY_DEFAULT

    else {

      // this.eurofoodCategories.loadCategoriesLevelDepthThree(this.id).subscribe(subcategories => {
      //   // console.log('Sottocategorie (p-b-c.ts) ', subcategories)

      //   // se l'object delle sottocategorie esiste visualizza le sottocategorie
      //   if ((subcategories != null) && (!this.viewAll)) {
      //     this.subcategories = subcategories
      //     console.log('--- *** Sottocategorie (p-b-c.ts) ', subcategories)
      //   } 

      // else {

      // }); // end loadCategoriesLevelDepthThree

      // Dammi i prodotti della categoria solo se NON ESISTE l'object sottocategorie
      // if (this.subcategories.length === 0) {
      // console.log('--- *** Sottocategorie  qui NON esiste (p-b-c.ts) ', this.subcategories)

      // // Create the Loading popup
      // let loadingPopup = this.loadingCtrl.create({
      //   content: 'Loading data...'
      // });

      // // Show the popup
      // loadingPopup.present();

      this.eurofoodCategories.loadCategoriesDtls(this.id).subscribe(category => {
        console.log('Categoria da chiamata filtrata per id categoria (p-b-c.ts) ', category)

        this.categoryId = category['id']
        console.log('++++ ID CATEGORIA ', this.categoryId)

        this.categoryName = category['name']
        console.log('++++ NAME CATEGORIA ', this.categoryName)



        /**
         * dopo l'aggiunta della proprietà hasImage nel models category.ts
         * la compilazione si è bloccata perchè: (riporto msg visualizzato nel terminale)
         * this.categories = category;
         * Type 'Product[]' is not assignable to type 'Category[]'. Type 'Product' is not assignable to type
         * 'Category'. Property 'hasImage' is missing in type 'Product'.
         * HO risolto aggiungendo la proprietà 'hasImage' anche nel models product.ts
         */
        this.categories = category;

        console.log('this.categories (p-b-c.ts): ', this.categories)

        //   loadingPopup.dismiss();
        // }, 3000);

        let associationsObject = category['associations']
        console.log('--> Ass Obj ', associationsObject)

        let productsInassociationsObject = category['associations']['products']
        console.log('--> Prodotti in Ass Obj ', productsInassociationsObject)

        let lengthOf_productsInassociationsObject = productsInassociationsObject.length
        console.log('--> Lenght Prod in Ass Obj ', lengthOf_productsInassociationsObject)

        for (let k = 0; k < lengthOf_productsInassociationsObject; ++k) {
          console.log(k);

          // let productId = productsInassociationsObject[k]['id']
          this.product_id = productsInassociationsObject[k]['id']
          console.log('---> Product ID in association object: ', this.product_id)

          /**
           *  EFFETTUA UNA RICHIESTA (CICLICA) DI PRODOTTI FILTRATA X L'ID DEL PRODOTTO 
           *  OTTENUTO DALL OGGETTO PRODUCTS NESTED IN ASSOCIATIONS (A SUA VOLTA IN CATEGORIES)
           */
          this.psProducts.loadProductInCatAssObj(this.product_id).subscribe(products => {

            console.log('Prodotto ritornato con gli id presenti in associations > products (p-b-c.ts) ', products)
            console.log('ID Prodotto ritornato con gli id presenti in associations > products (p-b-c.ts) ', products[0]['id'])

            /**
             * Check se l'immagine esiste
             */
            for (let product of products) {
              // var imageFile = "http://www.nebula-projects.com/prestashop/api/images/products/"+product.id+"/"+product.id_default_image+"/home_default?ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN"
              var imageFile = this.psApi.psShopHostName + "/images/products/" + product.id + "/" + product.id_default_image + "/home_default?ws_key=" + this.psApi.psWsKey
              checkImageExists(imageFile, function (existsImage) {
                if (existsImage == true) {
                  product.hasImage = true
                  console.log('Product HAS IMAGE ', product.hasImage)
                }
                else {
                  product.hasImage = false
                  console.log('Product HAS IMAGE ', product.hasImage)
                }
              }); // end checkImageExists
            } // end FOR 

            // Use the below code to check if image exist using image url.
            function checkImageExists(imageUrl, callBack) {
              var imageData = new Image();
              imageData.onload = function () {
                callBack(true);
              };
              imageData.onerror = function () {
                callBack(false);
              };
              imageData.src = imageUrl;
            } // end checkImageExists

            /**
             * productsLoadedByCatAss è un ARRAY VUOTO (vedi sopra nella classe)
             * a cui ad ogni ciclo aggiungo l'oggetto products restituito dalla richiesta
             */

            // this.productsLoadedByCatAss.push(products[0])

            // console.log('this.productsLoadedByCatAss 1', this.productsLoadedByCatAss)

            // }); // end loadProductInCatAssObj

            /**
             * con gli ID del prodotto come prima ottenuto effettuo una richiesta vs specific_prices
             * per vedere se al prodotto sono stati applicati degli sconti
             */
            // // Create the Loading popup
            // let loadingPopup = this.loadingCtrl.create({
            //   content: 'Loading data...'
            // });
            // // Show the popup
            // loadingPopup.present();
            this.psProducts.loadProductSpecificPrice(products[0]['id']).subscribe(specificprice => {

              // this.productsLoadedByCatAss.push(specificprice[0])
              // console.log('this.productsLoadedByCatAss 2', this.productsLoadedByCatAss)

              // loadingPopup.dismiss();

              console.log('OBJECT SPECIFIC PRICE ', specificprice)

              let reduction = specificprice['reduction']
              console.log('RIDUZIONE SUL PREZZO ', reduction)
              let productWithReductionID = specificprice['id_product']
              console.log('Id PROD CON RIDUZIONE SUL PREZZO ', productWithReductionID)

              // this.productsLoadedByCatAss = specificprice

              for (let product of this.productsLoadedByCatAss) {
                if (product.id == productWithReductionID) {
                  console.log('RIDUZIONE SUL PREZZO ', reduction)
                  product.reduction = reduction
                  console.log('Sconto percentuale ', product.reduction)
                  product.discountedPrice = product.price - (product.price * product.reduction)
                  console.log('Prezzo scontato ', product.discountedPrice)
                }

              } // end for

            }); // end loadProductInCatAssSpecificPrice

            /**
             * productsLoadedByCatAss è un ARRAY VUOTO (vedi sopra nella classe)
             * a cui ad ogni ciclo aggiungo l'oggetto products restituito dalla richiesta
             */

            this.productsLoadedByCatAss.push(products[0])


          }); // end loadProductInCatAssObj

        } // end for x ottenere gli id dal nested products

      }); // end loadCategoriesDtls


      //   } // end else esiste l'oggetto sottocategorie

      // }); // end loadCategoriesLevelDepthThree

    } // end else GET PRODUCT BY ID RETRIEVED IN CATEGORY ASSOCIATION OBJECT

  } // end ngOnInit

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI product-by-category.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.productsInCart) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  ngAfterViewInit() {
    // this.eurofoodCategories.loadProductsByCategoryId(this.id).subscribe(products => {

    //   // Create the Loading popup
    //   let loadingPopup = this.loadingCtrl.create({
    //     content: 'Loading data...'
    //   });
    //   // Show the popup
    //   loadingPopup.present();

    //   this.products = products;

    //   loadingPopup.dismiss();


    //   console.log('Prodotti ', products)

    //   let lengthOfProducsObject = this.products.length
    //   console.log('Lenght Array Prodotti ', lengthOfProducsObject)


    // for (var i: number = 0; i < lengthOfProducsObject; i++) {


    //   let associations = this.products[i]['associations']
    //   let id_product = this.products[i]['id']
    //   let id_defaultCategory = this.products[i]['id_category_default']
    //   console.log('----> Associazioni ', associations)
    //   console.log('---> Id default Category x Id Prod ' + id_product + ': ' + id_defaultCategory)
    //   console.log('Ciclo ', i)

    //   let categoriesObject = this.products[i]['associations']['categories']
    //   console.log('Object Categories ', categoriesObject)

    //   let lengthOfcategoriesObject = categoriesObject.length
    //   console.log('LENGTH Object Assoc -> Categories x prod Id ' + id_product + ': ' + lengthOfcategoriesObject)

    //   for (var i: number = 0; i < lengthOfcategoriesObject; i++) {
    //     let id_category_in_nested_object = categoriesObject[i]['id']
    //     console.log('Id delle Categ in Assoc -> Categories x prod Id ' + id_product + ': ' + id_category_in_nested_object)

    //     this.eurofoodCategories.loadCategoriesDtls(id_category_in_nested_object).subscribe(categories => {
    //       this.categories = categories;

    //       console.log('Categoria Associata al prodotto ', categories)

    //       for (let category of this.categories) {
    //         let categoryName = category.name
    //         console.log('Nome Categoria x Id Prod ' + id_product + ': ' + categoryName)

    //       }

    //       let catlen = categories.length

    /* Questo da rivedere */
    // for (var i: number = 0; i < catlen; i++) {
    //   let category_name_in_nested_object = categories[i]['name']
    //   console.log('xx ', category_name_in_nested_object)

    //   for (let product of this.products) {
    //     product.category_name_in_nested_object =  category_name_in_nested_object

    //     console.log('xxx ', product.category_name_in_nested_object)
    //   }
    // }

    // });

    // let id_category_in_nested_object = products[i]['associations']['categories']['id']
    // console.log('Cat Id in Nested ', id_category_in_nested_object)

    // for (let product of this.products) {
    //   product.id_category_in_nested_object = products[i]['associations']['categories']['id']
    //   console.log('Cat Id in Nested ', product.id_category_in_nested_object)

    // }
    // }

    // for (let product of this.products) {
    //   product.id_category_in_nested_object = products[i]['associations']['categories']['id']
    //   console.log('Cat Id in Nested ', product.id_category_in_nested_object)


    // }

    // let categoriesObjectId = products[i]['associations']['categories']['id']
    // console.log('Object Categories Id', categoriesObjectId)
    // let lengthAssociations = associations.length
    // console.log('Lengh Association Object ', lengthAssociations)

    // for (var i: number = 0; i < lengthAssociations; i++) {

    //   let categoriesObject = associations[i]['categories']
    //   console.log('Categorie nested in Associations ', categoriesObject)
    // }



    // if (id_defaultCategory == 44) {
    //   let id_product = this.products[i]['id']
    //   console.log('Id Prodotto se Cat 44', id_product)
    //   this.eurofoodProducts.loadProductSpecificPrice(id_product).subscribe(specificprice => {
    //     if (specificprice) {

    //       console.log('Specific Price Array ', specificprice)

    //       let reduction = specificprice['reduction']

    //       for (let product of this.products) {
    //         if (product.id == id_product) {
    //           product.reduction = reduction
    //           console.log('Sconto percentuale ', product.reduction)
    //           product.discountedPrice = product.price - (product.price * product.reduction)
    //           console.log('Prezzo scontato ', product.discountedPrice)
    //           product.id_category_default = id_defaultCategory
    //         }
    //       }

    //     } // end if specificprice
    //   });
    // } // end if id_defaultCategory == 44

    // } // end for

    // }); // end subscribe products


    // CHECK USER IS LOGGED
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {
      // if (hasLoggedIn) {
      this.getCurrentUser();


      // } else {

      //   let msgNoLogged = this.alertCtrl.create({

      //     title: 'Attenzione!',
      //     message: 'Accedi per visualizzare i prezzi delle nostre offerte',
      //     buttons: [
      //       {
      //         text: 'Annulla',

      //         handler: () => {
      //           console.log('Annulla clicked');
      //         },
      //         cssClass: 'buttoncss',
      //       },
      //       {
      //         text: 'Login',
      //         handler: () => {
      //           console.log('Vai al Login');
      //           this.navCtrl.push(LoginPage)
      //         },

      //       }
      //     ]
      //   });
      //   msgNoLogged.present();

      // } // end else
    });

  } // end  ngAfterViewInit

  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER (get in p-b-c): ', this.currentUser)
      let currentUserId = this.currentUser.id;

      /**
       * CHECK IF THE CURRENT USER IS ACTIVE
       */
      this.eurofoodUsers.loadLoggedCustomerDetails(this.currentUser.id).subscribe(user => {
        console.log('Oggetto user JUST NOW ', user)

        this.isActive_currentUser = user[0]['active']
        console.log('CURRENT USER IS ACtive: ', this.isActive_currentUser)

      })

    });
  }

  goToDetails(id: number) {
    this.navCtrl.push(ProductDetailsPage, { id });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

  // returnToProductsByCategory(id: number, name: string) {
  //   this.navCtrl.push(ProductsByCategoryPage, { id, name });
  //   console.log('- - Clic su returnToProductsByCategory ', id)
  //   console.log('- - Clic su returnToProductsByCategory ', name)
  // }

  // returnandViewAllInPBC(id: number, viewAll: boolean, categoryName: string) {
  //   this.navCtrl.push(ProductsByCategoryPage, { id: this.categoryId, viewAll: true, categoryName: this.categoryName});
  //   console.log('returnToProductsByCategoryViewAll (p-b-c.ts) ' + id + " - " + viewAll + " - " + categoryName)
  // }


}
