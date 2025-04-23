import React from "react";
import { Button } from "zmp-ui";
import { Product } from "../types";

interface BuyNowButtonProps {
  product: Product;
  onBuyNow: () => void;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ product, onBuyNow }) => {
  return (
    <Button
      fullWidth
      onClick={onBuyNow}
      className="border-radius-4 bg-primary"
    >
      Mua ngay
    </Button>
  );
};

export default BuyNowButton;
