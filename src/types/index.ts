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