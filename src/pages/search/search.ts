import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { LoadingController } from 'ionic-angular';

import { ProductDetailsPage } from '../product-details/product-details';
import { WishlistPage } from '../wishlist/wishlist';

import { Product } from '../../models/product';
import { PrestashopProducts } from '../../providers/prestashop-products';
import { WishlistService } from '../../providers/wishlist-service';
import { Localstorage } from '../../providers/localstorage';
import { User } from '../../models/user';

import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';


import { ProductInCart } from '../../models/productInCart';
import { MyCart } from '../../models/mycart';

import { EurofoodUsers } from '../../providers/eurofood-users';

import { Subscription } from 'rxjs/Rx';
import { EurofoodCategories } from '../../providers/eurofood-categories';
import { Category } from '../../models/category';
/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  products: Product[]
  originalProducts: Product[];
  currentUser: User;

  productsInCart: ProductInCart[];

  isActive_currentUser: any;

  subscription: Subscription;

  currentTerm: string;

  product_price_for_unit: number;

  categories: Category[];
  offerCategoryID: number;
  offerCategoryName: string;
  // resuluOfSearch: boolean = false

  @ViewChild('focusInput') myInput;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private psProducts: PrestashopProducts,
    public wishlistService: WishlistService,
    private localstorage: Localstorage,
    private psApi: PrestaShopApi,
    public eurofoodUsers: EurofoodUsers,
    private eurofoodCategories: EurofoodCategories
  ) {

    this.productsInCart = MyCart.getInstance().products
    console.log('This products in search.ts', this.productsInCart)

    // Create the Loading popup
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();

    psProducts.loadOriginalProducts().subscribe(products => {
      this.products = products;
      this.originalProducts = products;

      // this.originalProducts = [];

      loadingPopup.dismiss();

      console.log(products)

      // /**
      //  * Check se l'immagine esiste
      //  */
      // for (let product of this.originalProducts) {
      //   // var imageFile = "http://www.nebula-projects.com/prestashop/api/images/products/"+product.id+"/"+product.id_default_image+"/home_default?ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN"
      //   var imageFile = this.psApi.psShopHostName + "/images/products/" + product.id + "/" + product.id_default_image + "/home_default?ws_key=" + this.psApi.psWsKey

      //   checkImageExists(imageFile, function (existsImage) {
      //     if (existsImage == true) {
      //       product.hasImage = true
      //       console.log('Product HAS IMAGE ', product.hasImage)
      //     }
      //     else {
      //       product.hasImage = false
      //       console.log('Product HAS IMAGE ', product.hasImage)
      //     }

      //   }); // end checkImageExists
      // } // end FOR 

      // // Use the below code to check if image exist using image url.
      // function checkImageExists(imageUrl, callBack) {
      //   var imageData = new Image();
      //   imageData.onload = function () {
      //     callBack(true);
      //   };
      //   imageData.onerror = function () {
      //     callBack(false);
      //   };
      //   imageData.src = imageUrl;
      // } // end checkImageExists

      /**
       * DA IMPLEMENTARE X VISUALIZZARE I PREZZI SCONTATI NELLE RICERCHE
       */
      // carica categoria offerte da cui prendo l'id (e il nome per test)
      // this.eurofoodCategories.loadOfferCategory().subscribe(categoryOffer => {
      //   this.categories = categoryOffer

      //   console.log('-> Categoria Offerte ', categoryOffer)

      //   this.offerCategoryID = this.categories['id']
      //   this.offerCategoryName = this.categories['name']

      //   console.log('--> Offer Category ID: ', this.offerCategoryID)
      //   for (let j = 0; j < products.length; j++) {
      //     let categories = this.products[j]['associations']['categories']
      //     console.log('ARRAY CATEGORIE ', categories)
      //   }
      // });
      // let id_product = this.products[i]['id']
      // console.log('Id Prodotto se Categoria = Offerte', id_product)
      // this.psProducts.loadProductSpecificPrice(id_product).subscribe(specificprice => {
      //   if (specificprice) {

      //     console.log('Specific Price Array ', specificprice)

      //     let reduction = specificprice['reduction']

      //     for (let product of this.products) {
      //       if (product.id == id_product) {
      //         product.reduction = reduction
      //         console.log('Sconto percentuale ', product.reduction)
      //         product.discountedPrice = product.price - (product.price * product.reduction)
      //         console.log('Prezzo scontato ', product.discountedPrice)

      //       }
      //     }

      //   } // end if specificprice
      // });

    }) // load Original Products

  } // end constructor

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI search.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.productsInCart) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  ngAfterViewInit() {
    // CHECK USER IS LOGGED
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {

      this.getCurrentUser();

    });

  } // end ngAfterViewInit

  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER (get in search.ts): ', this.currentUser)

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

  ionViewDidEnter() {
    setTimeout(() => {
      Keyboard.show() // for android
      this.myInput.setFocus();
    }, 150); //a least 150ms.
  }

  goToDetails(id: number) {
    this.navCtrl.push(ProductDetailsPage, { id });
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

  search(searchEvent) {

    let term = searchEvent.target.value

    // We will only perform the search if we have 3 or more characters
    if (term.trim() === '' || term.trim().length < 3) {
      // Load cached products
      this.products = this.originalProducts;

    } else {
      console.log('Sto cercando ', term)
      // this.resuluOfSearch = true
      /**
       * memorizzo la subscription nelle proprietà (vedi sopra)
       * se la subscription esiste vuol dire che sono stati gia digitati 3 caratteri ed è partita la ricerca 
       * quindi al nuovo digit viene 'unsuscribe' la precedente ed eseguita la nuova
       */
      if (this.subscription) {
        this.subscription.unsubscribe()
        console.log('Annullata richiesta x il term ', this.currentTerm)
      }

      // Get the searched products
      // this.currentTerm = term
      // let loadingPopup = this.loadingCtrl.create({
      //   content: 'Loading data...'
      // });
      // // Show the popup
      // loadingPopup.present();
      // setTimeout(() => {
      this.subscription = this.psProducts.searchProducts(term).subscribe(products => {
        this.products = products
        console.log('Prodotti cercati x term ', term)
        console.log('Prodotti cercati ', products)

        let products_lenght = products.length
        console.log('Products Lenght ', products_lenght)

        /**
         * Check se l'immagine esiste
         */
        // for (let product of products) {

        //   var imageFile = this.psApi.psShopHostName + "/images/products/" + product.id + "/" + product.id_default_image + "/home_default?ws_key=" + this.psApi.psWsKey

        //   checkImageExists(imageFile, function (existsImage) {
        //     if (existsImage == true) {
        //       product.hasImage = true
        //       console.log('Product HAS IMAGE ', product.hasImage)
        //     }
        //     else {
        //       product.hasImage = false
        //       console.log('Product HAS IMAGE ', product.hasImage)
        //     }

        //   }); // end checkImageExists
        // } // end FOR 

        // // Use the below code to check if image exist using image url.
        // function checkImageExists(imageUrl, callBack) {
        //   var imageData = new Image();
        //   imageData.onload = function () {
        //     callBack(true);
        //   };
        //   imageData.onerror = function () {
        //     callBack(false);
        //   };
        //   imageData.src = imageUrl;
        // } // end checkImageExists


      }); // end subscribe product

      //   loadingPopup.dismiss();
      // }, 1000); // end  setTimeout
    } // end else
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }



}
