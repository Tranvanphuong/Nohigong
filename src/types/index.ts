export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category_id?: string;
  // Thêm các trường khác nếu cần
}

export interface InventoryItemCategory {
  inventory_item_category_id: string;
  item_category_name: string;
  // Thêm các trường khác nếu cần
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
