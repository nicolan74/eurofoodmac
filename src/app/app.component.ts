import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';


import { StatusBar, Splashscreen } from 'ionic-native';

import { UsersPage } from '../pages/users/users';
import { UserDetailsPage } from '../pages/user-details/user-details';

import { ReposPage } from '../pages/repos/repos';


import { ProductsPage } from '../pages/products/products';
import { CategoriesPage } from '../pages/categories/categories';
import { OrdersPage } from '../pages/orders/orders';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SubOffertePage } from '../pages/sub-offerte/sub-offerte';

import { EurofoodUsers } from '../providers/eurofood-users';
import { Events } from 'ionic-angular';
import { Localstorage } from '../providers/localstorage';
import { EurofoodCustomerOrders } from '../providers/eurofood-customer-orders';
import { User } from '../models/user';
import { MyCart } from '../models/mycart';
import { Utils } from '../models/utils';

import { Storage } from '@ionic/storage';

// import { NavController } from 'ionic-angular';





@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  // rootPage: any = UsersPage;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  currentUser: User;
  // currentUser2: User;
  //email='tushar@somewhere.com';
  logsOut?: boolean;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private eurofoodUsers: EurofoodUsers,
    public events: Events,
    private localstorage: Localstorage,
    private eurofoodCustomerOrders: EurofoodCustomerOrders,
    public storage: Storage,
    public alertCtrl: AlertController,
    // public navCtrl: NavController
  ) {

    this.initializeApp();

    // events.subscribe('user:logged', (currentUser) => {
    //   console.log('Welcome', currentUser.firstname);
    //   console.log('Welcome ID', currentUser.id);

    //   this.currentUser = currentUser;
    //   console.log('app component Current User', this.currentUser)

    //   this.saveCurrentUser();

    // });

    // events.subscribe('user:login', (currentuser2) => {
    //   // currentUser2.firstname =  this.currentUser2.firstname
    // this.currentUser2 = currentuser2
    // console.log('In ascolto sul Login: ', this.currentUser2)
    //   // !! Questo da errore: firstname null
    //   // console.log('Current User2 FirstName: ', this.currentUser2.firstname)
    // });

    this.listenToLoginEvents();

    // events.subscribe('user:storedlogged', (currentUser) => {
    //   console.log('Welcome', currentUser.firstname);
    //   this.currentUser = currentUser.firstname;
    // });



    // set our app's pages
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Offerte', component: SubOffertePage },
      { title: 'Scegli per categoria', component: CategoriesPage },
      { title: 'I miei ordini', component: OrdersPage },
      // { title: 'Login', component: LoginPage },
      { title: 'Il mio profilo', component: UserDetailsPage },
      // { title: 'Customers', component: UsersPage },
      // { title: 'Repos', component: ReposPage },

      // { title: 'Home', component: ProductsPage },
    ];
  }



  initializeApp() {
    this.platform.ready().then(() => {

      // let utilsvar = new Utils()
      //  utilsvar.checkPIVA()
      // let partiva = "04500950755"
      // let checked = Utils.checkPIVA(partiva)
      // if (checked) {
      //   console.log('P Iva Ok')
      // } else {
      //   console.log('P Iva NO Ok')
      // }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.hideSplashScreen();

      // get the current user SE DISATTIVATO NON GET
      // this.getCurrentUser();

      // !!!!!!!!!!!! 22.03
      this.localstorage.hasLoggedIn().then((hasLoggedIn) => {

        this.getCurrentUser();

      });

      // this.listenToLoginEvents();
      // !!!!!!!!!!!! 22.03

      // *** CLEAR STORAGE ***
      // this.clearLocalStorage();

      // var cart = MyCart.getInstance();
      // cart.value = 'nko';



    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }


  // saveCurrentUser() {
  //   this.localstorage.setCurrentUser(this.currentUser);
  // }

  // getCurrentUser() {
  //   this.localstorage.getCurrentUser();
  // }

  // 22.03
  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      console.log('STORED CURRENT USER (get in app.component.ts): ', this.currentUser)
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', (currentuser) => {
      this.currentUser = currentuser
      console.log('In ascolto sul Login: ', this.currentUser)
      // !! Questo da errore: firstname null
      // console.log('Current User2 FirstName: ', this.currentUser2.firstname)
    });

    this.events.subscribe('user:logout', () => {
      this.logsOut = true
      console.log('In ascolto sul LogOut - LogOut: ', this.logsOut)
      this.currentUser = null
      console.log('In ascolto sul LogOut - CurrentUser: ', this.currentUser)
    });
  }



  logout() {
    this.localstorage.logout();
    console.log('logout')
    this.nav.setRoot(HomePage);
    // window.location.reload();
    
  }

  login() {

    this.nav.push(LoginPage);

  }
  // logout() { ///<-- call this function straight with static button in html
  //   let alert = this.alertCtrl.create({
  //     title: 'Confermi il Log Out',
  //     message: 'Sei sicuro di voler effettuare il logout?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Log Out',
  //         handler: () => {
  //           this.localstorage.logout();
  //           console.log('logout')
  //           window.location.reload();
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }


  // 22.03




  // removeCurrentUser(){
  //   this.localstorage.removeCurrentUser();
  // }

  // *** CLEAR LOCAL STORAGE ***
  // clearLocalStorage(){
  //   this.localstorage.clearStorage();
  // }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);

    // console.log('THIS PAGES ', this.pages);
    // console.log('THIS PAGES TITLE ',this.pages['name'] )
    // console.log('** PAGE COMPONENT CLICKED ', page.component.title)
    // var objVC = this.nav.getActive();
    // if (objVC.component.name === 'OrdersPage') {
    //   console.log('Nome Componente', objVC.component.name)
    //   /* questo quello di default */
    //   // this.nav.setRoot(page.component);
    //   this.nav.push(page.component);
    //   // this.nav.setRoot(page.component);
    // } 

    // else {
    //   console.log('Nome Componente', objVC.component.name)
    //   this.nav.push(page.component);
    //   // this.nav.setRoot(page.component);
    // }
  }



  // goToMyOrders(id: number) {
  //   this.nav.push(OrdersPage, {id});
  // }

  // goToMyOrders() {
  //   this.nav.setRoot(OrdersPage);
  // }
}
