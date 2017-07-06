import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Product } from '../models/product';
import { MyCart } from '../models/mycart';

import { AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/*
  Generated class for the WishlistService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WishlistService {
  products: any[] = [];

  // nk 24.03 sera
  product: Product;


  quantity: any;

  constructor(
    public http: Http,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage
  ) {

    // this.qty=1;

    /**
    * GET STORED DATA: Using get method, get the value assocated with the given key. 
    * This returns a promise. Once the promise is resolved we get the stored data. 
    * If the key is being used for the first time and nothing has been stored yet, then it returns null. 
    * we get / fetch the stored data and assign it to a variable called .products */

    // this.storage.get('storedProducts').then((data) => {

    //   if (data) {
    //     this.products = data;
    //   }

    //   console.log('Stored Products: ', data);
    // });

    this.products = MyCart.getInstance().products


    console.log('Hello WishlistService Provider');
  }

  // addProduct(product: Object, qty:number): void {

  //   if (!(this.products.indexOf(product) > -1)) {

  //     this.products.push(product);
  //     this.quantity = qty;
  //     console.log ('QUANTITY (wishlistService)', this.quantity)

  //     // STORE PRODUCTS 
  //     console.log('Product added in storage ', product);
  //     this.storage.get('storedProducts').then((data) => {
  //       // 'IF'esistono dati immagazzinati: 'AGGIUNGE ALL'ARRAY' il product 
  //       // altrimenti (caso non esistono dati immagazzinati) viene creato l'ARRAY
  //       if (data != null) {
  //         data.push(product);
  //         this.storage.set('storedProducts', data);
  //       } else {
  //         let array = [];
  //         array.push(product);
  //         this.storage.set('storedProducts', array);
  //       }
  //     });

  //     let toast = this.toastCtrl.create({
  //       message: 'Prodotto aggiunto nel tuo carrello',
  //       duration: 2000,
  //       position: 'bottom'
  //     });
  //     toast.present();


  //   } else {

  //     let alert = this.alertCtrl.create({
  //       title: '<b>Attenzione</b>',
  //       subTitle: 'Questo articolo è già presente nel tuo cartello',
  //       buttons: ['OK']
  //     });
  //     alert.present();

  //   }
  // }

  deleteProduct(product: Object): void {

    let index = this.products.indexOf(product);

    if (index > -1) {
      this.products.splice(index, 1);

      // this.storage.remove('storedProducts').then(()=>{
      //     console.log('Product removed');
      // });
    }
  }

  empty() {
    this.products = []
    console.log('this products after empty in w-l ', this.products)
  }

  //   var index;
  // var a = ["a", "b", "c"];

  // increment product qty
  // incrementQty(product: Object) {
  //   let index = this.products.indexOf(product);
  //   if(index > -1){
  //     console.log(this.qty+1);
  //     this.qty += 1;
  //   }
  // }

  // decrement product qty
  // decrementQty(product: Object) {

  //   let index = this.products.indexOf(product);
  //     if(index > -1){
  //       if(this.qty-1 < 1 ){
  //         this.qty = 1
  //         console.log('1->'+this.qty);
  //       }else{
  //         this.qty -= 1;
  //         console.log('2->'+this.qty);
  //     }
  //   }
  // }


}
