import React, { useState } from "react";
import { Button } from "zmp-ui";
import { Product, Classify } from "../types";
import ProductVariantSelector from "./ProductVariantSelector";

interface BuyNowButtonProps {
  product: Product;
  onBuyNow: (variant?: Classify) => void;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ product, onBuyNow }) => {
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Classify | null>(null);

  const handleBuyNow = () => {
    if (product.classifies && product.classifies.length > 0) {
      setShowVariantSelector(true);
    } else {
      onBuyNow();
    }
  };

  const handleVariantSelect = (variant: Classify) => {
    setShowVariantSelector(false);
    setSelectedVariant(variant);
    console.log("variant" + JSON.stringify(variant));
    onBuyNow(variant);
  };

  const buttonText = selectedVariant
    ? `Mua ngay (${selectedVariant.inventory_item_name})`
    : "Mua ngay";

  return (
    <>
      <Button fullWidth variant="primary" onClick={handleBuyNow}>
        {buttonText}
      </Button>

      <ProductVariantSelector
        product={product}
        visible={showVariantSelector}
        onClose={() => setShowVariantSelector(false)}
        onSelect={handleVariantSelect}
      />
    </>
  );
};

export default BuyNowButton;
