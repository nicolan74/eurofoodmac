import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Localstorage } from '../../providers/localstorage';
import { User } from '../../models/user';

import { PhoneNumberVerification } from '../../providers/phone-number-verification';


// 03.05.2017
import { Utils } from '../../models/utils';
import { ValidationUtils } from '../../validators/validation-utils';

import { HomePage } from '../home/home';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

import { VerificationNumberModalPage } from '../verification-number-modal/verification-number-modal';



/*
  Generated class for the SignUpCompany page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sign-up-company',
  templateUrl: 'sign-up-company.html'
})
export class SignUpCompanyPage {

  signupCompanyForm: FormGroup;

  submitAttempt: boolean = false;

  currentUser: User;
  addressId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private localstorage: Localstorage,
    public http: Http,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private psApi: PrestaShopApi,
    private phoneNumberVerification: PhoneNumberVerification,
    public modalCtrl: ModalController

  ) {

    this.signupCompanyForm = formBuilder.group({
      // company: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[0-9a-zA-Z ]*'), Validators.required])],
      company: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[^<>;=#{}]*'), Validators.required])],

      // vatNumber: ['', Validators.compose([Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]*'), Validators.required]), ValidationUtils.isValid],
      vatNumber: ['', Validators.compose([Validators.required, Validators.pattern('(?!00000)[0-9 ]*'), ValidationUtils.checkPIVA])],
      address: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      zipCode: ['', Validators.compose([Validators.maxLength(5), Validators.minLength(5), Validators.pattern('(?!00000)[0-9 ]*'), Validators.required])],
      city: ['', Validators.compose([Validators.maxLength(35), Validators.minLength(2), Validators.pattern('[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ]*'), Validators.required])],
      idstate: ['', Validators.required],
      // phone: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(10), Validators.pattern('(?!00000)[0-9]*'), Validators.required])],
      mobilePhone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('(?!00000)[0-9]*'), Validators.required])],
    });

    // let partiva = this.signupCompanyForm.value.vatNumber
    // let checked = Utils.checkPIVA(partiva)
    // if (checked) {
    //   console.log('P Iva Ok')
    // } else {
    //   console.log('P Iva NO Ok')
    // }

  }
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
      console.log('Current User ID - get in sign-up-company', currentUserId)

    });
  }

  // Selezione provincia (on Ps' HTML is called id_state)
  onChange(idstate) {
    // console.info("Selected:", idstate);
    this.signupCompanyForm.value.idstate = idstate;
    console.log("Selected:", this.signupCompanyForm.value.idstate)
  }

  onPhoneNumberVerification() {
    

    let myModal = this.modalCtrl.create(VerificationNumberModalPage );
    myModal.present();
    let phonemobile = this.signupCompanyForm.value.mobilePhone;
    console.log ('Phone Mobile (in onPhoneNumberVer...) ', phonemobile)

    this.phoneNumberVerification.isAlreadyVerified().subscribe(verifyPhoneNumberStepOne => {
      console.log('isAlreadyVerified ', verifyPhoneNumberStepOne)
      let checkifexist_code = verifyPhoneNumberStepOne['code']
      console.log('Code_Step_1 ', checkifexist_code)

      let checkifexist_message = verifyPhoneNumberStepOne['message']
      console.log('Message_Step_1 ', checkifexist_message)

      if (checkifexist_code == 404) {

        this.phoneNumberVerification.loadToken().subscribe(verifyPhoneNumberStepTwo => {
          console.log('verifyPhoneNumberStepTwo', verifyPhoneNumberStepTwo)

          let getToken_code = verifyPhoneNumberStepTwo['code']
          console.log('Code_Step_2 ', getToken_code)

          let getToken_message = verifyPhoneNumberStepTwo['message']
          console.log('Message_Step_2 ', getToken_message)

          let getToken_token = verifyPhoneNumberStepTwo['token']
          console.log('Token ', getToken_token)

          if (getToken_token) {

            this.phoneNumberVerification.setVerified().subscribe(verifyPhoneNumberStepThree => {
              console.log('verifyPhoneNumberStepThree ', verifyPhoneNumberStepThree)
            });


          }

        });
      } // end if checkifexist_code

    });
  }

  save() {
    this.submitAttempt = true;

    let partiva = this.signupCompanyForm.value.vatNumber
    let checked = Utils.checkPIVA(partiva)
    if (checked) {
      console.log('P Iva Ok')
    } else {
      console.log('P Iva NO Ok')
    }

    if (this.signupCompanyForm.valid) {
      console.log("success!")
      console.log('Form ', this.signupCompanyForm.value);

      // console.log('Company ', this.signupCompanyForm.value.company);
      // console.log('P. IVA ', this.signupCompanyForm.value.vatNumber);
      // console.log('Indirizzo ', this.signupCompanyForm.value.address);
      // console.log('Cap ', this.signupCompanyForm.value.zipCode);
      // console.log('City ', this.signupCompanyForm.value.city);
      // console.log('Provincia ', this.signupCompanyForm.value.idstate);
      // // console.log('Telefono ', this.signupCompanyForm.value.phone);
      // console.log('Cellulare', this.signupCompanyForm.value.mobilePhone);

      let company = this.signupCompanyForm.value.company;
      console.log('Company: ', company)

      let vatnumber = this.signupCompanyForm.value.vatNumber;
      console.log('Vat Number: ', vatnumber)

      let address = this.signupCompanyForm.value.address;
      console.log('Indirizzo: ', address)

      let postcode = this.signupCompanyForm.value.zipCode;
      console.log('Post Code: ', postcode)

      let city = this.signupCompanyForm.value.city;
      console.log('Città: ', city)

      let idstate = this.signupCompanyForm.value.idstate;
      console.log('Id State: ', idstate)

      // let phone = this.signup.phone;
      // console.log('Phone: ', phone)

      let phonemobile = this.signupCompanyForm.value.mobilePhone;
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
        "<id_state>" + idstate + "</id_state>" +
        "<alias>" + this.currentUser.firstname + " " + this.currentUser.lastname + "</alias>" +
        "<company>" + company + "</company>" +
        "<lastname>" + this.currentUser.lastname + "</lastname>" +
        "<firstname>" + this.currentUser.firstname + "</firstname>" +
        "<vat_number>" + vatnumber + "</vat_number>" +
        "<address1>" + address + "</address1>" +
        "<address2></address2>" +
        "<postcode>" + postcode + "</postcode>" +
        "<city>" + city + "</city>" +
        "<other></other>" +
        "<phone>" + phonemobile + "</phone>" +
        "<phone_mobile>" + phonemobile + "</phone_mobile>" +
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

      // this.http.post('http://www.nebula-projects.com/prestashop/api/addresses?schema=blank&display=full&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', body, { headers: headers })
      this.http.post(this.psApi.psShopHostName + "/addresses?schema=blank&display=full&ws_key=" + this.psApi.psWsKey, body, { headers: headers })

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
              subTitle: 'Il tuo profilo è stato aggiornato',
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

    } // end this.signupCompanyForm.valid
  } // end On SAVE

  ionViewDidLoad() {

    
    console.log('ionViewDidLoad SignUpCompanyPage');

  }

}
