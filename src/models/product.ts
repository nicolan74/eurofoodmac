// Product model based on the structure of prestashop api
export interface Product {
  id: number;
  name: string;
  id_default_image: number;

  // id_NO_default_image: number;
  hasImage: any;

  price: number;
  unit_price_ratio: number;
  unity: string;
  price_for_unit: number;

  description: string;
  description_stripped_tags: string;

  level_depth: number;
  id_parent: number;
  stock_available: number;
  id_tax_rules_group: number;

  tax_rule_name: string;

  percentTax_rule: number;
  priceTaxInc: number;
  priceTaxEscl: number;
  reference: string;
  offerProduct_Id: number;

  reduction: number;
  discountedPrice: number;
  discountAmount: number;
  id_category_default: number;

  id_category_in_nested_object: number;
  category_name_in_nested_object: string;

  qty: number;

  id_product_in_nested_obj: number;

  product_category_name: number;
}