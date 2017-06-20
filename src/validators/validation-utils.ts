import { FormControl } from '@angular/forms';

export class ValidationUtils {


    static checkPIVA(control: FormControl) {
        // if (control.value == '') {

        //     return {
        //         "checkPIVA": true
        //     };
        // }


        if (control.value.length != 11) {
            return {
                "checkPIVA": true
            };
        }


        let validi = "0123456789";
        let i = 0
        for (i = 0; i < 11; i++) {
            if (validi.indexOf(control.value.charAt(i)) == -1) {
                return {
                    "checkPIVA": true
                };

            }

        }
        console.log('P IVA CHECK')
        console.log('Control value ', control.value)
        let s = 0;
        for (let i = 0; i <= 9; i += 2)
            s += control.value.charCodeAt(i) - '0'.charCodeAt(0);
        for (let i = 1; i <= 9; i += 2) {
            let c = 2 * (control.value.charCodeAt(i) - '0'.charCodeAt(0));
            if (c > 9) c = c - 9;
            s += c;
        }
        if ((10 - s % 10) % 10 != control.value.charCodeAt(10) - '0'.charCodeAt(0)) {
            return {
                "checkPIVA": true
            };

        } else {


            return null
        }
    }


}