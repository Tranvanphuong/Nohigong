import { useNavigate } from "react-router-dom";
import Banners from "./banners";
import SearchBar from "../../components/search-bar";
import Category from "./category";
import FlashSales from "./flash-sales";
import HorizontalDivider from "@/components/horizontal-divider";
import CategoryTabs from "@/components/category-tabs";
import CustomApiExample from "@/components/CustomApiExample";
import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { homeProductsState } from "@/state/home.state";
import { Suspense } from "react";

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const products = useAtomValue(homeProductsState);

  return (
    <div className="min-h-full bg-section">
      <div className="bg-background pt-2">
        <SearchBar onClick={() => navigate("/search")} />
        <Banners />
      </div>
      <div className="bg-background space-y-2 mt-2">
        {/* <CategoryTabs /> */}
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid
            products={products}
            className="pt-4 pb-[13px]"
          />
        </Suspense>
      </div>
      <HorizontalDivider />

      <div className="mt-4">
        <CustomApiExample />
      </div>
    </div>
  );
};

export default HomePage;
