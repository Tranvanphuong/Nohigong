import React, { useState } from 'react';
import { Product } from '../types';
import { Box, Text, Sheet, Button } from 'zmp-ui';
import { services } from '@/services/services';


interface ProductVariantSelectorProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
  onSelect: (variant: Product) => void;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  product,
  visible,
  onClose,
  onSelect,
}) => {
  // State để lưu variant được chọn
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý khi chọn variant
  const handleVariantClick = (variant: Product) => {
    setSelectedVariant(variant);
  };

  // Hàm xử lý khi bấm nút xác nhận
  const handleConfirm = () => {
    if (selectedVariant) {
      onSelect(selectedVariant);
      setSelectedVariant(null); // Reset state sau khi xác nhận
    }
  };

  // Hàm lấy đường dẫn hình ảnh
  const getImageUrl = (fileName: string | null) => {
    return services.product.getImageUrl(fileName);
  };

  return (
    <Sheet
      visible={visible}
      onClose={() => {
        onClose();
        setSelectedVariant(null); // Reset state khi đóng popup
      }}
      autoHeight={false}
      mask={true}
      handler={true}
      height="90vh"
    >
      <Box className="flex flex-col h-full">
        <Box p={4} className="flex-none">
          {/* Vùng hiển thị hình ảnh lớn */}
          <Box className="flex flex-col items-center mb-6">
            <div className="w-full aspect-square max-w-[300px] rounded-lg overflow-hidden mb-4">
              <img 
                src={getImageUrl(selectedVariant?.file_name || product.file_name)} 
                alt={selectedVariant?.inventory_item_name || product.inventory_item_name}
                className="w-full h-full object-cover"
              />
            </div>
            <Text.Title size="small" className='currency-product'>
              {formatPrice(selectedVariant ? selectedVariant.unit_price : product.unit_price)}
            </Text.Title>
            <Text.Title size="small">
              {selectedVariant?.inventory_item_name || product.inventory_item_name}
            </Text.Title>
          </Box>
          
          <Text.Title size="small" className="mb-4">
            Chọn phiên bản sản phẩm
          </Text.Title>
        </Box>
        
        {/* Vùng scroll cho danh sách variants */}
        <Box className="flex-1 overflow-y-auto px-4">
          <Box className="flex flex-wrap gap-2">
            {product.classifies?.map((variant, index) => {
              const isSelected = selectedVariant?.inventory_item_id === variant.inventory_item_id;
              
              return (
                <Button
                  key={index}
                  variant="secondary"
                  onClick={() => handleVariantClick(variant)}
                  className={`inline-flex items-center button-select-product ${
                    isSelected ? 'bg-primary text-white' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={getImageUrl(variant.file_name)} 
                      alt={variant.sku_code}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <Text className={isSelected ? 'text-white' : ''}>
                        {variant.sku_code}
                      </Text>
                    </div>
                  </div>
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Nút xác nhận cố định ở dưới */}
        <Box className="flex-none p-4 border-t">
          <Button
            fullWidth
            variant="primary"
            disabled={!selectedVariant}
            onClick={handleConfirm}
            className="h-12 border-radius-4"
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};

export default ProductVariantSelector;
