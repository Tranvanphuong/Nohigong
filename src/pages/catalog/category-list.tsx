import CategoryTabs from "@/components/category-tabs";
import SearchBar from "@/components/search-bar";
import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { categoriesState } from "@/state";
import ProductGrid from "@/components/product-grid";
import { productsState } from "@/state";
import ProductFilter from "@/components/product-filter";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const categories = useAtomValue(categoriesState);

  return (
    <>
      <div className="py-2">
        <SearchBar onClick={() => navigate("/search")} />
      </div>
      <ProductFilter />
      <div className="bg-background space-y-2 mt-2">
        <ProductGrid
          products={useAtomValue(productsState)}
          className="pt-4 pb-[13px]"
        />
      </div>
    </>
  );
}
