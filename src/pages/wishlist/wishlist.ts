import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';

import { EurofoodCustomerAddress } from '../../providers/eurofood-customer-address'
import { WishlistService } from '../../providers/wishlist-service'
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { Cart } from '../../models/cart';
import { Address } from '../../models/address';
import { MyCart } from '../../models/mycart';

import { Http, Headers } from '@angular/http';

import { Localstorage } from '../../providers/localstorage';

import { Storage } from '@ionic/storage';
import { RegisterAddressPage } from '../register-address/register-address';

import { SignUpCompanyPage } from '../sign-up-company/sign-up-company';
import { LoginPage } from '../login/login';

import { PrestashopProducts } from '../../providers/prestashop-products';

import { ProductInCart } from '../../models/productInCart';

import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

import { SearchPage } from '../search/search';

import { HomePage } from '../home/home';

import { EurofoodUsers } from '../../providers/eurofood-users';

/*
  Generated class for the Wishlist page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html'
})
export class WishlistPage {
  // products: Product[]

  products: ProductInCart[]

  currentUser: User;
  cart: Cart[];
  cartId: number;
  qty: number;

  isActive_currentUser: any;

  product: Product;
  currentUserAddress: Address;

  id_NO_default_imageOfAppFeatProduct: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public wishlistService: WishlistService,
    public http: Http,
    private localstorage: Localstorage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public eurofoodCustomerAddress: EurofoodCustomerAddress,
    public eurofoodUsers: EurofoodUsers,
    private alertCtrl: AlertController,
    private psProducts: PrestashopProducts,
    private psApi: PrestaShopApi
  ) {

    this.products = MyCart.getInstance().products
    console.log('!->This products (wishlist.ts)', this.products)

    /**
     * Assegno l'id dell'immagine NO di copertina eventualmente passata a questa pagina se viene cliccato il prodotto associato ad App-Featured
     * 
     */
    // this.id_NO_default_imageOfAppFeatProduct = navParams.get('id_no_default_img');
    // console.log('ID NO DAFAULT IMG (get in wishlist.ts) ', this.id_NO_default_imageOfAppFeatProduct)


    // Calcolo Prezzo Tassa inclusa x SUBHEADER
    // var sumTaxIncl_SH = 0
    // for (let p of this.products) {
    //   console.log('!-->Prodotto ', p.name)
    //   console.log('!--->Prezzo Tasse Incluse ', p.priceTaxInc)
    //   console.log('!---->Prezzo Tasse Incluse x Qty ', p.priceTaxInc * p.qty)
    //   sumTaxIncl_SH += +p.priceTaxInc //* p.qty
    //   console.log('!----->sumTaxIncl_SH ', sumTaxIncl_SH)

    // }


    // setTimeout(() => {
    //   // run jQuery stuff here
    // }, 0);


    // for (let p of this.products) {
    //   let id_tax_rule_groups = p.id_tax_rules_group;
    //   console.log('id Tax Rule Groups (get in wishlist): ', id_tax_rule_groups)
    // }

    //  this.products.qty = product.qty
    // this.products.qty = this.products
    // console.log ('QTY wishlist.ts ', this.product.qty)

  } // end constructor

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI wishlist.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.products) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  // changeQuantity(index, quantity) {
  //   this.products[index].qty = quantity;

  //   console.log(this.products[index].qty)
  //   console.log(quantity)
  // }


  // increment product qty
  incrementQty(index, quantity) {
    console.log('Prima', this.products[index].qty);
    // this.qty += 1;
    this.products[index].qty = quantity + 1
    console.log('Dopo', this.products[index].qty);

    console.log('this.products[index].stock_available', this.products[index].stock_available)

    if (this.products[index].qty == this.products[index].stock_available) {
      // (<HTMLInputElement>document.getElementById("btnIncrementQtyInWL")).disabled = true;
      (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = true;
      (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = true;

      let alert = this.alertCtrl.create({
        title: 'Attenzione!',
        subTitle: "Hai raggiunto la massima quantità ordinabile per questo prodotto. Disponibili in stock: <strong> " + this.products[index].stock_available + "</strong>",
        buttons: ['OK']
      });
      alert.present();

    }
  }

  // decrement product qty
  decrementQty(index, quantity) {
    // if (this.qty - 1 < 1) {
    if (this.products[index].qty - 1 < 1) {
      this.products[index].qty = quantity = 1
      console.log('1->' + this.products[index].qty);
    } else {
      this.products[index].qty = quantity -= 1;
      console.log('2->' + this.products[index].qty);

      /**
       * Se la quantità selezionata è minore della quantità disponibile
       * abilita incrementa quantità nell view del carrello 
       * abilita aggiungi al carrello della view products-details
       * abilita incrementa quantità nell view del products-details 
       */

      if (this.products[index].qty < this.products[index].stock_available) {
        (<HTMLInputElement>document.getElementById("btnIncrementQtyInWL")).disabled = false;
        (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = false;
        (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = false;
      }

      if (this.products[index].stock_available == 1) {
        (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled =true;
      }
    }
  }

  // ngAfterViewInit() {
  ngOnInit() {
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();
    setTimeout(() => {

      // for (let i = 0; i < this.products.length; ++i) {
      //   if (this.products[i].qty == this.products[i].stock_available) {
      //     (<HTMLInputElement>document.getElementById("btnIncrementQtyInWL")).disabled = true;
      //   }
      // }

      // console.log ('NN ', MyCart.getInstance().value)
      for (let p of this.products) {

        console.log('Product in Cart in ngAfterViewInit (wishlist.ts)', p)
        console.log('Product in Cart ID in ngAfterViewInit (wishlist.ts)', p.id)
        console.log('Product in Cart stock_available in ngAfterViewInit (wishlist.ts)', p.stock_available);
        console.log('Product in Cart QTY in ngAfterViewInit (wishlist.ts)', p.qty);

        // All'entrata della Pagina se quantità selezionata = a quantità disponibile disabilita incrementa quantità
        // !!!!!!!! ATTENZIONE FUNZIONA SOLO SE NEL CARRELLO è PRESENTE UN SOLO PRODOTTO

        // if (p.qty == p.stock_available))  {
        //   (<HTMLInputElement>document.getElementById("btnIncrementQtyInWL")).disabled = true;

        // }

        // dall'oggetto prodotto prendo la proprietà id_tax_rules_group
        let id_taxRulesGroup = p.id_tax_rules_group;
        console.log('id Tax Rule Groups (get in wishlist): ', id_taxRulesGroup)

        // effettuo request a ...api/tax_rule_groups filtrando i risultati per l' id_tax_rules_group del prodotto
        this.psProducts.loadProductIdTaxRulesGroup(p.id_tax_rules_group).subscribe(taxrule => {

          this.product = taxrule;

          if (taxrule) {
            // dal Response prendo il nome della tassa applicata e la assegno a tax_rule_name proprità di prodotto 
            this.product.tax_rule_name = taxrule['name']
            console.log('Tassa Applicata: ', this.product.tax_rule_name)

            // eseguo split della stringa che restituisce un object
            let tax_rule_name_object = this.product.tax_rule_name.split(/(\d+)/)
            console.log('Tassa Applicata SPLIT', tax_rule_name_object)

            // prendo dall' oggetto l'elemento con index = 1 (il numero percentuale della tassa)
            let _percentTax = tax_rule_name_object[1]

            // trasformo la stringa in intero
            let percentTax = parseInt(_percentTax)
            console.log('percent tax Parse (retrieve in w-l.ts) a ' + p.name + ' :' + percentTax)

            /* Importo della tassa e prezzo tax inclusa calcolata (se esiste) sul prezzo scontato */
            if (p.reduction) {
              console.log(p.name, ' HA RIDUZIONE SUL PREZZO')

              let taxOverPrice = (p.discountedPrice * percentTax) / 100
              console.log(p.name, ' Importo tassa sul Prezzo scontato: ', taxOverPrice)

              let priceTaxInc = +p.discountedPrice + +taxOverPrice
              console.log(p.name, ' Prezzo scontato tasse incluse ', priceTaxInc)

              p.priceTaxInc = priceTaxInc

              /* Importo della tassa e prezzo tax inclusa calcolata sul prezzo */
            } else {
              console.log(p.name, ' NON HA RIDUZIONE SUL PREZZO')
              let taxOverPrice = (p.price * percentTax) / 100
              console.log(p.name, ' Importo tassa: ', taxOverPrice)

              let priceTaxInc = +p.price + +taxOverPrice
              console.log(p.name, ' Prezzo tasse incluse ', priceTaxInc)

              p.priceTaxInc = priceTaxInc

            }

            // let priceTaxInc = +p.price + +taxOverPrice
            // console.log('Prezzo tasse incluse p.name ', priceTaxInc)

            // this.product.priceTaxInc = priceTaxInc
            // p.priceTaxInc = priceTaxInc
          }
        });

        console.log(p.name, ' Sconto (retrieve in w-l.ts): ', p.reduction)
        console.log(p.name, ' Prezzo scontato (retrieve in w-l.ts): ', p.discountedPrice)
        console.log(p.name, ' Importo sottratto al prezzo (retrieve in w-l.ts): ', p.discountAmount)

      }

      // console.log('this product priceTaxInc ', this.product.priceTaxInc)

      this.localstorage.hasLoggedIn().then((hasLoggedIn) => {
        this.getCurrentUser();
      });

      let priceTotTaxIncl = this.calcSumTaxIncl()
      console.log('Somma Tasse Incluse x qty (ngAfterViewInit) ', priceTotTaxIncl)

      loadingPopup.dismiss();
    }, 1);

  } // ngAfterViewInit sostituito con ngOnInit

  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      let currentUserId = this.currentUser.id;
      let currentUser_secure_key = this.currentUser.secure_key;
      console.log('STORED CURRENT USER (get in wishlist): ', this.currentUser)
      console.log('STORED CURRENT USER ID (get in wishlist): ', currentUserId)
      console.log('STORED CURRENT USER SECUR KEY (get in wishlist): ', this.currentUser.secure_key)

      /**
       * L' utente NON ATTIVO non può portare a termine l'ordine
       * il valore della key 'active' non può essere preso dall'oggetto currentUser
       * in quanto questo e 'stored' al momento del login e non si aggiorna ad eventuali cambiamenti fatti in PS
       * Dall'oggetto currentUser prendo l'id ed eseguo qui la una nuova richiesta (usata anche in user-details.ts) per ottenere i dati del current user aggiornati
       * ogni volta che l'utente accede alla pagina del carrello (questa pagina)
       * NOTA: lo uso a riga 493 
       */
      this.eurofoodUsers.loadLoggedCustomerDetails(this.currentUser.id).subscribe(user => {
        console.log('Oggetto user JUST NOW ', user)

        this.isActive_currentUser = user[0]['active']
        console.log('CURRENT USER IS ACtive: ', this.isActive_currentUser)

      })

      // Create the Loading popup
      let loadingPopup = this.loadingCtrl.create({
        content: 'Loading data...'
      });
      // Show the popup
      loadingPopup.present();

      setTimeout(() => {
        loadingPopup.dismiss();
      }, 3000);

      // Load customer address by providing current user id
      this.eurofoodCustomerAddress.loadCustomerAddress(this.currentUser.id).subscribe(address => {

        if (address != null) {

          this.currentUserAddress = address;
          console.log('Indirizzo (wishlist): ', this.currentUserAddress)
          // let addressId = this.currentUserAddress.id
          // var i = 0
          // for (i = 0; i < 1; i++) {
          //   // property = property[parts[i]];
          //   let addressId = this.currentUserAddress['id']
          //   console.log ('id indirizzo' , addressId)
          // }

          let addressId = this.currentUserAddress['id']
          console.log('Id indirizzo ', addressId)
          this.currentUserAddress.id = addressId

        }

        // let obj = JSON.parse("id": id)
        // var length = address.lenght
        // console.log('lenght ',length )
        // for (let a of this.currentUserAddress) {
        //   let addressId = this.currentUserAddress['id']
        //   console.log('Id indirizzo ', addressId)

      });
    });
  }


  private calcSumTaxInclAndRoundToUp() {

    var _sumTaxInclRTU = 0
    for (let p of this.products) {
      _sumTaxInclRTU += +p.priceTaxInc * p.qty
      var sumTaxInclRTU = Math.ceil(_sumTaxInclRTU * 100) / 100
    }
    return sumTaxInclRTU

  }

  /* Calcola SOMMA (TAX ESCL) prezzi o prezzi scontati (se esistono) prodotti nel carrello */
  private calcSumTaxExcl() {
    var sumTaxExcl = 0
    for (let p of this.products) {
      // esiste  uno Sconto
      if (p.reduction) {
        // effettua somma sui prezzi scontati
        sumTaxExcl += +p.discountedPrice * p.qty
      } else {
        // non esiste sconto: somma sui prezzi
        sumTaxExcl += +p.price * p.qty
      }
    }
    return sumTaxExcl
  }

  /* p.priceTaxInc tiene conto dell'esistenza o meno di una riduzione sul prezzo (vedi sopra) */
  private calcSumTaxIncl() {
    var sumTaxIncl = 0
    for (let p of this.products) {
      sumTaxIncl += +p.priceTaxInc * p.qty

      // console.log('sumTaxIncl x qty (nella Funzione) ', this.calcSumTaxIncl())
    }
    // console.log('sumTaxIncl x qty (nella Funzione) ', sumTaxIncl)
    return sumTaxIncl
  }

  /* p.priceTaxInc tiene conto dell'esistenza o meno di una riduzione sul prezzo (vedi sopra) */
  private calcSumTaxInclReal() {
    var sumTaxIncl = 0
    for (let p of this.products) {
      sumTaxIncl += +p.priceTaxInc
    }
    return sumTaxIncl
  }

  // Invia carrello e con Id carrello ritornato effettua ordine
  // sendCartToPs() {
  sendCartAndOrderToPs() {
    for (let p of this.products) {
      console.log('Nome Prodotto', p.name)

      /* Prezzo */
      console.log('Prezzo ', p.price)
      let priceRound = Math.ceil(p.price * 100) / 100
      console.log('Prezzo Arront to up', priceRound)

      /* Prezzo Tax Incluse */
      console.log('Prezzo Tax Inc', p.priceTaxInc)
      let priceTaxInclRound = Math.ceil(p.priceTaxInc * 100) / 100
      console.log('Prezzo Tax Inc Arr to up', priceTaxInclRound)

      /* Prezzo Tax Escluse */
      if (p.reduction) {
        p.priceTaxEscl = p.discountedPrice
      } else {
        p.priceTaxEscl = p.price
      }

      console.log('Reference ', p.reference)
    }
    /**
     * TOTALI
     */
    let priceTotTaxEscl = this.calcSumTaxExcl()
    console.log('Somma Tax Escluse x qty', priceTotTaxEscl)

    let priceTotTaxEsclRound = Math.ceil(priceTotTaxEscl * 100) / 100
    console.log('Somma Tax Escluse Round to up x qty', priceTotTaxEsclRound)

    let priceTotTaxIncl = this.calcSumTaxIncl()
    console.log('Somma Tasse Incluse x qty', priceTotTaxIncl)

    let priceTotTaxInclRound = Math.ceil(priceTotTaxIncl * 100) / 100
    console.log('!----->Somma Tax Incluse Round to up x qty', priceTotTaxInclRound)

    let priceTotTaxInclReal = this.calcSumTaxInclReal()
    console.log('Somma Tasse Incluse Real', priceTotTaxInclReal)
    let priceTotTaxInclRealRound = Math.ceil(priceTotTaxInclReal * 100) / 100
    console.log('Somma Tax Escluse Round Real', priceTotTaxInclRealRound)


    if (!this.currentUser) {

      let msgNoLogged = this.alertCtrl.create({

        title: 'Attenzione!',
        message: "Accedi per effettuare l'ordine",
        buttons: [
          {
            text: 'Annulla',

            handler: () => {
              console.log('Annulla clicked');
            },
            cssClass: 'buttoncss',
          },
          {
            text: 'Login',
            handler: () => {
              console.log('Vai al Login');
              this.navCtrl.push(LoginPage)
            },

          }
        ]
      });
      msgNoLogged.present();

    } else if (!this.currentUserAddress) {
      let msgNoAddress = this.alertCtrl.create({

        title: 'Attenzione!',
        message: "Completa il tuo profilo per poter inviare l'ordine",
        buttons: [
          {
            text: 'Annulla',

            handler: () => {
              console.log('Salta clicked');
            },
            cssClass: 'buttoncss',
          },
          {
            text: 'Completa ora',
            handler: () => {
              console.log('Completa il tuo profilo');
              this.navCtrl.push(SignUpCompanyPage)
            },

          }
        ]
      });
      msgNoAddress.present();

      // creazione carrello e successivo ordine non vengono effettuati se l'utente non è attivo

    } else if (this.isActive_currentUser == 0) {

      console.log('CURRENT USER IS ACtive (get in else if): ', this.isActive_currentUser)

      let alertUserIsNotActive = this.alertCtrl.create({
        title: 'Attenzione!',
        subTitle: "<strong>Il tuo account non è ancora attivo e non puoi completare l'ordine.</strong><br> Se hai già verificato il tuo indirizzo tramite il link dell'email che ti abbiamo inviato al momento della registrazione contatta il supporto clienti. ",
        buttons: ['Ok']
      });
      alertUserIsNotActive.present();


    } else {
      // end else

      let headers = new Headers();
      headers.append('Content-Type', 'text/xml');

      this.getCurrentUser();
      let currentUserId = this.currentUser.id;

      console.log('STORED CURRENT USER ID (get in wishlist): ', currentUserId)
      let headerOfCartRequest =
        // <?xml version="1.0" encoding="UTF-8"?>
        "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
        "<cart>" +
        "<id></id>" +
        "<id_address_delivery>" + this.currentUserAddress.id + "</id_address_delivery>" +
        "<id_address_invoice>" + this.currentUserAddress.id + "</id_address_invoice>" +
        "<id_currency>1</id_currency>" +
        "<id_customer>" + currentUserId + "</id_customer>" +
        "<id_guest></id_guest>" +
        "<id_lang>1</id_lang>" +
        "<id_shop_group>1</id_shop_group>" +
        "<id_shop>1</id_shop>" +
        "<id_carrier>5</id_carrier>" +
        "<recyclable>0</recyclable>" +
        "<gift>0</gift>" +
        "<gift_message></gift_message>" +
        "<mobile_theme>0</mobile_theme>" +
        "<delivery_option></delivery_option>" +
        "<secure_key>" + this.currentUser.secure_key + "</secure_key>" +
        "<allow_seperated_package>0</allow_seperated_package>" +
        "<date_add></date_add>" +
        "<date_upd></date_upd>" +
        "<associations>" +
        "<cart_rows>";

      let footerOfCartRequest =
        "</cart_rows>" +
        "</associations>" +
        "</cart>" +
        "</prestashop>";

      var body = ""
      for (let p of this.products) {
        body +=
          "<cart_row>" +
          "<id_product>" + p.id + "</id_product>" +
          "<id_product_attribute>0</id_product_attribute>" +
          "<id_address_delivery>" + this.currentUserAddress.id + "</id_address_delivery>" +
          "<quantity>" + p.qty + "</quantity>" +
          "</cart_row>"
      }

      let cartRequest = headerOfCartRequest + body + footerOfCartRequest;
      console.log('Xml Cart Request ', cartRequest)

      // Create the Loading popup
      let loadingPopupForCartRequest = this.loadingCtrl.create({
        content: 'Saving cart data...'
      });
      // Show the popup
      loadingPopupForCartRequest.present();

      // this.http.post('http://www.nebula-projects.com/prestashop/api/carts?schema=blank&output_format=JSON&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', cartRequest, { headers: headers })
      this.http.post(this.psApi.psShopHostName + "/carts?schema=blank&output_format=JSON&ws_key=" + this.psApi.psWsKey, cartRequest, { headers: headers })
        .map(res => res.json().cart)
        .subscribe(data => {
          console.log(data);

          this.cartId = data['id'];

          loadingPopupForCartRequest.dismiss();

          console.log('cart ID ', this.cartId)

          // START ORDER REQUEST
          headers.append('Content-Type', 'text/xml');

          if (this.cartId) {
            let headerOfOrderRequest =
              "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
              "<order>" +
              "<id></id>" +
              "<id_address_delivery>" + this.currentUserAddress.id + "</id_address_delivery>" +
              "<id_address_invoice>" + this.currentUserAddress.id + "</id_address_invoice>" +
              "<id_cart>" + this.cartId + "</id_cart>" +
              "<id_currency>1</id_currency>" +
              "<id_lang>1</id_lang>" +
              "<id_customer>" + currentUserId + "</id_customer>" +
              "<id_carrier>5</id_carrier>" +
              "<current_state>0</current_state>" +
              "<module>ps_cashondelivery</module>" +
              "<invoice_number></invoice_number>" +
              "<invoice_date></invoice_date>" +
              "<delivery_number></delivery_number>" +
              "<delivery_date></delivery_date>" +
              "<valid></valid>" +
              "<date_add></date_add>" +
              "<date_upd></date_upd>" +
              "<shipping_number></shipping_number>" +
              "<id_shop_group>1</id_shop_group>" +
              "<id_shop>1</id_shop>" +
              "<secure_key>" + this.currentUser.secure_key + "</secure_key>" +
              "<payment>Cash on delivery (COD)</payment>" +
              "<recyclable></recyclable>" +
              "<gift>0</gift>" +
              "<gift_message></gift_message>" +
              "<mobile_theme>0</mobile_theme>" +
              "<total_discounts>0</total_discounts>" +
              "<total_discounts_tax_incl>0</total_discounts_tax_incl>" +
              "<total_discounts_tax_excl>0</total_discounts_tax_excl>" +
              "<total_paid>" + priceTotTaxInclRound + "</total_paid>" +
              "<total_paid_tax_incl>" + priceTotTaxInclRound + "</total_paid_tax_incl>" +
              "<total_paid_tax_excl>" + priceTotTaxEsclRound + "</total_paid_tax_excl>" +
              "<total_paid_real>0</total_paid_real>" +
              "<total_products>" + priceTotTaxEsclRound + "</total_products>" +
              "<total_products_wt>" + priceTotTaxInclRound + "</total_products_wt>" +
              "<total_shipping>0</total_shipping>" +
              "<total_shipping_tax_incl>0</total_shipping_tax_incl>" +
              "<total_shipping_tax_excl>0</total_shipping_tax_excl>" +
              "<carrier_tax_rate>0</carrier_tax_rate>" +
              "<total_wrapping>0</total_wrapping>" +
              "<total_wrapping_tax_incl>0</total_wrapping_tax_incl>" +
              "<total_wrapping_tax_excl>0</total_wrapping_tax_excl>" +
              "<round_mode>2</round_mode>" +
              "<round_type>2</round_type>" +
              "<conversion_rate>1</conversion_rate>" +
              "<reference></reference>" +
              "<associations>" +
              "<order_rows>";

            let footerOfOrderRequest =
              "</order_rows>" +
              "</associations>" +
              "</order>" +
              "</prestashop>";

            var bodyOfOrderRequest = ""
            for (let p of this.products) {
              bodyOfOrderRequest +=

                "<order_row>" +
                "<id></id>" +
                "<product_id>" + p.id + "</product_id>" +
                "<product_attribute_id>0</product_attribute_id>" +
                "<product_quantity>" + p.qty + "</product_quantity>" +
                "<product_name>" + p.name + "</product_name>" +
                "<product_reference>" + p.reference + "</product_reference>" +
                "<product_ean13></product_ean13>" +
                "<product_isbn></product_isbn>" +
                "<product_upc></product_upc>" +
                "<product_price>" + p.price + "</product_price>" +
                "<unit_price_tax_incl>" + p.priceTaxInc + "</unit_price_tax_incl>" +
                "<unit_price_tax_excl>" + p.priceTaxEscl + "</unit_price_tax_excl>" +
                "</order_row>";
            }

            let orderRequest = headerOfOrderRequest + bodyOfOrderRequest + footerOfOrderRequest;

            console.log('Xml Order Request', orderRequest)

            // this.http.post('http://www.nebula-projects.com/prestashop/api/orders?schema=blank&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', orderRequest, { headers: headers })
            this.http.post(this.psApi.psShopHostName + "/orders?schema=blank&ws_key=" + this.psApi.psWsKey, orderRequest, { headers: headers })
              // .map(res => res.json())
              .subscribe(data => {
                console.log(data);
                var parser = new DOMParser();
                var xmlData = parser.parseFromString(data.text(), "application/xml");
                console.log(xmlData);

                let orderId = xmlData.getElementsByTagName('id')[0].childNodes[0].nodeValue;

                console.log('ORDER ID: ', orderId);

                if (orderId) {
                  // START CHANGE ORDER STATUS
                  // headers.append('Content-Type', 'text/xml');
                  // let changeOrderStatus =
                  //   "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
                  //   "<order_history>" +
                  //   "<id></id>" +
                  //   "<id_employee>0</id_employee>" +
                  //   "<id_order_state>3</id_order_state>" +
                  //   "<id_order>" + orderId + "</id_order>" +
                  //   "<date_add></date_add>" +
                  //   "</order_history>" +
                  //   "</prestashop>";

                  // console.log("XML Change Order Status ", changeOrderStatus)
                  // //http://www.nebula-projects.com/prestashop/api/order_histories?schema=blank&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
                  // this.http.post(this.psApi.psShopHostName + "/order_histories?schema=blank&ws_key=" + this.psApi.psWsKey, changeOrderStatus, { headers: headers })
                  //   .subscribe(data => {
                  //     console.log(data);
                  //   });

                  // MyCart.getInstance().empty()
                  MyCart.getInstance().clear()

                  // this.wishlistService.empty();


                  /* Questo ricarica la app */
                  // location.reload();
                  /* Questo esegue il refresh ma scompare il pulsante indietro (<-)*/
                  // this.navCtrl.setRoot(this.navCtrl.getActive().component);

                  /*Questo rimanda alla Home Page*/
                  this.navCtrl.push(HomePage)

                  let toast = this.toastCtrl.create({
                    message: 'Ordine inviato',
                    duration: 2000,
                    position: 'bottom'
                  });
                  toast.present();

                  /* Questo ricarica la app */
                  // location.reload();
                }
              });
          }
        });

      // end this.currentUserAddress.id
      // } else { 

      //   let confirm = this.alertCtrl.create({
      //     title: 'Attenzione dati mancanti!',
      //     message: 'Dati mancanti per invio ordine',
      //     buttons: [
      //       {
      //         text: 'Continua con gli acquisti',
      //         handler: () => {
      //           console.log('Salta clicked');


      //         }
      //       },
      //       {
      //         text: 'Vai al form',
      //         handler: () => {
      //           console.log('Vai al form');
      //           this.navCtrl.push(RegisterAddressPage)
      //         }
      //       }
      //     ]
      //   });
      //   confirm.present();

    }

    // end else
  } // end Invia CARRELLO + ORDINE a Prestashop

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WishlistPage');

  }

  // deleteFromWishlist(product) {
  //   this.wishlistService.deleteProduct(product);

  //   // this.storage.remove('storedProducts').then(() => {
  //   //   console.log('Product removed');
  //   // });

  // }



  deleteFromWishlist(product) {
    // let index = this.products.indexOf(product);

    // if (index > -1) {
    //     this.products.splice(index, 1);
    // }
    MyCart.getInstance().deleteProductInCart(product);

    (<HTMLInputElement>document.getElementById("btnAddToCart")).disabled = false;
    (<HTMLInputElement>document.getElementById("btnIncrementQty")).disabled = false;
  }
}
