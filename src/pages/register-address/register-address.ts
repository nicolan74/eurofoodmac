import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Http, Headers } from '@angular/http';
import { Localstorage } from '../../providers/localstorage';
import { User } from '../../models/user';

import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/*
  Generated class for the RegisterAddress page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register-address',
  templateUrl: 'register-address.html'
})
export class RegisterAddressPage {
  signup: { company?: string, vatnumber?: string, address?: string, postcode?: number, city?: string, idstate?: number, phone?: number, phonemobile?: number } = {};
  submitted = false;

  currentUser: User;
  addressId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private localstorage: Localstorage,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,

  ) { }

  ngAfterViewInit() {
    this.localstorage.hasLoggedIn().then((hasLoggedIn) => {
      this.getCurrentUser();
    });
  }
  getCurrentUser() {
    this.localstorage.getCurrentUser().then((currentuser) => {
      // this.username = username;
      this.currentUser = currentuser
      let currentUserId = this.currentUser.id;
      console.log('Current User ID - get in register address', currentUserId)

    });
  }
  // showSelectValue(mySelect) {
  //   console.log(mySelect);
  // }

  onChange(idstate) {

    // console.info("Selected:", idstate);
    this.signup.idstate = idstate;
    console.log("Selected:", this.signup.idstate)
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {

      let company = this.signup.company;
      console.log('Company: ', company)

      let vatnumber = this.signup.vatnumber;
      console.log('Vat Number: ', vatnumber)

      let address = this.signup.address;
      console.log('Indirizzo: ', address)

      let postcode = this.signup.postcode;
      console.log('Post Code: ', postcode)

      let city = this.signup.city;
      console.log('Città: ', city)


      let idstate = this.signup.idstate;
      console.log('Id State: ', idstate)

      let phone = this.signup.phone;
      console.log('Phone: ', phone)

      let phonemobile = this.signup.phonemobile;
      console.log('Mobile: ', phonemobile)

      let headers = new Headers();
      headers.append('Content-Type', 'text/xml');

      let body =
        "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
        "<address>" +
        "<id></id>" +
        "<id_customer>" + this.currentUser.id + "</id_customer>" +
        "<id_manufacturer></id_manufacturer>" +
        "<id_supplier></id_supplier>" +
        "<id_warehouse></id_warehouse>" +
        "<id_country>10</id_country>" +
        "<id_state>" + this.signup.idstate + "</id_state>" +
        "<alias>" + this.currentUser.firstname + this.currentUser.lastname + "</alias>" +
        "<company>" + this.signup.company + "</company>" +
        "<lastname>" + this.currentUser.lastname + "</lastname>" +
        "<firstname>" + this.currentUser.firstname + "</firstname>" +
        "<vat_number>" + this.signup.vatnumber + "</vat_number>" +
        "<address1>" + this.signup.address + "</address1>" +
        "<address2></address2>" +
        "<postcode>" + this.signup.postcode + "</postcode>" +
        "<city>" + this.signup.city + "</city>" +
        "<other></other>" +
        "<phone>" + this.signup.phone + "</phone>" +
        "<phone_mobile>" + this.signup.phonemobile + "</phone_mobile>" +
        "<dni></dni>" +
        "<deleted></deleted>" +
        "<date_add></date_add>" +
        "<date_upd></date_upd>" +
        "</address>" +
        "</prestashop>";

      console.log('Xml Address Request ', body)

      // Create the Loading popup
      let loadingPopup = this.loadingCtrl.create({
        content: 'Sending data...'
      });
      // Show the popup
      loadingPopup.present();

      this.http.post('http://www.nebula-projects.com/prestashop/api/addresses?schema=blank&display=full&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', body, { headers: headers })
        .subscribe(data => {
          // console.log('risultati ottenuti');
          console.log(data);
          console.log('status: ', data.status);

          loadingPopup.dismiss();

          var parser = new DOMParser();
          var xmlData = parser.parseFromString(data.text(), "application/xml");
          console.log(xmlData);

          this.addressId = xmlData.getElementsByTagName('id')[0].childNodes[0].nodeValue;

          console.log('Id Nuovo Indirizzo', this.addressId);

          if (this.addressId) {
            let alert = this.alertCtrl.create({
              title: 'Dati aggiornati',
              subTitle: 'Il suo profilo è stato aggiornato',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    console.log('Ok clicked');
                    this.navCtrl.setRoot(HomePage)

                  }
                },
              ]
            });
            alert.present();

            // this.navCtrl.setRoot(HomePage)
          }

        }); // end subscribe data

    } // end if form valid
  } // end onSignup



  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAddressPage');
  }

}
