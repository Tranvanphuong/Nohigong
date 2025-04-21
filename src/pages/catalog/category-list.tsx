import CategoryTabs from "@/components/category-tabs";
import SearchBar from "@/components/search-bar";
import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { filteredCatalogProductsState, selectedInventoryCategoryState } from "@/state/catalog.state";
import ProductGrid from "@/components/product-grid";
import ProductFilter from "@/pages/catalog/product-filter";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const products = useAtomValue(filteredCatalogProductsState);
  const selectedCategory = useAtomValue(selectedInventoryCategoryState);

  return (
    <>
      <div className="py-2">
        <SearchBar onClick={() => navigate("/search")} />
      </div>
      {/* <CategoryTabs /> */}
      <ProductFilter />
      <div className="bg-background space-y-2 mt-2">
        <ProductGrid 
          products={products}
          className="pt-4 pb-[13px]" 
        />
      </div>
    </>
  );
}
