import { Product } from "@/types";
import { services } from "./services";

export const productService = {
  // Lấy danh sách sản phẩm cho trang chủ
  getHomeProducts: async (): Promise<Product[]> => {
    try {
      const response = await services.inventory.getInventoryItems();
      if (response && response.Data) {
        // Transform data to match Product interface
        return response.Data.map((item: any) => ({
          id: item.inventory_item_id,
          name: item.inventory_item_name,
          price: item.unit_price,
          image: item.file_name || '',
          category_id: item.inventory_item_category_id,
          description: item.description
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch home products:', error);
      return [];
    }
  },

  // Lấy danh sách sản phẩm cho trang danh mục
  getCatalogProducts: async (categoryId?: string): Promise<Product[]> => {
    try {
      const response = await services.inventory.getInventoryItems({
        inventory_item_category_id: categoryId
      });
      if (response && response.Data) {
        // Transform data to match Product interface
        return response.Data.map((item: any) => ({
          id: item.inventory_item_id,
          name: item.inventory_item_name,
          price: item.unit_price,
          image: item.file_name || '',
          category_id: item.inventory_item_category_id,
          description: item.description
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch catalog products:', error);
      return [];
    }
  }
}; 