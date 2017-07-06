// User model based on the structure of prestashop api at
// http://www.nebula-projects.com/prestashop/api/customers?output_format=JSON&display=full&ws_key=IFYR4IX1YJ3I9WYF2IKZKNC26FUIJPWN
export interface User {

  id: number;
  lastname: string;
  firstname: string;
  email: string;
  passwd: string;
  secure_key: any;
  active: any;
   
}