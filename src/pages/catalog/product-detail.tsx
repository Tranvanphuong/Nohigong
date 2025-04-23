import { useAtom, useAtomValue } from "jotai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import {
  productDetailState,
  productState,
  selectedProductIdState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import VariantPicker from "./variant-picker";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Collapse from "@/components/collapse";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import toast from "react-hot-toast";
import { Color, Size, Product } from "@/types";
import { SelectedOptions } from "@/types/index";
import SharePhoneModal from "@/components/SharePhoneModal";
import { services } from "@/services/services";
import { Icon } from "zmp-ui";
import BuyNowButton from "@/components/BuyNowButton";
import Carousel from "@/components/carousel";
import ProductVariantSelector from "@/components/ProductVariantSelector";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    size: undefined,
    color: undefined
  });
  const selectedVariantRef = useRef<Product | null>(null);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  if (!id) {
    throw new Error("Product ID is required");
  }

  const [, setSelectedProductId] = useAtom(selectedProductIdState);
  useEffect(() => {
    setSelectedProductId(id);
  }, [id]);

  const getImageUrl = (fileName: string | null) => {
    return services.product.getImageUrl(fileName);
  };

  const product = useAtomValue(productDetailState) as Product | null;

  if (!product) {
    return <div>Loading...</div>;
  }

  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [showSharePhoneModal, setShowSharePhoneModal] = useState(false);
  // State để lưu các thuộc tính đã chọn
  const [selectedProperties, setSelectedProperties] = useState<
    Record<string, string>
  >({});
  // State để lưu sản phẩm tương ứng sau khi chọn thuộc tính
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  // State để lưu sản phẩm biến thể được chọn
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);

  // Sử dụng useRef để lưu trữ variant được chọn
//  selectedVariantRef = useRef<Product | null>(null);

  // Sử dụng useAddToCart với currentProduct
  const { addToCart, options, setOptions } = useAddToCart(currentProduct || {} as Product);

  // Hàm xử lý khi chọn variant
  const handleVariantSelect = (variant: Product) => {
    setCurrentProduct(variant);
    setShowVariantSelector(false);
  };

  // Theo dõi currentProduct và thêm vào giỏ hàng
  useEffect(() => {
    if (currentProduct) {
      addToCart(1);
      navigate('/cart');
    }
  }, [currentProduct, addToCart, navigate]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      setOptions({
        size: selectedSize,
        color: selectedColor.name,
      });
    }
  }, [selectedSize, selectedColor, setOptions]);

  // Hàm xử lý khi chọn thuộc tính
  // const handlePropertySelect = (propertyName: string, value: string) => {
  //   const newSelectedProperties = {
  //     ...selectedProperties,
  //     [propertyName]: value,
  //   };
  //   setSelectedProperties(newSelectedProperties);

  //   // Tìm sản phẩm tương ứng trong classifies
  //   if (product?.classifies) {
  //     const matchedClassify = product.classifies.find((classify) => {
  //       return Object.entries(newSelectedProperties).every(([name, val]) => {
  //         // Lấy giá trị thuộc tính từ classifies.properties[0].inventory_item_property_value
  //         const propertyValue =
  //           classify.properties?.[0]?.inventory_item_property_value;
  //         return classify.property_name === name && propertyValue === val;
  //       });
  //     });

  //     if (matchedClassify) {
  //       // Nếu tìm thấy sản phẩm tương ứng, cập nhật state
  //       setMatchedProduct({
  //         ...product,
  //         inventory_item_id: matchedClassify.inventory_item_id,
  //       });
  //     } else {
  //       setMatchedProduct(null);
  //     }
  //   }
  // };

  const handleAddToCart = async () => {
    console.log("1. Bắt đầu xử lý click button");
    addToCart(1);
    try {
      const phoneNumber = await services.customer.getAndSavePhoneNumber();
      if (phoneNumber) {
        setPhoneNumber(phoneNumber);
      }
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error: unknown) {
      console.error("Error in handleAddToCart:", error);
      toast.error("Có lỗi xảy ra: " + (error as Error).message);
    }
  };

  // Hàm xử lý mua ngay
  const handleBuyNow = () => {
    if (!product) {
      console.error("Product is null");
      return;
    }
    
    if (product.classifies && product.classifies.length > 0) {
      setShowVariantSelector(true);
    } else {
      setCurrentProduct(product);
    }
  };

  // Sử dụng currentProduct thay vì product trong UI
  const displayProduct = currentProduct || product;

  return (
    <div className="flex flex-col h-full pb-[60px] relative">
      <div className="flex-1 overflow-y-auto">
        <Carousel
          slides={
            (displayProduct as any).resources && (displayProduct as any).resources.length > 0
              ? (displayProduct as any).resources.map((image: any) => (
                  <img
                    src={getImageUrl(image.file_name || "")}
                    className="w-full aspect-square object-cover"
                    alt={displayProduct.inventory_item_name}
                  />
                ))
              : [
                  <img
                    src={getImageUrl(displayProduct.file_name || "")}
                    className="w-full aspect-square object-cover"
                    alt={displayProduct.inventory_item_name}
                  />,
                ]
          }
        />
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="text-3xs text-subtitle">
              {displayProduct.inventory_item_category_name}
            </div>
            <div className="text-lg font-medium">
              {displayProduct.inventory_item_name}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-primary">
                {formatPrice(displayProduct.unit_price)}
              </div>
            </div>
          </div>

          {/* Hiển thị phiên bản đã chọn */}
          {selectedVariant && (
            <div className="p-2 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">
                Phiên bản đã chọn: {selectedVariant.inventory_item_name}
              </p>
            </div>
          )}

          {/* Mô tả sản phẩm */}
          {displayProduct.description && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {displayProduct.description}
              </p>
            </div>
          )}

          {/* Thuộc tính sản phẩm */}
          {/* {product.properties && product.properties.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
              <div className="space-y-4">
                {product.properties.map((property) => (
                  <div key={property.inventory_item_property_id}>
                    <p className="text-gray-600 mb-2">
                      {property.property_name}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.properties
                        ?.filter(
                          (p) => p.property_name === property.property_name
                        )
                        .map((p) => (
                          <button
                            key={p.inventory_item_property_id}
                            className={`px-4 py-2 rounded border ${
                              selectedProperties[property.property_name] ===
                              p.inventory_item_property_value
                                ? "bg-primary text-white border-primary"
                                : "bg-white border-gray-300"
                            }`}
                            onClick={() =>
                              handlePropertySelect(
                                property.property_name,
                                p.inventory_item_property_value
                              )
                            }
                          >
                            {p.inventory_item_property_value}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Hiển thị thông báo khi tìm thấy sản phẩm tương ứng */}
          {matchedProduct && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700">Đã tìm thấy sản phẩm tương ứng!</p>
              <p className="text-sm text-gray-600 mt-2">
                Mã sản phẩm: {matchedProduct.inventory_item_id}
              </p>
            </div>
          )}

          {/* Thông tin sản phẩm */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Mã sản phẩm:</p>
                <p className="font-medium">{displayProduct.sku_code}</p>
              </div>
              <div>
                <p className="text-gray-600">Danh mục:</p>
                <p className="font-medium">
                  {displayProduct.inventory_item_category_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Thương hiệu:</p>
                <p className="font-medium">{displayProduct.brand_name}</p>
              </div>
            </div>
          </div>
        </div>

        <HorizontalDivider />
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-95 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex items-center justify-center p-2 gap-4">
          <button
            onClick={handleAddToCart}
            className="w-[190px] flex items-center justify-center gap-1 px-4 py-2 border border-gray-300 rounded-lg cl-add-car border-radius-4 h-48"
          >
            <span>Thêm vào giỏ</span>
          </button>
          <div className="w-[190px]">
            <BuyNowButton 
              product={displayProduct} 
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>

      {/* Popup chọn variant */}
      <ProductVariantSelector
        product={currentProduct || product}
        visible={showVariantSelector}
        onClose={() => setShowVariantSelector(false)}
        onSelect={handleVariantSelect}
      />
    </div>
  );
};

export default ProductDetailPage;
