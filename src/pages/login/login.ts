import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

import { EurofoodUsers } from '../../providers/eurofood-users';
import { User } from '../../models/user';
import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Localstorage } from '../../providers/localstorage';
import { NgForm } from '@angular/forms';

import { SignupPage } from '../signup/signup';
import { SignUpCompanyPage } from '../sign-up-company/sign-up-company';

import { Md5 } from 'ts-md5/dist/md5';


declare var dcodeIO: any;


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;

  // registerCredentials: any;
  login: { email?: string, password?: string } = {};
  submitted = false;

  currentUser: User;
  psw: any;
  p: string;

  // We are declaring dcodeIO as any to prevent compiler errors
  bcryptjs: any;

  public hash: string;

  public assertTrue: boolean;
  public assertFalse: boolean;

  constructor(
    private nav: NavController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public eurofoodUsers: EurofoodUsers,
    public events: Events,
    public storage: Storage,
    private localstorage: Localstorage
  ) {

    // this.p = "123456";
    // console.log('PWD PRIMA ', this.p);

    // this.registerCredentials = {}
    // this.registerCredentials.email = "";
    // this.registerCredentials.password = "";

    // let psw = Md5.hashStr(this.p);
    // console.log('PW DOPO ', psw);

    // var bcrypt = require('C:/Users/oem/ionicProject/eurofood/node_modules/bcrypt/bcrypt.js');

    // let hash = '$2y$10$XKusf73D1/vVPBMcefZh5eTP6HleVcBV/g9gzZ4YimHY2ruR.KdNS'
    // console.log('HASH ', hash)

    // if (bcrypt.compareSync('123456', hash)) {
    //   console.log('Passwords match')
    // } else {

    //   console.log('Passwords don t match')
    // }

    /**
     *  Prepare the library bcryptjs for use
     */
    this.bcryptjs = dcodeIO.bcrypt;


    // this.hash = '$2y$10$anOPyqHOOPYRZhUtaeDMMeSN.VTpHVY7LqC6rEbe/v2Y5urZIZGvS';
    // console.log('this.hash', this.hash)

    // let hashTest = this.bcryptjs.hashSync("123456", 8);
    // console.log('this.hashTEST', hashTest)

    // this.assertTrue = this.bcryptjs.compareSync("123456", this.hash);
    // this.assertFalse = this.bcryptjs.compareSync("123459", this.hash);

    // console.log('this.assertTrue ', this.assertTrue)
    // console.log('this.assertFalse ', this.assertFalse)

  } // end constructor

  setData() {
    this.storage.set('myData', 'hello');
  }

  getData() {
    this.storage.get('myData').then((data) => {
      console.log(data);
    });
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    // login() {

    if (form.valid) {
      let email = this.login.email;
      let password = this.login.password;

      console.log('Email inserita ', email)
      console.log('PW inserita ', password)

      this.showLoading()

      this.eurofoodUsers.customerAuthentication(this.login.email).subscribe(user => {

        this.currentUser = user;

        console.log('-> CUSTOMER ottenuto per l email inserita ', user);
        console.log('--> customer EMAIL ', user.email);
        console.log('---> customer FIRSTNAME', user.firstname);
        console.log('----> customer HASH PSW', user.passwd);

        let hashPsw = user.passwd

        // if (this.bcryptjs.compareSync(password, hashPsw)) {
        //   console.log('Passwords match')
        // } else {

        //   console.log('Passwords don t match')
        // }

        if ((user) && (this.bcryptjs.compareSync(password, hashPsw))) {

          // Esegue il metodo che ho dichiarato in localstorage
          this.localstorage.login(this.currentUser);

          // this.events.publish('user:logged', this.currentUser);

          setTimeout(() => {
            this.loading.dismiss();
            this.nav.setRoot(HomePage)
          });
        } else {
          this.showError("<strong>Il login non è riuscito.</strong> <br><br>Verifica l'esattezza dei dati inseriti.");
        }

      },
        error => {
          // this.showError(error);
          this.showError("Controlla le tue credenziali");
        }

      );

    }

  }

  onSignup() {
    this.nav.push(SignupPage);
  }

  onSignupCompany() {
    this.nav.push(SignUpCompanyPage);
  }

  createAccount() {
    this.nav.push(RegisterPage);
  }

  // public login() {
  //   this.showLoading()
  //   this.auth.login(this.registerCredentials).subscribe(allowed => {
  //     if (allowed) {
  //       setTimeout(() => {
  //       this.loading.dismiss();
  //       this.nav.setRoot(HomePage)
  //       });
  //     } else {
  //       this.showError("Controlla le tue credenziali");
  //     }
  //   },
  //   error => {
  //     this.showError(error);
  //   });
  // }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Attenzione!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}