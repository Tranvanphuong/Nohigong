import { Select } from "@/components/lazyloaded";
import { SelectSkeleton } from "@/components/skeleton";
import { useAtom, useAtomValue } from "jotai";
import { Suspense, useEffect, useState } from "react";
import {
  inventoryCategoriesState,
  selectedInventoryCategoryState
} from "@/state/catalog.state";
import { InventoryItemCategory } from "@/types";
import { services } from "@/services/services";

export default function ProductFilter() {
  const [categories, setCategories] = useAtom(inventoryCategoriesState);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedInventoryCategoryState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await services.category.getCategories();
        console.log('Categories response:', response); // Log để kiểm tra dữ liệu
        if (response && response.Data) {
          setCategories(response.Data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setCategories]);

  const handleCategoryChange = (category: InventoryItemCategory | undefined) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <div className="px-4 py-3">Đang tải danh mục...</div>;
  }

  return (
    <div className="flex px-4 py-3 space-x-2 overflow-x-auto">
      <Suspense fallback={<SelectSkeleton width={110} />}>
        <Select
          items={categories}
          value={selectedCategory}
          onChange={handleCategoryChange}
          renderTitle={(category?: InventoryItemCategory) =>
            `Nhóm hàng${category ? `: ${category.item_category_name}` : ""}`
          }
          renderItemLabel={(category: InventoryItemCategory) => category.item_category_name}
          renderItemKey={(category: InventoryItemCategory) => category.inventory_item_category_id}
        />
      </Suspense>
      {selectedCategory && (
        <button
          className="bg-primary text-white rounded-full h-8 flex-none px-3"
          onClick={() => {
            setSelectedCategory(undefined);
          }}
        >
          Xoá bộ lọc
        </button>
      )}
    </div>
  );
}
