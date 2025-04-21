import { useAtom } from "jotai";
import { productFilterState } from "@/state";

const PRODUCT_CATEGORIES = [
  { id: "dry", name: "Đồ ăn khô" },
  { id: "clothes", name: "Quần áo" },
  { id: "shoes", name: "Giày dép" },
];

export default function ProductFilter() {
  const [filter, setFilter] = useAtom(productFilterState);

  const handleFilterClick = (categoryId: string) => {
    if (filter === categoryId) {
      // Nếu click vào nút đang được chọn thì reset filter
      setFilter("");
    } else {
      setFilter(categoryId);
    }
  };

  return (
    <div className="bg-white px-4 py-2">
      {/* <div className="text-sm font-medium mb-2">Nhóm hàng hóa</div> */}
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleFilterClick(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 