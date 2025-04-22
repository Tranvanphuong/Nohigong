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
          Chọn phiên bản sản phẩm
        </Text.Title>

        <Box className="space-y-2">
          {product.classifies?.map((variant, index, array) => (
            <Button
              key={index}
              variant="secondary"
              fullWidth
              onClick={() => onSelect(variant)}
              className="flex justify-between items-center"
            >
              <Text>{array[index]?.inventory_item_name}</Text>
              <Text className="text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.unit_price)}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>
    </Sheet>
  );
};

export default ProductVariantSelector;
