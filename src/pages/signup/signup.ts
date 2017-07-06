import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { EurofoodUsers } from '../../providers/eurofood-users';
import { User } from '../../models/user';
import { Http, Headers } from '@angular/http';

import { Localstorage } from '../../providers/localstorage';
import { RegisterAddressPage } from '../register-address/register-address';
import { SignUpCompanyPage } from '../sign-up-company/sign-up-company';

import { HomePage } from '../home/home';
import { PrestaShopApi } from '../../providers/prestashop-api-endpoint';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  loading: Loading;
  currentUser?: User;
  id: any;

  identificationDataForm: FormGroup;
  loginCredentialsForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public eurofoodUsers: EurofoodUsers,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public http: Http,
    private localstorage: Localstorage,
    private psApi: PrestaShopApi
  ) {

    // this.registrationForm = formBuilder.group({
    //   firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    //   lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    //   email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50),Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
    //   password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    // });

    this.identificationDataForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(2), Validators.pattern('[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ]*'), Validators.required])],
      // 'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      // 'password': ['', Validators.compose([Validators.minLength(5), Validators.required])],

    });

    this.loginCredentialsForm = formBuilder.group({

      // email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i), Validators.required])],
      email: ['', Validators.compose([Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-]+)*@([a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?/), Validators.required])],

      password: ['', Validators.compose([Validators.minLength(5), Validators.required])],
      privacy: [false, Validators.required],
    });

    // Sottoscivo all checkbox per vedere perchè anche se non ceccata permette di eseguire il submit
    this.loginCredentialsForm.valueChanges.subscribe(v => {
      console.log('Required validation failed: ' + this.loginCredentialsForm.controls['privacy'].hasError('required'));
      console.log('Required validation touched: ' + this.loginCredentialsForm.controls['privacy'].touched);
      console.log('Required validation status: ' + this.loginCredentialsForm.controls['privacy'].status);
    });

  }

  // onPrivacyChecked($event) {
  //   if (!$event.checked) {
  //     this.slideTwoForm.patchValue({ privacy: null });
  //   }
  // }

  save() {

    this.submitAttempt = true;

    if (!this.identificationDataForm.valid) {

      console.log('No success Form One')
    } else if (!this.loginCredentialsForm.valid) {

      console.log('No success Form Two')
    } else {

      console.log("success!")
      let email = this.loginCredentialsForm.value.email;
      console.log(email);
      console.log('One Form', this.identificationDataForm.value);
      console.log('Two Form', this.loginCredentialsForm.value);

      // this.showLoading()
      // Create the Loading popup
      let loadingPopup = this.loadingCtrl.create({
        content: 'Checking data...'
      });
      // Show the popup
      loadingPopup.present();

      this.eurofoodUsers.checkEmail(email)
        .subscribe(user => {
          loadingPopup.dismiss();

          if (user) {

            console.log('email in uso')

            let alert = this.alertCtrl.create({
              title: 'Attenzione!',
              subTitle: 'Email già in uso',
              buttons: ['OK']
            });
            alert.present();

            this.loginCredentialsForm.reset();

          } else {

            console.log('email NON in uso. Procedo con la Registrazione')
            let headers = new Headers();
            headers.append('Content-Type', 'text/xml');

            let body =
              "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
              "<customer>" +
              "<id_default_group>3</id_default_group>" +
              "<id_lang>1</id_lang>" +
              "<newsletter_date_add>0000-00-00 00:00:00</newsletter_date_add>" +
              "<ip_registration_newsletter></ip_registration_newsletter>" +
              "<last_passwd_gen></last_passwd_gen>" +
              "<secure_key></secure_key>" +
              "<deleted>0</deleted>" +
              "<passwd>" + this.loginCredentialsForm.value.password + "</passwd>" +
              "<lastname>" + this.identificationDataForm.value.lastName + "</lastname>" +
              "<firstname>" + this.identificationDataForm.value.firstName + "</firstname>" +
              "<email>" + this.loginCredentialsForm.value.email + "</email>" +
              "<id_gender>0</id_gender>" +
              "<birthday></birthday>" +
              "<newsletter>0</newsletter>" +
              "<optin>0</optin>" +
              "<website></website>" +
              "<company></company>" +
              "<siret></siret>" +
              "<ape></ape>" +
              "<active></active>" +
              "<is_guest>0</is_guest>" +
              "<id_shop>1</id_shop>" +
              "<id_shop_group>1</id_shop_group>" +
              "<associations>" +
              "<groups>" +
              "<group>" +
              "<id>3</id>" +
              "</group>" +
              "</groups>" +
              "</associations>" +
              "</customer>" +
              "</prestashop>";
            console.log('Xml Registration request', body)

            // Create the Loading popup
            let loadingPopup = this.loadingCtrl.create({
              content: 'Sending data...'
            });
            // Show the popup
            loadingPopup.present();
            // this.http.post('http://www.nebula-projects.com/prestashop/api/customers?schema=blank&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', body, { headers: headers })
            this.http.post(this.psApi.psShopHostName + "/customers?schema=blank&ws_key=" + this.psApi.psWsKey, body, { headers: headers })
              .subscribe(data => {
                // console.log('risultati ottenuti');
                console.log('Subscribed data: ', data);
                console.log('status: ', data.status);

                loadingPopup.dismiss();

                var parser = new DOMParser();
                var xmlData = parser.parseFromString(data.text(), "application/xml");
                console.log('XML DATA: ', xmlData);

                // for (var i = 0; i <= xmlData.childNodes.length; i++) {
                this.id = xmlData.getElementsByTagName('id')[0].childNodes[0].nodeValue;
                // this.desc = newFormat.getElementsByTagName('desc')[i].childNodes[0].nodeValue;
                console.log('Id Nuovo Utente', this.id);
                // se esiste un id del customer (di ritorno dalla registrazione)
                // con lo stesso filtro i customer per ottenere l'utente appena registrato
                if (this.id) {

                  this.eurofoodUsers.customerRegistration(this.id).subscribe(user => {

                    // let alert = this.alertCtrl.create({
                    //   title: 'Complimenti',
                    //   subTitle: 'Registrazione completata',
                    //   buttons: ['OK']
                    // });

                    // alert.present();

                    this.currentUser = user;

                    console.log(user);

                    // ottenuto l'utente con l'id della registrazione lo rimando alla funzione che logga (in localstorage)
                    if (user) {

                      this.localstorage.login(this.currentUser);
                      // this.navCtrl.push(RegisterAddressPage)
                      /**
                       * se esiste l'oggetto user push la pagina di registrazuine dati aziendali
                       */
                      this.navCtrl.push(SignUpCompanyPage)
                      
                      let confirm = this.alertCtrl.create({
                        title: 'Account creato!',
                        message: "Abbiamo inviato un email di verifica a <strong>"+ this.loginCredentialsForm.value.email +"</strong><br>Controlla i tuoi messaggi e fai click sul link dell’email per verificare l’indirizzo ed essere abilitato agli acquisti.<br> <br>Per completare un ordine è comunque necessario che ci fornisca i dati della tua azienda compilando questo form.",
                        buttons: [
                          {
                            text: 'Lo faccio in seguito',
                            handler: () => {
                              console.log('Salta clicked');
                              this.navCtrl.setRoot(HomePage)

                            }
                          },
                          {
                            text: 'Ok',
                            handler: () => {
                              console.log('Ok clicked');
                              // this.navCtrl.push(RegisterAddressPage)
                            }
                          }
                        ]
                      });
                      confirm.present();



                    }
                  });

                }

              }); // end subscibe data

          }

        }); // end subscibe user
    }

  }

  onAddressRegistration() {
    this.navCtrl.push(RegisterAddressPage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }


}
