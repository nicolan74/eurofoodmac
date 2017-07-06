import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductDetailsPage } from '../product-details/product-details';

import { Product } from '../../models/product';
import { PrestashopProducts } from '../../providers/prestashop-products';
/*
  Generated class for the Products page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {

  products: Product[]
  originalProducts: Product[];
  id: number;
  id_default_image: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private psProducts: PrestashopProducts) {
    psProducts.loadOriginalProducts().subscribe(products => {
      this.products = products;
      this.originalProducts = products;
      console.log(products)
    })

  }

  goToDetails(id: number) {
    this.navCtrl.push(ProductDetailsPage, { id });
  }

  search(searchEvent) {
    let term = searchEvent.target.value
    // We will only perform the search if we have 3 or more characters
    if (term.trim() === '' || term.trim().length < 3) {
      // Load cached users
      this.products = this.originalProducts;
    } else {
      // Get the searched users from github
      this.psProducts.searchProducts(term).subscribe(products => {
        this.products = products
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }

}
