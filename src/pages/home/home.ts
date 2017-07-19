import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, AlertController } from 'ionic-angular';

import { Product } from '../../models/product';
import { Category } from '../../models/category';

import { PrestashopProducts } from '../../providers/prestashop-products';
import { EurofoodCategories } from '../../providers/eurofood-categories';


import { WishlistService } from '../../providers/wishlist-service';

import { ProductDetailsPage } from '../product-details/product-details';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { SearchPage } from '../search/search';
import { CategoriesPage } from '../categories/categories';
import { WishlistPage } from '../wishlist/wishlist';
import { LoginPage } from '../login/login';

import { RegisterPage } from '../register/register';
import { SignupPage } from '../signup/signup';

import { EurofoodUsers } from '../../providers/eurofood-users';

import { Localstorage } from '../../providers/localstorage';

import { User } from '../../models/user';
import { Http } from '@angular/http';
import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

import { MyCart } from '../../models/mycart';
import { ProductInCart } from '../../models/productInCart';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: User;

  featuredproducts: Product[]

  appfeaturedproduct: Product[]
  id_productInArrayProductsAppFeatured: number;
  id_default_imageOfAppFeatProduct: number;
  id_NO_default_imageOfAppFeatProduct: number;

  offerproducts: Product[]

  bannerproduct: Product[]

  categories: Category[]

  categoriesInCarousel: Category[]


  offerCategoryID: number
  offerCategoryName: string

  featuredCategoryID: number
  featuredCategoryName: string

  inEvidenzaCatId: number
  inEvidenzaCatName: string

  categoriesInCarouselId: number
  categoriesInCarouselName: string

  id_of_banner_product: number

  products: ProductInCart[]

  productsLoadedByCatAss: Product[] = []

  GET_PRODUCT_BY_ID_CATEGORY_DEFAULT: boolean
  product_id: number

  isDataAvailable: boolean
  loadsLocalBanner: boolean

  has_IMAGE: any

  // THERE_IS_default_imageOfAppFeatProduct: boolean

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private psProducts: PrestashopProducts,
    private eurofoodCategories: EurofoodCategories,
    public wishlistService: WishlistService,
    private eurofoodUsers: EurofoodUsers,
    private localstorage: Localstorage,
    public http: Http,
    private alertCtrl: AlertController,
    private psApi: PrestaShopApi
  ) {

    this.products = MyCart.getInstance().products
    console.log('This products', this.products)



    // this.THERE_IS_default_imageOfAppFeatProduct = true
    // wishlistService.products.length = 0;
    // Create the Loading popup

    // this.globalApiSettings = globalVars;
    // console.log('This URL ', this.globalApiSettings)

    // console.log('! Host Name: ', this.psShopHostName)
    // this.psShopHostName = globalVars['psShopHostName']

    // this.psWsKey = globalVars['psWsKey']
    // console.log('! Ps Ws Key: ', this.psWsKey)
  } // end constructor

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI home.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.products) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }



  // ngAfterViewInit() {
  ngOnInit() {

    // let loadingPopupCarousel = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    // // Show the popup
    // loadingPopupCarousel.present();

    // this.eurofoodCategories.loadCategoriesInHomeCarousel().subscribe(categoriesInCarousel => {
    this.eurofoodCategories.loadCategories().subscribe(categoriesInCarousel => {
      this.categoriesInCarousel = categoriesInCarousel;
      console.log('--->Categorie In CAROUSEL ', categoriesInCarousel)

      // loadingPopupCarousel.dismiss();

      for (let category of this.categoriesInCarousel) {
        this.categoriesInCarouselName = category.name
        this.categoriesInCarouselId = category.id
        // console.log('--->ID CAT. In CAROUSEL: ' + this.categoriesInCarouselId)
        // console.log('--->NOME CAT. In CAROUSEL: ' + this.categoriesInCarouselName)

        /**
         * image url that want to check
         * 'http://www.nebula-projects.com/prestashop/api/images/categories/' + this.categoriesInCarouselId + '?ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN'
         */
        var imageFile = this.psApi.psShopHostName + '/images/categories/' + this.categoriesInCarouselId + '?ws_key=' + this.psApi.psWsKey
        // Here pass image url like imageFile in function to check image exist or not.

        checkImageExists(imageFile, function (existsImage) {
          if (existsImage == true) {
            category.hasImage = true
          }
          else {
            category.hasImage = false
          }
        });

      } // end for

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
      }

    }); // end loadCategories()



    // this.psProducts.loadHomeBanner().subscribe(bannerProduct => {
    //   this.bannerproduct = bannerProduct

    //   console.log('---->BANNER PRODUCT (home.ts) ', this.bannerproduct)
    // });

    /**
     *  APP-FEATURED CATEGORY
     *  NOTA: se correttamente configurate le installazioni prestashop loadFeaturedCategory restituirà sempre 
     *  la categoria APP-FEATURED ma se ha questa non è assegnata nessun prodotto questa non avrà l'object associations
     */
    this.eurofoodCategories.loadFeaturedCategory().subscribe(categoryFeatured => {
      // this.categories = categoryFeatured
      console.log('-> -> -> Categoria App-Featured ', categoryFeatured)
      this.featuredCategoryID = categoryFeatured['id']
      this.featuredCategoryName = categoryFeatured['name']
      console.log('--> App-Featured Category ID: ', this.featuredCategoryID)

      /**
       *  Start: ricava l'ID deL prodotto dall'Array "products" 
       *  contenuto nell' object "associations" dell'object "categoryFeatured"
       */
      let assObjectOfAppFeatured = categoryFeatured['associations']
      console.log('--> Ass Obj cat. APP-FEATURED ', assObjectOfAppFeatured)

      if (assObjectOfAppFeatured) {

        let productsInAssObjectOfAppFeatured = categoryFeatured['associations']['products']
        console.log('--> Array Prodotti in Ass Obj (cat. APP-FEATURED) ', productsInAssObjectOfAppFeatured)

        this.id_productInArrayProductsAppFeatured = categoryFeatured['associations']['products'][0]['id']
        console.log('--> ID Prodotto in Array Products of Ass Obj (cat. APP-FEATURED) ', this.id_productInArrayProductsAppFeatured)

      } else {

        /**
         * se non esiste l'oggetto ASSOCIATIONS 
         * (questo implica che nessun prodotto è stato associato alla categoria APP-FEATURED) 
         * setto a true loadsLocalBanner 
         * in home.html viene caricato il banner da locale se loadsLocalBanner è pari a true
         */
        // this.isDataAvailable = true;
        this.loadsLocalBanner = true;
        console.log('App-Featured Ass Obj is undefined: Carica local banner ', this.loadsLocalBanner)

      }
      /**
       *  Ricava il prodotto corrispondente all'ID (sopra ottenuto) e da questo gli ID delle IMMAGINI
       *  NOTA: APP-FEATURED GESTISCE SOLO UN PRODOTTO loadAppFeaturedProduct
       */
      this.psProducts.loadAppFeaturedProduct(this.id_productInArrayProductsAppFeatured).subscribe(appFeaturedProduct => {
        console.log('--> Prodotto App-Featured: ', appFeaturedProduct)
        if (appFeaturedProduct) {

          this.appfeaturedproduct = appFeaturedProduct

          let id_default_imageOfAppFeatProduct = appFeaturedProduct['id_default_image']
          console.log('----> ID default image App-Featured Product ', id_default_imageOfAppFeatProduct)

          let assObjOfAppFeatProduct = appFeaturedProduct['associations']
          console.log('-> -> -> -> Object Ass in app featured product: ', assObjOfAppFeatProduct)

          let arrayImagesInAppFeatProduct = assObjOfAppFeatProduct['images']
          console.log('-> -> -> -> -> Array Images in Object Ass ', arrayImagesInAppFeatProduct)

          let lenght_arrayImagesInAppFeatProduct = arrayImagesInAppFeatProduct.length
          console.log('-> -> -> -> -> lenght Array Images in Object Ass ', lenght_arrayImagesInAppFeatProduct)

          // let id_NO_COVERimageOfAppFeatProduct = arrayImagesInAppFeatProduct[1]['id']
          // console.log('-> -> -> -> -> -> ID NO COVER IMAGE: ', id_NO_COVERimageOfAppFeatProduct)

          for (var j: number = 0; j < lenght_arrayImagesInAppFeatProduct; j++) {

            let id_imagesOfAppFeatProduct = arrayImagesInAppFeatProduct[j]['id']
            console.log('-> -> -> -> -> -> Id IMGS of APP FEAT PRODUCT: ', id_imagesOfAppFeatProduct)
            if (id_default_imageOfAppFeatProduct != arrayImagesInAppFeatProduct[j]['id']) {

              this.id_NO_default_imageOfAppFeatProduct = arrayImagesInAppFeatProduct[j]['id']
              console.log('-> -> -> -> -> -> ID NO COVER IMAGE: ', this.id_NO_default_imageOfAppFeatProduct)

            }
          }
        } //if (appFeaturedProduct)

      });

      // let lengthOf_productsInAssObjectOfAppFeatured = productsInAssObjectOfAppFeatured.length
      // console.log('--> Lenght Prod in Ass Obj ', lengthOf_productsInAssObjectOfAppFeatured)

      // SUBSCRIBE APP-FEATURED PRODUCTS
      // this.psProducts.loadFeaturedCategoryProducts(this.featuredCategoryID).subscribe(products => {

      // setTimeout(() => {

      // this.featuredproducts = products;

      // loadingPopup.dismiss();
      // }, 1000);

      // console.log('Prodotti App-Featured', products)
      // }); // end loadFeaturedCategoryProducts

    }); // end loadFeaturedCategory


    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    // // Show the popup
    // loadingPopup.present();

    /** CATEGORIA IN EVIDENZA ***
     * Carica la categori In Evidenza con Hard-coded filter[name]=[In Evidenza]
     * Dall'oggetto ricevuto in risposta ricavo l'id che ha la categoria offerte
     */
    this.eurofoodCategories.loadInEvidenzaCategory().subscribe(categoryInEvidenza => {
      // this.categories = categoryInEvidenza
      console.log('-+++> Categoria In Evidenza ', this.categories)
      this.inEvidenzaCatId = categoryInEvidenza['id']
      console.log('-++++> ID Categoria In Evidenza ', this.inEvidenzaCatId)
      this.inEvidenzaCatName = categoryInEvidenza['name']
      console.log('-++++> NAME Categoria In Evidenza: ', this.inEvidenzaCatName)
    });


    /**
     * Carica la categoria Offerte filtrando le categorie con Hard-coded filter[name]=[Offerte]
     * Dall'oggetto ricevuto in risposta ricavo l'id che ha la categoria offerte
     * Questo permette di cambiare installazione e basarsi sul nome 'Offerte' della categoria 
     * e non sull' id che può variare da installazione a installazione
     */
    this.eurofoodCategories.loadOfferCategory().subscribe(categoryOffer => {
      this.categories = categoryOffer

      console.log('-> Categoria Offerte ', categoryOffer)

      this.offerCategoryID = this.categories['id']
      this.offerCategoryName = this.categories['name']

      console.log('--> Offer Category ID: ', this.offerCategoryID)

      // /**
      //  *  Start: ricava gli id dei prodotti dall'Array "products" 
      //  *  contenuto nell' object "associations" dell'object "categoryOffer"
      //  */
      // let associationsObject = categoryOffer['associations']
      // console.log('--> Ass Obj ', associationsObject)

      // let productsInassociationsObject = categoryOffer['associations']['products']
      // console.log('--> Prodotti in Ass Obj ', productsInassociationsObject)

      // let lengthOf_productsInassociationsObject = productsInassociationsObject.length
      // console.log('--> Lenght Prod in Ass Obj ', lengthOf_productsInassociationsObject)

      // for (let k = 0; k < lengthOf_productsInassociationsObject; ++k) {
      //   console.log(k);

      //   this.product_id = productsInassociationsObject[k]['id']
      //   console.log('---> Prod ID in association object: ', this.product_id)
      // }

      /**
       * se GET_PRODUCT_BY_ID_CATEGORY_DEFAULT e settato a TRUE i prodotti sono ricavati filtrando 
       * la chiamata prodotti per id_category_default  
       * se GET_PRODUCT_BY_ID_CATEGORY_DEFAULT e settato a FALSE ricava gli id dei prodotti
       * dall'Array "products"  contenuto nell' object "associations" dell'object "categoryOffer"
       */
      this.GET_PRODUCT_BY_ID_CATEGORY_DEFAULT = false

      if (this.GET_PRODUCT_BY_ID_CATEGORY_DEFAULT) {

        /**
         * Chiamata di prodotti filtrati per l'id_category_default della categoria Offerte
         */
        this.psProducts.loadOfferCategoryProducts(this.offerCategoryID).subscribe(products => {
          this.offerproducts = products;

          // setTimeout(() => {
          // this.featuredproducts = products;

          console.log('Offer Category Products', products)

          let length = this.offerproducts.length
          console.log('length array offer products ', length)

          for (var i: number = 0; i < length; i++) {
            let offerProduct_Id = products[i]['id']
            console.log('Offer Category Products ID', offerProduct_Id)

            this.psProducts.loadProductSpecificPrice(offerProduct_Id).subscribe(specificprice => {
              if (specificprice) {

                console.log('Specific Price Array ', specificprice)

                let reduction = specificprice['reduction']

                // console.log('Product Id ' + offerProduct_Id + ' Scon ' + reduction)

                for (let product of this.offerproducts) {
                  if (product.id == offerProduct_Id) {
                    product.reduction = reduction
                    console.log('Sconto percentuale ', product.reduction)
                    product.discountedPrice = product.price - (product.price * product.reduction)
                    console.log('Prezzo scontato ', product.discountedPrice)
                  }
                } // end for

              } // end if specificprice
            }); // end loadProductSpecificPrice
          } // end for

          // loadingPopup.dismiss();
          // }, 1000);

        }); // end loadOfferCategoryProducts

      } // end GET_PRODUCT_BY_ID_CATEGORY_DEFAULT
      // start GET PRODUCT BY ID RETRIEVED FROM CATEGORIES > ASSOCIATIONS > PRODUCTS
      else {

        /**
         *  Start: ricava gli id dei prodotti dall'Array "products" 
         *  contenuto nell' object "associations" dell'object "categoryOffer"
         */
        let associationsObject = categoryOffer['associations']
        console.log('--> Ass Obj ', associationsObject)

        let productsInassociationsObject = categoryOffer['associations']['products']
        console.log('--> Prodotti in Ass Obj ', productsInassociationsObject)

        let lengthOf_productsInassociationsObject = productsInassociationsObject.length
        console.log('--> Lenght Prod in Ass Obj ', lengthOf_productsInassociationsObject)

        for (let k = 0; k < lengthOf_productsInassociationsObject; ++k) {
          console.log(k);

          this.product_id = productsInassociationsObject[k]['id']
          console.log('---> Prod ID in association object: ', this.product_id)

          /**
           *  EFFETTUA UNA RICHIESTA (CICLICA) DI PRODOTTI FILTRATA X L'ID DEL PRODOTTO 
           *  OTTENUTO DALL OGGETTO PRODUCTS NESTED IN ASSOCIATIONS (A SUA VOLTA IN CATEGORIES)
           */
          this.psProducts.loadProductInCatAssObj(this.product_id).subscribe(products => {

            console.log('Prodotto in offerte associations > products (home.ts) ', products)
            console.log('ID Prodotto filtrato x gli id ottenuti da offerte associations > products (home.ts) ', products[0]['id'])

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
            this.psProducts.loadProductSpecificPrice(products[0]['id']).subscribe(specificprice => {
              // this.psProducts.loadProductSpecificPrice(2020).subscribe(specificprice => {

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
              }

              // this.isDataAvailable = true
              // console.log("this.isDataAvailable ", this.isDataAvailable)

            }); // end loadProductInCatAssSpecificPrice

            /**
             * productsLoadedByCatAss è un ARRAY VUOTO (vedi sopra nella classe)
             * a cui ad ogni ciclo aggiungo l'oggetto products restituito dalla richiesta
             */
            this.productsLoadedByCatAss.push(products[0])

          }); // end loadProductInCatAssObj

        } // end for da cui ricavo gli id dall' array products contenuto nell'object associations

      }

    }); // end loadOfferCategory

    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {
      // if (hasLoggedIn) {

      this.getCurrentUser();

      // } else {

      //   let msgNoLogged = this.alertCtrl.create({

      //     title: 'Benvenuto!',
      //     message: "Effettua l'accesso per visualizzare tutti i nostri prezzi.",
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

  } // ngAfterViewInit

  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER: ', this.currentUser)
    });
  }

  // SignupPage
  createAccount() {
    this.navCtrl.push(SignupPage);
  }

  /* Vecchia Pagina di registrazione */
  // createAccount() {
  //   this.navCtrl.push(RegisterPage);
  // }
  // goToCategorySelectedInCarousel(id: number, categoryNameSelectedInCarousel: string) {
  goToCategorySelectedInCarousel(id: number, name: string) {

    this.eurofoodCategories.loadSubCategories(id).subscribe(subcategories => {

      if ((subcategories != null)) {

        console.log('--- *** Sottocategorie (categories.ts) ', subcategories)
        this.navCtrl.push(CategoriesPage, { id: id, categoryName: name, categories: subcategories });
        console.log('Esiste subcategory e passo ' + id + ' nome cat ' + name)
        console.log('Esiste subcategory e passo  Oggetto subcategories ' + subcategories)

      } else {

        this.navCtrl.push(ProductsByCategoryPage, { id: id, categoryName: name });
      }
    });

    // this.navCtrl.push(ProductsByCategoryPage, { id, categoryName: name });
    // console.log('-->Selected category ID in Carousel goToCategory', id)
    // console.log('-->Selected category NAME in Carousel goToCategory', name)

    // console.log('-->Selected category ID in Carousel goToCategory', this.categoriesInCarouselId)
    // console.log('-->Selected category NAME in Carousel goToCategory', this.categoriesInCarouselName)
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }
  goToDetails(id: number) {
    this.navCtrl.push(ProductDetailsPage, { id });
  }

  goToDetailsOfBannerProduct(id: number) {
    // this.navCtrl.push(ProductDetailsPage, { id: this.id_productInArrayProductsAppFeatured, id_no_default_img: this.id_NO_default_imageOfAppFeatProduct });
    this.navCtrl.push(ProductDetailsPage, { id: this.id_productInArrayProductsAppFeatured });
  }

  goToCategoryPage(categoryName: string) {
    this.navCtrl.push(CategoriesPage, { categoryName: "Tutte le categorie" });
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  goToProductsInEvidenza(id: number, categoryName: string) {
    this.navCtrl.push(ProductsByCategoryPage, { id: this.inEvidenzaCatId, categoryName: this.inEvidenzaCatName });
    console.log(" ===>goToProductsInEvidenza " , id)
  }

  /** DA VALUTARE SE VIENE UTILIZZATA */
  goToProductsOfFeaturedCategory(id: number, categoryName: string) {
    // this.navCtrl.push(ProductsByCategoryPage, { id: "50" });
    this.navCtrl.push(ProductsByCategoryPage, { id: this.featuredCategoryID, categoryName: this.featuredCategoryName });
    console.log('--> App-Featured Category ID in goToProductsOfFeaturedCategory: ', this.featuredCategoryID);
    console.log('--> App-Featured Category Name in goToProductsOfFeaturedCategory: ', this.featuredCategoryName);
  }

  goToProductsOfOfferCategory(id: number, categoryName: string) {
    this.navCtrl.push(ProductsByCategoryPage, { idOffer: this.offerCategoryID, categoryName: this.offerCategoryName });
    console.log('--> Offer Category ID in goToProductsOfOfferCategory: ', this.offerCategoryID);
    console.log('--> Offer Category Name in goToProductsOfOfferCategory: ', this.featuredCategoryName);
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');
  }


}
