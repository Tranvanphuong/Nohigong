import { atom } from "jotai";
import { InventoryItemCategory } from "@/services/services";

// State cho danh mục
export const categoriesState = atom<InventoryItemCategory[]>([]);
export const selectedCategoryState = atom<InventoryItemCategory | undefined>(undefined);

// State cho sản phẩm ở trang chủ
export const homeProductsState = atom<any[]>([]);

// State cho sản phẩm ở trang danh mục
export const catalogProductsState = atom<any[]>([]); 