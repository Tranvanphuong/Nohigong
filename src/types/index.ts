export interface Product {
  inventory_item_id: string;
  inventory_item_name: string;
  unit_price: number;
  file_name: string | null;
  inventory_item_category_name: string;
  inventory_item_category_id: string;
  color?: string;
  size?: string;
  description?: string;
  properties?: {
    inventory_item_property_id: string;
    inventory_item_id: string;
    property_id: string;
    property_name: string;
    inventory_item_property_value: string;
    sort_order: number;
    attribute_group_type: number;
    created_date: string;
    modified_by: string;
    modified_date: string;
  }[];
  classifies?: Classify[];
  sku_code?: string;
  brand_name?: string;
  instock?: number;

  barcode?: string;
}

export interface InventoryItemCategory {
  inventory_item_category_id: string;
  item_category_name: string;
  item_category_code: string;
  parent_id: string | null;
  description: string | null;
  misa_code: string;
  grade: number;
  is_leaf: boolean;
  is_parent: boolean;
  inactive: boolean;
  branch_id: string;
  inventory_item_category_name_hash: string;
  inventory_item_category_name: string;
  tax_rate: number | null;
  created_date: string;
  parent_name: string;
  parent_code: string | null;
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

export interface Category {
  id: number;
  name: string;
}

export interface Classify {
  inventory_item_id: string;
  inventory_item_name: string;
  property_id: string;
  property_name: string;
  property_value: string;
  sort_order: number;
  created_date: string;
  modified_by: string;
  modified_date: string;
  properties?: {
    inventory_item_property_id: string;
    inventory_item_id: string;
    property_id: string;
    property_name: string;
    inventory_item_property_value: string;
    sort_order: number;
    attribute_group_type: number;
    created_date: string;
    modified_by: string;
    modified_date: string;
  }[];
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
  variant?: {
    inventory_item_id: string;
    inventory_item_name: string;
  } | null;
}

export type Cart = CartItem[];
