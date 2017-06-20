import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EurofoodCategories } from '../../providers/eurofood-categories';

import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

import { Category } from '../../models/category';

import { SearchPage } from '../search/search';
import { WishlistPage } from '../wishlist/wishlist';
import { ProductInCart } from '../../models/productInCart';
import { MyCart } from '../../models/mycart';

/*
  Generated class for the SubOfferte page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sub-offerte',
  templateUrl: 'sub-offerte.html'
})
export class SubOffertePage {

  productsInCart: ProductInCart[]

  categories: Category[]

  offerCategoryID: number;
  offerCategoryName: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private eurofoodCategories: EurofoodCategories,
    public navParams: NavParams
  ) {

    this.productsInCart = MyCart.getInstance().products
    console.log('!->This products (sub-offerte.ts)', this.productsInCart)

    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();

    this.eurofoodCategories.loadOfferCategory().subscribe(categoryOffer => {

      console.log('-> Categoria Offerte ', categoryOffer)

      this.offerCategoryID = categoryOffer['id']
      console.log('--> Offer Category ID (sub-offerte.ts): ', this.offerCategoryID)

      this.offerCategoryName = categoryOffer['name']
      console.log('--> Offer Category NAME (sub-offerte.ts): ', this.offerCategoryName)

      eurofoodCategories.loadCategoriesLevelDepthThree(this.offerCategoryID).subscribe(categories => {
        console.log('Sottocategorie Categoria offerte (SUB-OFFERTE.ts) ', categories)

        this.categories = categories



        loadingPopup.dismiss();
      }); // end subscribe categories

    });

  } // end constructor

  goToProductsByCategory(id: number, categoryName: string) {
    // this.navCtrl.push(ProductsByCategoryPage, { id });
    this.navCtrl.push(ProductsByCategoryPage, { id: id, categoryName: categoryName });
  }
  goToViewAllInProductsByCategory(id: number,  offerCategoryName: string) {
    this.navCtrl.push(ProductsByCategoryPage, { id: this.offerCategoryID,  offerCategoryName: this.offerCategoryName});
    console.log('goToViewAllProductsByCategory ' + this.offerCategoryID + " - " + this.offerCategoryName)
  }

  /**
 * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
 * LA FUNZIONE LA RICHIAMO NEL BADGE DI sub-offerte.html
 */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.productsInCart) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubOffertePage');
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

}
