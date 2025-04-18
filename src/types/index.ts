export interface Product {
  sku_code: string;
  brand_name: string | null;
  inventory_item_name: string;
  unit_price: number;
  unit_name: string | null;
  inventory_item_type: number;
  inactive: boolean;
  inventory_item_category_name: string | null;
  vendor_name_list: string | null;
  minimum_instock: number;
  inventory_item_id: string;
  length: number | null;
  width: number | null;
  height: number | null;
  file_name: string | null;
}

export interface GetUserInfoReturns {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  points: number;
}

export type Size = string;

export interface Color {
  name: string;
  hex: string;
}

export interface SelectedOptions {
  size?: string;
  color?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  options: SelectedOptions;
  quantity: number;
}

export type Cart = CartItem[];
