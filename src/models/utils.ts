// import { FormControl } from '@angular/forms';

export class Utils {

    // prende una stringa e restituisce un booleano
    static checkPIVA(piva: string): boolean {
        if (piva == '')
            return false;

        if (piva.length != 11)
            return false;

        let validi = "0123456789";
        let i = 0
        for (i = 0; i < 11; i++) {
            if (validi.indexOf(piva.charAt(i)) == -1)
                return false;
        }

        let s = 0;
        for (i = 0; i <= 9; i += 2)
            s += piva.charCodeAt(i) - '0'.charCodeAt(0);
        for (i = 1; i <= 9; i += 2) {
            let c = 2 * (piva.charCodeAt(i) - '0'.charCodeAt(0));
            if (c > 9) c = c - 9;
            s += c;
        }
        if ((10 - s % 10) % 10 != piva.charCodeAt(10) - '0'.charCodeAt(0))
            return false;


        return true
    }

}