import ProductGrid from "@/components/product-grid";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { productsState } from "@/state";
import { Suspense } from "react";

export interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts(props: RelatedProductsProps) {
  const products = useAtomValue(productsState);
  const otherProducts = useMemo(
    () =>
      products.filter(
        (product) => product.inventory_item_id !== props.currentProductId
      ),
    [products, props.currentProductId]
  );

  return (
    <Suspense fallback={<div>Loading related products...</div>}>
      <ProductGrid replace products={otherProducts} />
    </Suspense>
  );
}
