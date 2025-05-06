import { useNavigate } from "react-router-dom";
import Banners from "./banners";
import SearchBar from "../../components/search-bar";
import Category from "./category";
import FlashSales from "./flash-sales";
import HorizontalDivider from "@/components/horizontal-divider";
import CategoryTabs from "@/components/category-tabs";
import CustomApiExample from "@/components/CustomApiExample";
import ProductGrid from "@/components/product-grid";
import { useAtom, useAtomValue } from "jotai";
import {
  homeHasMoreState,
  homeLoadingState,
  homeProductsState,
  initHomeProductsAction,
  loadMoreHomeProductsAction,
} from "@/state/home.state";
import { Suspense, useEffect, useRef } from "react";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const products = useAtomValue(homeProductsState);
  const isLoading = useAtomValue(homeLoadingState);
  const hasMore = useAtomValue(homeHasMoreState);
  const [, loadMoreProducts] = useAtom(loadMoreHomeProductsAction);
  const [, initProducts] = useAtom(initHomeProductsAction);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Tải sản phẩm ban đầu khi component mount
  useEffect(() => {
    initProducts();
  }, [initProducts]);

  // Thiết lập IntersectionObserver để theo dõi khi người dùng cuộn đến cuối trang
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Nếu element loading hiển thị trong viewport và còn sản phẩm để tải
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [loadMoreProducts, hasMore, isLoading]);

  return (
    <div className="min-h-full bg-section">
      <div className="bg-background pt-2">
        <SearchBar onClick={() => navigate("/search")} />
        <Banners />
      </div>
      <div className="bg-background space-y-2 mt-2">
        {/* <CategoryTabs /> */}
        <ProductGrid products={products} className="pt-4 pb-[13px]" />

        {/* Hiển thị loading hoặc thông báo không còn sản phẩm */}
        <div ref={loadingRef} className="pb-4">
          {isLoading && <LoadingIndicator />}
          {!hasMore && products.length > 0 && (
            <div className="text-center text-gray-500 py-4">
              Đã hiển thị tất cả sản phẩm
            </div>
          )}
        </div>
      </div>
      <HorizontalDivider />

      <div className="mt-4">
        <CustomApiExample />
      </div>
    </div>
  );
};

export default HomePage;
