import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { Product } from '../../models/product';
import { ProductInCart } from '../../models/productInCart';

import { MyCart } from '../../models/mycart';

import { PrestashopProducts } from '../../providers/prestashop-products';

import { WishlistPage } from '../wishlist/wishlist';
import { WishlistService } from '../../providers/wishlist-service';

import { LoginPage } from '../login/login';
import { SearchPage } from '../search/search';

import { Localstorage } from '../../providers/localstorage';

import { User } from '../../models/user';
import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

import { EurofoodUsers } from '../../providers/eurofood-users';

import { ProductImgModalPage } from '../product-img-modal/product-img-modal';


// import { Storage } from '@ionic/storage';

/*
  Generated class for the ProductDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html'
})
export class ProductDetailsPage {
  product: Product;
  stock: Product;

  id: number;
  qty: any;

  reference: string;

  currentUser: User;

  products: ProductInCart[]

  buttonDisabled: boolean;

  id_NO_default_imageOfAppFeatProduct: number;

  // id_of_banner_product: number

  maxOrderQuantity: false;
  isActive_currentUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private psProducts: PrestashopProducts,
    public wishlistService: WishlistService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private localstorage: Localstorage,
    private psApi: PrestaShopApi,
    public eurofoodUsers: EurofoodUsers,
    public modalCtrl: ModalController
    // public storage: Storage
  ) {
    this.products = MyCart.getInstance().products
    console.log('This products in product-details.ts', this.products)

    // var sumOfQty = 0
    // for (let p of this.products) {
    //   sumOfQty += p.qty
    //   console.log('+++-> SOMMA DELLE QUANTITA (products-details): ', sumOfQty)

    // }


    this.id = navParams.get('id');

    /**
     * Se in Home.ts viene cliccato il prodotto Banner viene passato a questa pagina l'id della sua seconda immagine 
     * la cui key è 'id_no_default_img' e che assegno a this.id_NO_default_imageOfAppFeatProduct 
     * ('id_no_default_img' è l'immagine non di copertina, o meglio non quella con id pari ad id_default_img)
     * In product-detail.html se esiste 'id_NO_default_imageOfAppFeatProduct' ad img src viene passato il suo valore piuttosto che
     * quello di 'id_default_img'
     * Per gestire il caricamento nel carrello dell'immagine NO di Copertina nel caso ci sia in elenco il prodotto APP-Featured 
     * assegno, dopo averla definita nel models ProductInCart.ts, alla proprietà id_NO_default_imageOfAppFeatProduct (dell'oggetto ProductInCart) il valore di
     * this.id_NO_default_imageOfAppFeatProduct. In wishlist.html per discriminare l'immagine di copertina con la seconda immagine (nel caso del prodotto App-featured)
     * valuto la condizione product.id_NO_default_imageOfAppFeatProduct vs !product.id_NO_default_imageOfAppFeatProduct
     */


    // this.id_NO_default_imageOfAppFeatProduct = navParams.get('id_no_default_img');
    // console.log('ID NO DAFAULT IMG (get in product-details.ts) ', this.id_NO_default_imageOfAppFeatProduct)

    this.qty = 1;

    // 04.05 commento
    // // Create the Loading popup
    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    // // Show the popup
    // loadingPopup.present();

    // // Richiama metodo modificato nel provider eurofood-products.ts per evitare ngFor in product-details.html
    // // eurofoodProducts.loadDetails(this.id).subscribe(products => {
    // //   this.product = products[0];
    // //   console.log(products[0])
    // // })

    // psProducts.loadProductDetails(this.id).subscribe(product => {

    //   this.product = product;

    //   loadingPopup.dismiss();

    //   console.log('Prodotto', product)

    //   let id_product = product['id'];
    //   console.log('ID PRODOTTO: ', id_product)

    //   let product_price = product['price']
    //   console.log('Prezzo ', product_price)

    //   let product_unit_price_ratio = product['unit_price_ratio']
    //   console.log('Unit Price Ratio ', product_unit_price_ratio)

    //   let product_price_for_unit = (product_price / product_unit_price_ratio)
    //   console.log('Prezzo per unità ', product_price_for_unit)

    //   product.price_for_unit = product_price_for_unit
    //   console.log('--> product.price_for_unit ', product.price_for_unit)


    //   // let productDescription = product['description'];
    //   // console.log('DESCRIZIONE PRODOTTO: ', productDescription)
    //   // var regex = /(<([^>]+)>)/ig
    //   // let productDescriptionRep = productDescription.replace(regex, "")
    //   // console.log('DESCRIZIONE PRODOTTO Replace: ', productDescriptionRep)
    //   // product.description_stripped_tags = productDescriptionRep

    //   psProducts.loadProductStockAvailable(id_product).subscribe(stock => {

    //     this.stock = stock;
    //     console.log('Stock Available', stock)
    //     this.product.stock_available = stock['quantity']
    //     console.log('Quantita disponibile ', this.product.stock_available)

    //   });

    //   psProducts.loadProductSpecificPrice(id_product).subscribe(specificprice => {

    //     console.log('Specific Price Array ', specificprice)

    //     product.reduction = specificprice['reduction']
    //     console.log('Sconto (retrieve in product-detail.ts) ', product.reduction)

    //     product.discountedPrice = product.price - (product.price * product.reduction)
    //     console.log('Prezzo scontato ', product.discountedPrice)

    //     product.discountAmount = product.price * product.reduction
    //     console.log('Importo sottratto al prezzo ', product.discountAmount)
    //   });



    //   let id_tax_rule_groups = product['id_tax_rules_group'];
    //   console.log('id Tax Rule Groups: ', id_tax_rule_groups)

    //   psProducts.loadProductIdTaxRulesGroup(id_tax_rule_groups).subscribe(taxrule => {

    //     if (taxrule) {
    //       this.product.tax_rule_name = taxrule['name']
    //       console.log('Tassa Applicata: ', this.product.tax_rule_name)
    //       let tax_rule_groups_name_split = this.product.tax_rule_name.split(/[()]+/)
    //       console.log('Tassa Applicata SPLIT', tax_rule_groups_name_split)
    //       let percentTax_rule = tax_rule_groups_name_split[1]
    //       console.log('Percentuale tassa Applicata', percentTax_rule)
    //     }
    //   });

    // })
    // end 0405 commento

    // this.storage.get('myStore').then((data) => {
    //   console.log('my data ', data)
    // });


    // Assegna a product il Prodotto test
    // this.product = eurofoodProducts.loadDetailsMock(this.id)
    // console.log(this.product)

  } // end constructor

  ngAfterViewInit() {
    // CHECK USER IS LOGGED
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {

      this.getCurrentUser();

    });

    // 04.05
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();

    // Richiama metodo modificato nel provider eurofood-products.ts per evitare ngFor in product-details.html
    // eurofoodProducts.loadDetails(this.id).subscribe(products => {
    //   this.product = products[0];
    //   console.log(products[0])
    // })

    this.psProducts.loadProductDetails(this.id).subscribe(product => {

      this.product = product;

      loadingPopup.dismiss();

      console.log('--> Prodotto (da subscribe) ', product)

      let id_product = product['id'];
      console.log('ID PRODOTTO: ', id_product)

      let product_price = product['price']
      console.log('Prezzo ', product_price)

      let product_unit_price_ratio = product['unit_price_ratio']
      console.log('Unit Price Ratio ', product_unit_price_ratio)

      let product_price_for_unit = (product_price / product_unit_price_ratio)
      console.log('Prezzo per unità ', product_price_for_unit)

      product.price_for_unit = product_price_for_unit
      console.log('--> product.price_for_unit ', product.price_for_unit)


      // let productDescription = product['description'];
      // console.log('DESCRIZIONE PRODOTTO: ', productDescription)
      // var regex = /(<([^>]+)>)/ig
      // let productDescriptionRep = productDescription.replace(regex, "")
      // console.log('DESCRIZIONE PRODOTTO Replace: ', productDescriptionRep)
      // product.description_stripped_tags = productDescriptionRep

      this.psProducts.loadProductStockAvailable(id_product).subscribe(stock => {

        this.stock = stock;
        console.log('Stock Available', stock)
        this.product.stock_available = stock['quantity']
        console.log('Quantita disponibile ', this.product.stock_available)

        // IN ngAfterViewInit VIENE ESEGUITO IL CONTROLLO SULLO STOCK DISPONIBILE DEL PRODOTTO   
        if ((this.product.stock_available == 0) || (this.product.stock_available < 0)) {

          (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;
          (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = true;
          (<HTMLInputElement>document.getElementById("btnDecrementQty")).disabled = true;

          // dopo che nell' android-release.apk nonostante il prodotto fosse esaurito
          // il btn AGGIUNGI AL CARRELLO non risultava disabilitato ho aggiunto allo stesso anche questa condizione
          this.buttonDisabled = true

          console.log('this.product.stock_available ', this.product.stock_available)
        }

         if (this.product.stock_available == 1) {
          (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = true;

         }

      });

      this.psProducts.loadProductSpecificPrice(id_product).subscribe(specificprice => {

        console.log('Specific Price Array ', specificprice)

        product.reduction = specificprice['reduction']
        console.log('Sconto (retrieve in product-detail.ts) ', product.reduction)

        product.discountedPrice = product.price - (product.price * product.reduction)
        console.log('Prezzo scontato ', product.discountedPrice)

        product.discountAmount = product.price * product.reduction
        console.log('Importo sottratto al prezzo ', product.discountAmount)
      });



      let id_tax_rule_groups = product['id_tax_rules_group'];
      console.log('id Tax Rule Groups: ', id_tax_rule_groups)

      this.psProducts.loadProductIdTaxRulesGroup(id_tax_rule_groups).subscribe(taxrule => {

        if (taxrule) {
          this.product.tax_rule_name = taxrule['name']
          console.log('Tassa Applicata: ', this.product.tax_rule_name)
          let tax_rule_groups_name_split = this.product.tax_rule_name.split(/[()]+/)
          console.log('Tassa Applicata SPLIT', tax_rule_groups_name_split)
          let percentTax_rule = tax_rule_groups_name_split[1]
          console.log('Percentuale tassa Applicata', percentTax_rule)
        }
      });

    }) // end loadProductDetails(this.id)

    // 04.05


    /**
     * se l'utente NON è LOGGATO e non esiste una riduzione sul prezzo (quindi NON è la CATEGORIA OFFERTE)
     * visualizza msg: Accedi per visualizzare i prezzi delle nostre offerte
     */
    // if ((!this.currentUser) && (!this.product.reduction)) {

    //     let msgNoLogged = this.alertCtrl.create({

    //       title: 'Attenzione!',
    //       message: 'Accedi per visualizzare i prezzi delle nostre offerte',
    //       buttons: [
    //         {
    //           text: 'Annulla',

    //           handler: () => {
    //             console.log('Annulla clicked');
    //           },
    //           cssClass: 'buttoncss',
    //         },
    //         {
    //           text: 'Login',
    //           handler: () => {
    //             console.log('Vai al Login');
    //             this.navCtrl.push(LoginPage)
    //           },

    //         }
    //       ]
    //     });
    //     msgNoLogged.present();

    //   } // end if


    for (let p of this.products) {
      // console.log('*-----> Product in Cart DOPO addProduct (in products details)', p)
      console.log('*-----> QTY of Product in Cart in ngAfterViewInit ( products details)', p.qty)
      console.log('*-----> STOCK AVAILABLE of Product in ngAfterViewInit ( products details)', p.stock_available)

      /**
       * Nell'intezione di avere i BTNs incrementa ed aggiungi al carrello disabilitati nell'entrata in products-details
       * qualora il prodotto sia stato già aggiunto al carrello con la max qty disponibile ho usato
       * if (p.qty == p.stock_available)  Questa condizione però riguarda il prodotto nel carrello. 
       * Quando si verifica una volta per un prodotto presente nel carrello
       * anche quando si visualizza nel dettaglio un altro prodotto i BTNs incrementa ed aggiungi al carrello risultano disabilitati
       * QUINDI LA COMMENTO
       * ** TEST **
       * la cambio con un altro ragionamento
       * se l'id del prodotto che visualizzo nel dettaglio (uso this.id che è quello che mi viene passato dalla pagina product-by-category)
       * è uguale all'id del prodotto nel carrello
       * all'entrata nel dettaglio prodotto i BTNs risultano disabilitati
       */
      console.log('-[ this.id ', this.id)
      console.log('-[ p.id ', p.id)
      // if (p.qty == p.stock_available) {
      if (this.id == p.id) {

        (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;
        (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = true;

        let toast = this.toastCtrl.create({
          message: 'Prodotto presente nel carrello',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      }

      // if (p) {

      //   console.log("il PRODOTTO é nel CARRELLO (prouct-details)");
      //   (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;

      // } 

    } // end for

  } // end ngAfterViewInit

  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER (get in p-d): ', this.currentUser)

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

  // increment product qty
  incrementQty() {
    console.log('this.qty ', this.qty + 1);
    this.qty += 1;
    if (this.qty == this.product.stock_available) {

      (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = true;
      // (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;

      // let alert = this.alertCtrl.create({
      //   title: 'Attenzione!',
      //   subTitle: "Hai raggiunto la massima quantità ordinabile per questo prodotto. Disponibili in stock: <strong> " + this.product.stock_available + "</strong>",
      //   buttons: ['OK']
      // });
      // alert.present();

      console.log('questa qty ', this.qty)
    }
  }

  // decrement product qty
  decrementQty() {
    if (this.qty - 1 < 1) {
      this.qty = 1
      console.log('1->' + this.qty);
    } else {
      this.qty -= 1;
      console.log('2->' + this.qty);
      if (this.qty < this.product.stock_available) {

        (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = false;

      }
    }
  }

  // launchWishlist(id_no_default_img: number) {
  //   this.navCtrl.push(WishlistPage, {id_no_default_img: this.id_NO_default_imageOfAppFeatProduct});
  // }
  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

  addToWishlist() {

    // if (this.qty === this.product.stock_available) {

    //   (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;

    //   console.log('--->MAX QTY ORDINABILE ', true)
    //   let alert = this.alertCtrl.create({
    //     title: 'Attenzione!',
    //     subTitle: 'Quantità disponibile in stock: ' + this.product.stock_available,
    //     buttons: ['OK']
    //   });
    //   alert.present();

    //   console.log('questa qty ', this.qty)

    // } else {

    //   console.log('--->MAX QTY ORDINABILE ', false)

    // }

    // this.wishlistService.addProduct(product, this.qty);
    // this.wishlistService.setProduct(product);
    console.log('addToWishList (product-details)', this.product);
    console.log('QTY in product-details.ts', this.qty)

    this.product.stock_available

    // this.product.qty = this.qty
    // console.log('THIS ', this.product.qty)

    // MyCart.getInstance().addProduct(this.product)
    console.log('This product (in product-details.ts) ', this.product)

    let p = new ProductInCart()
    p.id = this.product.id
    p.name = this.product.name
    p.price = this.product.price
    p.discountedPrice = this.product.discountedPrice
    p.stock_available = this.product.stock_available
    p.id_default_image = this.product.id_default_image
    p.id_tax_rules_group = this.product.id_tax_rules_group
    p.reduction = this.product.reduction
    p.discountAmount = this.product.discountAmount

    // p.id_NO_default_imageOfAppFeatProduct = this.id_NO_default_imageOfAppFeatProduct

    p.qty = this.qty

    console.log('-----> Product in Cart (in products details)', p)

    // if (p.qty == p.stock_available) {
    //   console.log('**p.qty ', p.qty)
    //   console.log('**p.stock_available ', p.stock_available)
    //   console.log('*--->MAX QTY ORDINABILE ', true)
    // } else {
    //   console.log('**p.qty ', p.qty)
    //   console.log('**p.stock_available ', p.stock_available)
    //   console.log('*--->MAX QTY ORDINABILE ', false)

    // }

    /**
     * AGGIUNGE AL CARRELO
     */
    MyCart.getInstance().addProduct(p)
    let toast = this.toastCtrl.create({
      message: 'Prodotto aggiunto nel tuo carrello',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();


    for (let p of this.products) {
      console.log('*-----> Product in Cart DOPO addProduct (in products details)', p)
      console.log('*-----> QTY of Product in Cart DOPO addProduct (in products details)', p.qty)
      console.log('*-----> STOCK AVAILABLE of Product in Cart DOPO addProduct (in products details)', p.stock_available)

      /**
       * SE IL BTN AGGIUNGI AL CARRELLO VIENE DISABILITATO PER UN PRODOTTO PER CUI SI è VERIFICATA QUESTA CONDIZIONE 
       * LO TROVO POI DISABILITATO ANCHE PER QUALSIASI ALTRO 
       * SIMILE PROBLEMA PER L'ALERT CHE VIENE VISUALIZZATO OGNI VOLTA CHE SI CLICCA AGGIUNGI ALA CARRELLO
       * *** TEST ***
       * 09.05 cambio if (p.qty == p.stock_available) con this.qty == this.product.stock_available
       * * p.qty è la quantità che è nell'oggetto 'Prodotto nel Carrello'
       * * this.qty è la quantità che viene aumentata/decrementata tramite increment/decrement qty in quets pagina 
       */
      // if (p.qty == p.stock_available) {

      /** all'azione AGGIUNGI AL CARRELLO CASO 1: RAGGIUNTA MAX DISPONIBILTA' DAL BTN INCREMENTA QUANTITA'
       * Se incrementando la QTY dal btn incrementQty [+] (this.qty) viene raggiunta la MAX DISPONIBILITA'
       * all'azione AGGIUNGI AL CARRELLO viene valutata la condizione quantità incrementata da [+] == a stock disponibile
       * e se vera il btn AGGIUNGI AL CARRELLO dopo l'aggiunta del prodotto viene disabilitato
       */
      if (this.qty == this.product.stock_available) {
        console.log('->this.qty: ' + this.qty + ' ->p.qty: ' + p.qty);
        (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;
        // let alert = this.alertCtrl.create({
        //   title: 'Attenzione!',
        //   subTitle: 'Quantità disponibile in stock: ' + this.product.stock_available,
        //   buttons: ['OK']
        // });
        // alert.present();
      }

      /**all'azione AGGIUNGI AL CARRELLO CASO 2: RAGGIUNTA MAX DISPONIBILITA' DAL BTN AGGIUNGI AL CARRELLO
       * Se incrementando la QTY dal btn AGGIUNGI AL CARRELLO (p.qty) viene raggiunta la MAX DISPONIBILITA'
       * all'azione AGGIUNGI AL CARRELLO vengono valutate 2 condizioni
       * * verifica che andiamo a valutare la seconda condizione (p.qty == p.stock_available) sul prodotto che attualmente viene visualizzato nel dettaglio 
       *   (senza questa condizione una volta raggiunta la MAX DISPONIBILITA' per un prodotto - da AGGIUNGI AL CARRELLO -  la seconda condizione
       *   p.qty == p.stock_available risulterebbe vera per tutti i prodotti) 
       * * verifica che la p.qty sia = allo stock disponibile (ovvero MAX DISPONIBILITA') 
       * SE LE CONDIZIONI RISULTANO VERE IL BTN AGGIUNGI AL CARRELLO VIENE DISABILITATO
       */
      if ((this.id == p.id) && (p.qty == p.stock_available)) {
        console.log('1) ->p.id ' + p.id + ' ->this.id: ' + this.id + ' ->this.qty: ' + this.qty + ' ->p.qty: ' + p.qty);
        (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;
        let alert_one = this.alertCtrl.create({
          title: 'Attenzione!',
          subTitle: "Hai raggiunto la massima quantità ordinabile per questo prodotto. Disponibili in stock: <strong> " + p.stock_available + "</strong>",

          buttons: ['OK']
        });
        alert_one.present();
      }

      /**
       * all'azione AGGIUNGI AL CARRELLO CASO 3: es STOCK DISPONIBILE = 3 
       * DAL BTN INCREMETA QTY LA QUANTITA' CHE è STATA SELEZIONATA è = 2 
       * AL SECONDO CLICK IL BTN AAC SI DISABILITA DOPO CHE IL PRODOTTO E STATO AGGIUNTO AL CARRELLO MA CON P.QTY DECURTATA 
       * IN MODO CHE NON SUPERI LA MAX QTY ORDINABILE
       * LA CONDIZIONE CHE SI VALUTA ALL'AZIONE AGGIUNGI AL CARRELLO E SE LA QUANTITA' DEL PRODOTTO (p.qty)
       * è MAGGIORE DELLO STOCK DISPONIBILE 
       * IL BTN AGIIUNGI AL CARRELLO VIENE DISABILITATO
       */
      // if ((this.id == p.id) && (p.qty + this.qty > p.stock_available)) {
      if ((this.id == p.id) && (p.qty > p.stock_available)) {
        // if (p.qty > p.stock_available) {
        console.log('2) ->p.id ' + p.id + ' ->this.id: ' + this.id + ' ->this.qty: ' + this.qty + ' ->p.qty: ' + p.qty);


        // let still_stock_available = (p.qty + this.qty) - p.stock_available
        // let still_stock_available = p.qty - p.stock_available
        // console.log('Ancora disponibili in stock ', still_stock_available)

        // p.qty = (p.qty + this.qty) - p.stock_available 
        // p.qty = p.stock_available
        let still_stock_available = p.stock_available - (p.qty - this.qty)
        console.log('still_stock_available', still_stock_available)
        p.qty = (p.qty - this.qty) + still_stock_available
        console.log('Quantità prodotto dopo adeguamento ', p.qty)

        let alert_two = this.alertCtrl.create({
          title: 'Attenzione!',
          subTitle: "Hai raggiunto la massima quantità ordinabile per questo prodotto. Disponibili in stock: <strong> " + p.stock_available + "</strong>",

          buttons: ['OK']
        });
        alert_two.present();

        (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;
        // (<HTMLInputElement>document.getElementById("btnIncrementQtyInWL")).disabled = true;
      }


      // else {

      //   MyCart.getInstance().addProduct(p)

      //   let toast = this.toastCtrl.create({
      //     message: 'Prodotto aggiunto nel tuo carrello',
      //     duration: 2000,
      //     position: 'bottom'
      //   });
      //   toast.present();
      // }

    } // END FOR

    // MyCart.getInstance().addProduct(this.product)

    // let carrello = new MyCart()
    // carrello.products.push(this.product)
    // carrello.addProduct(this.product)

  } // end ADD TO WISH LIST 

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI product-details.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.products) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  openImgInModal(product_Id: number) {
    // let product_Id = { product_Id: this.id };
   
    let myModal = this.modalCtrl.create(ProductImgModalPage, {product_Id: this.id} );
    console.log('ID Prodotto in openImgInModal: ', myModal)
    myModal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

}
