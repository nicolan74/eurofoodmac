import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';

import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

import { Category } from '../../models/category';
import { EurofoodCategories } from '../../providers/eurofood-categories';

import { ProductInCart } from '../../models/productInCart';
import { MyCart } from '../../models/mycart';

import { SearchPage } from '../search/search';
import { WishlistPage } from '../wishlist/wishlist';

/*
  Generated class for the Categories page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {

  products: ProductInCart[]

  categories: Category[]

  parent_category_id: number;
  parent_category_name: string;


  category_id: number;
  category_name: string;

  has_Subcategories: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eurofoodCategories: EurofoodCategories,
    public loadingCtrl: LoadingController,
    public events: Events
  ) {

    this.products = MyCart.getInstance().products
    console.log('!->This products (categories.ts)', this.products)

    this.category_id = navParams.get('id');
    this.category_name = navParams.get('categoryName');
    console.log('get Cat Name ', this.category_name)

    this.categories = navParams.get('categories');

    /**
     * Se non viene passato nessun ID carica le categorie di level_depth = 2
     * Se viene passato un id vuol dire che è stato cliccato su una sottocategoria goToCategoryOrToProductsByCategory
     */
    if (!this.category_id) {

      this.loadHomeCategories()

    }
    else {

      this.has_Subcategories = true
      console.log('this.has_Subcategories', this.has_Subcategories)
      //   this.eurofoodCategories.loadSubCategories(this.category_id).subscribe(subcategories => {

      //     this.categories = subcategories;

      //   })

    }

  } // end constructor

  loadHomeCategories() {
    // Create the Loading popup
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    // Show the popup
    loadingPopup.present();

    this.eurofoodCategories.loadCategories().subscribe(categories => {
      this.categories = categories;

      loadingPopup.dismiss();

      console.log('Categorie ', categories)

      // for (let i = 0; i < categories.length; ++i) {
      //   console.log('Nome Cat ', categories[i]['name'])
      //   if (categories[i]['name'] == 'Offerte') delete this.categories[i];
      // }

      for (let category of this.categories) {

        let categoryName = category.name
        // console.log('Nome Categoria ', categoryName)
        // events.publish('categoryname', categoryName )

      }
    }) //end loadCategories
  }

  /**
   * RESTITUISCE LA SOMMA DELLE QUANTITA' DEI VARI PRODOTTI CHE SONO NEL CARRELLO
   * LA FUNZIONE LA RICHIAMO NEL BADGE DI categories.html
   */
  private calcSumOfQty() {
    var sumOfQtyPdotQty = 0
    for (let p of this.products) {
      sumOfQtyPdotQty += p.qty
    }
    return sumOfQtyPdotQty
  }

  goToCategoryOrToProductsByCategory(id: number, categoryName: string) {

    this.eurofoodCategories.loadSubCategories(id).subscribe(subcategories => {


      if ((subcategories != null)) {



        console.log('--- *** Sottocategorie (categories.ts) ', subcategories)
        this.navCtrl.push(CategoriesPage, { id: id, categoryName: categoryName, categories: subcategories });
        console.log('Esiste subcategory e passo: ' + id + ' - nome cat: ' + categoryName)
        console.log('Esiste subcategory e passo  Oggetto subcategories: ', subcategories)


      } else {

        this.navCtrl.push(ProductsByCategoryPage, { id: id, categoryName: categoryName });
      }
    });

  }

  goToViewAllInProductsByCategory(id: number, categoryName: string) {
    this.navCtrl.push(ProductsByCategoryPage, { id: this.category_id, categoryName: this.category_name });
    console.log('goToViewAllInProductsByCategory (categories.ts) ', { id: this.category_id })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  launchWishlist() {
    this.navCtrl.push(WishlistPage);
  }

}
