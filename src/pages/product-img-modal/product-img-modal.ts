import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Product } from '../../models/product';
import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';
import { PrestashopProducts } from '../../providers/prestashop-products';

/*
  Generated class for the ProductImgModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-img-modal',
  templateUrl: 'product-img-modal.html'
})
export class ProductImgModalPage {

  product: Product;
  product_id: number

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private psProducts: PrestashopProducts,
    private psApi: PrestaShopApi,
  ) {

    this.product_id = this.navParams.get('product_Id');
    console.log('Product id get from p-details: ', this.product_id)

    this.psProducts.loadProductDetails(this.product_id).subscribe(product => {

      this.product = product;
      console.log('Prodotto in product-img-modal ', this.product)
    });

  }



  closeModal() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductImgModalPage');
  }

}
