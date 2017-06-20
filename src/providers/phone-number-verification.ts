import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { SmsVerification } from '../models/smsVerification';



/*
  Generated class for the PhoneNumberVerification provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PhoneNumberVerification {

  constructor(public http: Http) {
    console.log('Hello PhoneNumberVerification Provider');
  }


  isAlreadyVerified(): Observable<SmsVerification[]> {
    return this.http.get(`http://script.smart21.it/ext/sms_verification/is_verified.php?user_id=Nikola_Test_2&app_id=Eurofood`)
      .map(res => <SmsVerification[]>res.json()[0]);
  }
  

  loadToken(): Observable<SmsVerification[]> {
    return this.http.get(`http://script.smart21.it/ext/sms_verification/get_token.php?user_id=Nikola_Test_3&app_id=Eurofood&recipient_number=0001122333`)
      .map(res => <SmsVerification[]>res.json()[0]);
  }

  setVerified(): Observable<SmsVerification[]> {
    return this.http.get(`http://script.smart21.it/ext/sms_verification/set_verified.php?user_id=Nikola_Test_2&app_id=Eurofood&verified=true`)
      .map(res => <SmsVerification[]>res.json()[0]);
  }

}
