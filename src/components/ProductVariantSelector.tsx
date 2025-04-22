import React from "react";
import { Product, Classify } from "../types";
import { Box, Text, Sheet, Button } from "zmp-ui";

interface ProductVariantSelectorProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
  onSelect: (variant: Classify) => void;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  product,
  visible,
  onClose,
  onSelect,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      autoHeight={true}
      mask={true}
      handler={true}
    >
      <Box p={4}>
        <Text.Title size="small" className="mb-4">
          Chọn sản phẩm
        </Text.Title>

        <Box className="space-y-2 flex-start">
          {product.classifies?.map((variant, index, array) => (
            <Button
              key={index}
              variant="secondary"
              fullWidth
              onClick={() => onSelect(variant)}
              className="flex-box justify-between items-center button-select-product"
            >
              <div className="flex flex-col items-start">
                <Text className="font-medium">
                  {variant.inventory_item_name}
                </Text>
                {variant.property_name && (
                  <Text className="text-xs text-gray-500">
                    {variant.property_name}: {variant.property_value}
                  </Text>
                )}
              </div>
              <Text className="text-primary">
                {formatPrice(product.unit_price)}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>
    </Sheet>
  );
};

export default ProductVariantSelector;
