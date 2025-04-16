import ProductFilter from "./product-filter";
import HorizontalDivider from "@/components/horizontal-divider";
import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { productsState } from "@/state";
import { Suspense } from "react";

export default function ProductListPage() {
  const products = useAtomValue(productsState);

  return (
    <>
      <ProductFilter />
      <HorizontalDivider />
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductGrid products={products} className="pt-4 pb-[13px]" />
      </Suspense>
    </>
  );
}
