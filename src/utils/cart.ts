import { Product } from "@/types";

export function getDefaultOptions(product: any): any {
  return {
    size: product.sizes?.[0],
    color: product.colors?.[0]?.name,
  };
}

export function isIdentical(option1: any, option2: any) {
  return option1.size === option2.size && option1.color === option2.color;
}
