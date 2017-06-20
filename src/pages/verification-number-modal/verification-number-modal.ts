import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*
  Generated class for the VerificationNumberModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-verification-number-modal',
  templateUrl: 'verification-number-modal.html'
})
export class VerificationNumberModalPage {
  
  verifyCodeForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    
    
    ) {

    this.verifyCodeForm = formBuilder.group({

       code: ['', Validators.compose([Validators.minLength(5), Validators.required])],

    });


  }

save() {
   this.submitAttempt = true;

    if (this.verifyCodeForm.valid) {

      let code = this.verifyCodeForm.value.code;
    }

}
  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificationNumberModalPage');
  }

}
