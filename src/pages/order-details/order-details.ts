import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Order } from '../../models/order';
import { EurofoodCustomerOrders } from '../../providers/eurofood-customer-orders';



/*
  Generated class for the OrderDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
  id: number;
  order: Order[];

 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eurofoodCustomerOrders: EurofoodCustomerOrders,
    public loadingCtrl: LoadingController
  ) {


    this.id = navParams.get('id');


    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });

    // loadingPopup.present();

    // eurofoodCustomerOrders.loadOrderDetails(this.id).subscribe(orderdetails => {
    //   this.order = orderdetails

    //   loadingPopup.dismiss();

    //   console.log('Dettagli Ordine ', orderdetails)

    //   let length = this.order.length
    //   console.log('Num Object nell Array ', length)

    // });
  } // end constructor

  ngAfterViewInit() {


    // Create the Loading popup
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();

    this.eurofoodCustomerOrders.loadOrderDetails(this.id).subscribe(orderdetails => {
      this.order = orderdetails

      loadingPopup.dismiss();

      console.log('Dettagli Ordine ', orderdetails)

      let length = this.order.length
      console.log('Num Object nell Array ', length)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
  }

}
