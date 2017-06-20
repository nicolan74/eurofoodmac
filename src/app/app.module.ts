import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { UsersPage } from '../pages/users/users';
import { ReposPage } from '../pages/repos/repos';

import { UserDetailsPage } from '../pages/user-details/user-details';


import { Storage } from '@ionic/storage';
import { Localstorage } from '../providers/localstorage';


import { ProductsPage } from '../pages/products/products';
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { CategoriesPage } from '../pages/categories/categories';
import { ProductsByCategoryPage } from '../pages/products-by-category/products-by-category';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { RegisterPage } from '../pages/register/register';
import { OrdersPage } from '../pages/orders/orders';
import { OrderDetailsPage } from '../pages/order-details/order-details';
import { SignupPage } from '../pages/signup/signup';

import { RegisterAddressPage } from '../pages/register-address/register-address';
import { SignUpCompanyPage } from '../pages/sign-up-company/sign-up-company';
import { SubOffertePage } from '../pages/sub-offerte/sub-offerte';

import { VerificationNumberModalPage } from '../pages/verification-number-modal/verification-number-modal';

import { EurofoodUsers } from '../providers/eurofood-users';
import { PrestashopProducts } from '../providers/prestashop-products';
import { EurofoodCategories } from '../providers/eurofood-categories';
import { WishlistService } from '../providers/wishlist-service';
import { EurofoodCustomerOrders } from '../providers/eurofood-customer-orders';
import { EurofoodCustomerAddress } from '../providers/eurofood-customer-address';
import { PhoneNumberVerification } from '../providers/phone-number-verification';

import { PrestaShopApi } from '../providers/prestashop-api-endpoint';

import { ProductImgModalPage } from '../pages/product-img-modal/product-img-modal';

@NgModule({
  declarations: [
    MyApp,
    UsersPage,
    ReposPage,
    VerificationNumberModalPage,
    UserDetailsPage,
    ProductsPage,
    ProductDetailsPage,
    CategoriesPage,
    ProductsByCategoryPage,
    WishlistPage,
    HomePage,
    SearchPage,
    LoginPage,
    RegisterPage,
    OrdersPage,
    OrderDetailsPage,
    SignupPage,
    RegisterAddressPage,
    SignUpCompanyPage,
    SubOffertePage,
    ProductImgModalPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UsersPage,
    ReposPage,
    VerificationNumberModalPage,
    UserDetailsPage,
    ProductsPage,
    ProductDetailsPage,
    CategoriesPage,
    ProductsByCategoryPage,
    WishlistPage,
    HomePage,
    SearchPage,
    LoginPage,
    RegisterPage,
    OrdersPage,
    OrderDetailsPage,
    SignupPage,
    RegisterAddressPage,
    SignUpCompanyPage,
    SubOffertePage,
    ProductImgModalPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, EurofoodUsers, PrestashopProducts, EurofoodCategories, WishlistService, AuthService, EurofoodCustomerOrders, EurofoodCustomerAddress, Localstorage, Storage, PrestaShopApi, PhoneNumberVerification]
  // Add GithubUsers provider [GithubUsers] 
})
export class AppModule { }
