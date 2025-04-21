import { atom } from "jotai";
import { post } from "@/utils/request";
import { Product, InventoryItemCategory } from "@/types";

// State cho danh mục sản phẩm
export const inventoryCategoriesState = atom<InventoryItemCategory[]>([]);
export const selectedInventoryCategoryState = atom<InventoryItemCategory | undefined>(undefined);

// State cho danh sách sản phẩm ở trang danh mục
export const catalogProductsState = atom(async () => {
  try {
    const response = await post<{ Data: Product[] }>(
      "dimob/InventoryItems/list",
      {
        skip: 0,
        take: 50,
        sort: '[{"property":"106","desc":false}]',
        filter: '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
        emptyFilter: "",
        columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
        view: 1,
      }
    );

    return response.Data;
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    return [];
  }
});

// State cho danh sách sản phẩm đã lọc ở trang danh mục
export const filteredCatalogProductsState = atom(async (get) => {
  const products = await get(catalogProductsState);
  const selectedCategory = get(selectedInventoryCategoryState);
  
  if (!selectedCategory) return products;

  return products.filter(product => 
    product.inventory_item_category_name === selectedCategory.item_category_name
  );
}); 