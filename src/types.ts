export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  province?: any;
  district?: any;
  ward?: any;
  hamlet?: any;
}

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
  sku_code?: string;
  brand_name?: string;
  instock?: number;
}

export interface Color {
  name: string;
  hex: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Cart {
  id: number;
  product: Product;
  quantity: number;
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

export interface InventoryItemCategoryResponse {
  Total: number;
  Data: InventoryItemCategory[];
  Empty: boolean;
}
