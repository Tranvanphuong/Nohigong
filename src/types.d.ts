export interface Product {
  sku_code: string;
  brand_name: string;
  inventory_item_name: string;
  unit_price: number;
  unit_name: string;
  inventory_item_type: number;
  inactive: boolean;
  inventory_item_category_name: string | null;
  vendor_name_list: string[] | null;
  minimum_instock: number;
  inventory_item_id: string;
  length: number;
  width: number;
  height: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Detail {
  title: string;
  content: string;
}
export type Size = string;

export interface Color {
  name: string;
  hex: string;
}

export type SelectedOptions = {
  size?: Size;
  color?: Color["name"];
};

export interface CartItem {
  id: number;
  product: Product;
  options: SelectedOptions;
  quantity: number;
}

export type Cart = CartItem[];
