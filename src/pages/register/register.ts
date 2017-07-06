import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { EurofoodUsers } from '../../providers/eurofood-users';
import { User } from '../../models/user';
import { HomePage } from '../home/home';
import { RegisterAddressPage } from '../register-address/register-address';

import { Localstorage } from '../../providers/localstorage';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

// import { xml2js } from 'xml2js';
// declare var require: any;


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;

  // registerCredentials = { email: '', password: ''};
  registerCredentials: any;

  id: any;

  currentUser: User;

  constructor(
    private nav: NavController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    public http: Http,
    public eurofoodUsers: EurofoodUsers,
    private localstorage: Localstorage
  ) {
    this.registerCredentials = {}
    this.registerCredentials.first_name = "";
    this.registerCredentials.last_name = "";
    this.registerCredentials.email = "";
    this.registerCredentials.password = "";
  }


  // ionViewDidLoad() {
  register() {
    let headers = new Headers();
    headers.append('Content-Type', 'text/xml');

    let body =
      "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
      "<customer>" +
      "<id_default_group>3</id_default_group>" +
      "<id_lang>1</id_lang>" +
      "<passwd>" + this.registerCredentials.password + "</passwd>" +
      "<lastname>" + this.registerCredentials.last_name + "</lastname>" +
      "<firstname>" + this.registerCredentials.first_name + "</firstname>" +
      "<email>" + this.registerCredentials.email + "</email>" +
      "<active>1</active>" +
      "</customer>" +
      "</prestashop>";

    // let body =
    //   "<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">" +
    //   "<customer>" +
    //   "<passwd>test2</passwd>" +
    //   "<lastname>Testdue</lastname>" +
    //   "<firstname>Webservicedue</firstname>" +
    //   "<email>test@test.it</email>" +
    //   "</customer>" +
    //   "</prestashop>";
    console.log(body)

    // this.http.post('http://www.nebula-projects.com/prestashop/api/customers?schema=blank&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', JSON.stringify(body), {headers: headers})
    this.http.post('http://www.nebula-projects.com/prestashop/api/customers?schema=blank&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN', body, { headers: headers })
      // .map(res => res.json())
      // .map(res => JSON.parse(xml2js(res.text(),'  ')))

      // .map(res => res.text())
      // .subscribe(data => {
      .subscribe(data => {
        // console.log('risultati ottenuti');
        console.log(data);
        console.log('status: ', data.status);

        var parser = new DOMParser();
        var xmlData = parser.parseFromString(data.text(), "application/xml");
        console.log(xmlData);

        // for (var i = 0; i <= xmlData.childNodes.length; i++) {
        this.id = xmlData.getElementsByTagName('id')[0].childNodes[0].nodeValue;
        // this.desc = newFormat.getElementsByTagName('desc')[i].childNodes[0].nodeValue;
        console.log('Id Nuovo Utente', this.id);

        if (this.id) {
          
          this.eurofoodUsers.customerRegistration(this.id).subscribe(user => {
            this.showPopup("Complimenti", "Account creato.");

            this.currentUser = user;

            console.log(user);

            if (user) {

              
              this.localstorage.login(this.currentUser);
              this.nav.setRoot(RegisterAddressPage)


            }
          });


        }


        // }

        // Trasforma xml in Object
        // let xml = data;
        // let parseString = require('xml2js').parseString;
        //   parseString(xml, function (err, result) {
        //     console.dir(result);
        //   });
      });
    console.log('ho chiamato .... ')
    // Tentativo di accedere all'elemento id 
    // let xml: XMLDocument;
    // let element = <Element> xml.getElementsByTagName('id')[0];
    // element.getAttribute('attr'); /* no error */
    // console.log(element);

  } /* end register */

    onAddressRegistration () {
      this.nav.push(RegisterAddressPage);
  }

  // public register() {
  //   this.auth.register(this.registerCredentials).subscribe(success => {
  //     if (success) {
  //       this.createSuccess = true;
  //       this.showPopup("Complimenti", "Account creato.");
  //     } else {
  //       this.showPopup("Errore", "Impossibile creare un account.");
  //     }
  //   },
  //     error => {
  //       this.showPopup("Errore", error);
  //     });
  // }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
}