import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Order } from '../../models/order';
import { EurofoodCustomerOrders } from '../../providers/eurofood-customer-orders';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';

import { WishlistPage } from '../wishlist/wishlist';

import { Localstorage } from '../../providers/localstorage';

import { WishlistService } from '../../providers/wishlist-service';

import { OrderDetailsPage } from '../order-details/order-details';

import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { Http } from '@angular/http';

import { MyCart } from '../../models/mycart';
import { ProductInCart } from '../../models/productInCart';

import { SearchPage } from '../search/search';
/*
  Generated class for the Orders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})
export class OrdersPage {

  order: Order[];
  //TEST
  // order: Order[];

  id: number;

  currentUser: User;

  products: ProductInCart[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private eurofoodCustomerOrders: EurofoodCustomerOrders,
    public wishlistService: WishlistService,
    private localstorage: Localstorage,
    public http: Http,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {

    this.products = MyCart.getInstance().products
    console.log('This products', this.products)

  } // end constructor

  /**
 * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
 * LA FUNZIONE LA RICHIAMO NEL BADGE DI order.html
 */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.products) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(true);
  }

  ngAfterViewInit() {
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {
      if (hasLoggedIn) {
        this.getCurrentUser();

      } else {
        let msgNoLogged = this.alertCtrl.create({

          title: 'Attenzione!',
          message: 'Accedi per visualizzare i tuoi ordini',
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

      } // end else
    }); // end hasLoggedIn

  }


  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      let currentUserId = this.currentUser.id;
      // console.log('STORED CURRENT USER (get in orders.ts): ', this.currentUser)
      // console.log('STORED CURRENT USER ID (get in orders.ts): ', currentUserId)

      // Create the Loading popup
      let loadingPopup = this.loadingCtrl.create({
        content: 'Loading data...'
      });
      // Show the popup
      loadingPopup.present();

      this.eurofoodCustomerOrders.loadCustomerOrders(currentUserId).subscribe(order => {
        loadingPopup.dismiss();

        if (order) {
          this.order = order;

          console.log('Ordini', order);

          let orders_lenght = order['length'];
          console.log('Array Lenght', orders_lenght)

          let i = 0
          for (i = 0; i < orders_lenght; ++i) {
            console.log(i);
            let id_order_current_state = order[i]['current_state'];
            console.log('Id Stato Ordine ', id_order_current_state)

            this.eurofoodCustomerOrders.loadCustomerOrderState(id_order_current_state).subscribe(orderstate => {
              console.log('Order State ', orderstate)

              let orderStateName = orderstate['name']
              let orderStateId = orderstate['id']
              let color = orderstate['color']
              console.log('Order state ID Seconda Chiamata ', orderStateId)
              console.log('Order State Name ', orderStateName)
              console.log('Color ', color)

              for (let order of this.order) {
                if (order.current_state == orderStateId) {
                  order.name = orderStateName
                  order.orderstatecolor = color
                }
              }

              // this.order.name = orderStateName
              // console.log('Order Name', this.order.name)
            }); // end loadCustomerOrderState

          }

        }

        // else { // end if order
        //   loadingPopup.dismiss();
        //   let toast = this.toastCtrl.create({
        //     message: 'Non hai ancora effettuato ordini',
        //     duration: 3000,
        //     position: 'bottom'
        //   });
        //   toast.present();
        // } // end else

      }); // end loadCustomerOrders

    });
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

  goToOrderDetails(id: number) {
    this.navCtrl.push(OrderDetailsPage, { id });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

}
