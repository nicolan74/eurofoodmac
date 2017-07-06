import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { User } from '../../models/user';

import { EurofoodUsers } from '../../providers/eurofood-users';
import { Localstorage } from '../../providers/localstorage';
import { WishlistService } from '../../providers/wishlist-service';
import { LoginPage } from '../login/login';

import { WishlistPage } from '../wishlist/wishlist';

import { MyCart } from '../../models/mycart';
import { ProductInCart } from '../../models/productInCart';

import { EurofoodCustomerAddress } from '../../providers/eurofood-customer-address';
import { Address } from '../../models/address';

import { SignUpCompanyPage } from '../sign-up-company/sign-up-company';


/*
  Generated class for the UserDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html'
})
export class UserDetailsPage {
  // login: string;
  user: User;
  id: number;
  currentUser: User

  currentUserAddress: Address;

  products: ProductInCart[]

  has_ADDRESS: boolean = true

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private eurofoodUsers: EurofoodUsers,
    private localstorage: Localstorage,
    public wishlistService: WishlistService,
    private alertCtrl: AlertController,
    public eurofoodCustomerAddress: EurofoodCustomerAddress
  ) {

    this.products = MyCart.getInstance().products
    console.log('This products', this.products)
    // this.id = navParams.get('id');
    // eurofoodUsers.loadDetails(this.id).subscribe(user => {
    //   this.user = user;
    //   console.log(user);
    // })


  } // end constructor

  ngAfterViewInit() {
    // ngOnInit(){
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {

      if (hasLoggedIn) {
        this.getCurrentUser();

      } else {
        let msgNoLogged = this.alertCtrl.create({

          title: 'Attenzione!',
          message: 'Accedi per visualizzare il tuo profilo',
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
    });
  }



  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER (get in user-details): ', this.currentUser)

      let currentUserId = this.currentUser.id;
      console.log('Id Utente Logged ', currentUserId)
      this.eurofoodUsers.loadLoggedCustomerDetails(this.currentUser.id).subscribe(user => {
        this.user = user;

        console.log('Response from call Load User Detais ', user)
      });


      // Load customer address by providing current user id
      this.eurofoodCustomerAddress.loadCustomerAddressInUserDtls(this.currentUser.id).subscribe(address => {
        if (address) {
          this.currentUserAddress = address
          console.log('Address ', this.currentUserAddress)
          
        } else {

          this.has_ADDRESS = false

        }
      });

    });
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

  onSignupCompany() {
    this.navCtrl.push(SignUpCompanyPage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailsPage');
  }

}
