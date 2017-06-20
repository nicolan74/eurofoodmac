// Order model based on the structure of prestashop api
export interface Order {
  id: number;
  id_customer: number;
  current_state: number;
  date_add: any;
  total_paid: number;
  total_products: number;
  name: string;
  orderstatecolor: string;
  product_name: string;
  product_price: number;
  product_quantity: number;
  unit_price_tax_incl: number;
  total_price_tax_incl: number;

}