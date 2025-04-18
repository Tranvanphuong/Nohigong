import { useAtomValue } from "jotai";
import { Product } from "../types";
import ProductItem from "./product-item";
import { HTMLAttributes, Suspense } from "react";
import { filteredProductsState } from "@/state";

export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  products?: Product[];
  replace?: boolean;
}

function ProductGridContent({
  className,
  replace,
  ...props
}: ProductGridProps) {
  const products = useAtomValue(filteredProductsState);
  console.log("products", products);
  return (
    <div
      className={"grid grid-cols-2 px-4 py-2 gap-4 ".concat(className ?? "")}
      {...props}
    >
      {products.map((product) => (
        <ProductItem
          key={product.inventory_item_id}
          product={product}
          replace={replace}
        />
      ))}
    </div>
  );
}

export default function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}
