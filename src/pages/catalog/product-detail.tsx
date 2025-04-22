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
import { useEffect, useState } from "react";
import Collapse from "@/components/collapse";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import toast from "react-hot-toast";
import { Color, Size, Product, Classify } from "@/types";
import SharePhoneModal from "@/components/SharePhoneModal";
import { services } from "@/services/services";
import { Icon } from "zmp-ui";
import BuyNowButton from "@/components/BuyNowButton";

export default function ProductDetailPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { id } = useParams();

  const navigate = useNavigate();
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
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [showSharePhoneModal, setShowSharePhoneModal] = useState(false);
  // State để lưu các thuộc tính đã chọn
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string>>({});
  // State để lưu sản phẩm tương ứng sau khi chọn thuộc tính
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);

  const { addToCart, setOptions } = useAddToCart(product);

  useEffect(() => {
    setOptions({
      size: selectedSize,
      color: selectedColor?.name,
    });
  }, [selectedSize, selectedColor]);

  // Hàm xử lý khi chọn thuộc tính
  const handlePropertySelect = (propertyName: string, value: string) => {
    const newSelectedProperties = {
      ...selectedProperties,
      [propertyName]: value
    };
    setSelectedProperties(newSelectedProperties);

    // Tìm sản phẩm tương ứng trong classifies
    if (product?.classifies) {
      const matchedClassify = product.classifies.find(classify => {
        return Object.entries(newSelectedProperties).every(([name, val]) => {
          // Lấy giá trị thuộc tính từ classifies.properties[0].inventory_item_property_value
          const propertyValue = classify.properties?.[0]?.inventory_item_property_value;
          return classify.property_name === name && propertyValue === val;
        });
      });

      if (matchedClassify) {
        // Nếu tìm thấy sản phẩm tương ứng, cập nhật state
        setMatchedProduct({
          ...product,
          inventory_item_id: matchedClassify.inventory_item_id
        });
      } else {
        setMatchedProduct(null);
      }
    }
  };

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

  return (
    <div className="flex flex-col h-full pb-[60px] relative">
      <div className="flex-1 overflow-y-auto">
        <img
          src={getImageUrl(product.file_name || "")}
          className="w-full aspect-square object-cover"
          alt={product.inventory_item_name}
        />
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="text-3xs text-subtitle">
              {product.inventory_item_category_name}
            </div>
            <div className="text-lg font-medium">
              {product.inventory_item_name}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-primary">
                {formatPrice(product.unit_price)}
              </div>
            </div>
          </div>

          {/* Mô tả sản phẩm */}
          {product.description && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Thuộc tính sản phẩm */}
          {product.properties && product.properties.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
              <div className="space-y-4">
                {product.properties.map((property) => (
                  <div key={property.inventory_item_property_id}>
                    <p className="text-gray-600 mb-2">{property.property_name}:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.properties
                        ?.filter(p => p.property_name === property.property_name)
                        .map((p) => (
                          <button
                            key={p.inventory_item_property_id}
                            className={`px-4 py-2 rounded border ${
                              selectedProperties[property.property_name] === p.inventory_item_property_value
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-gray-300'
                            }`}
                            onClick={() => handlePropertySelect(property.property_name, p.inventory_item_property_value)}
                          >
                            {p.inventory_item_property_value}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <p className="font-medium">{product.sku_code}</p>
              </div>
              <div>
                <p className="text-gray-600">Danh mục:</p>
                <p className="font-medium">
                  {product.inventory_item_category_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Thương hiệu:</p>
                <p className="font-medium">{product.brand_name}</p>
              </div>
            </div>
          </div>
        </div>

        <HorizontalDivider />
        
        
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-95 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-center p-2 gap-4">
          <button 
            onClick={handleAddToCart}
            className="w-[190px] flex items-center justify-center gap-1 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <span>Thêm vào giỏ</span>
          </button>
          <div className="w-[190px]">
            <BuyNowButton 
              product={product}
              onBuyNow={(variant?: Classify) => {
                // Thêm vào giỏ hàng trước
                addToCart(1);
                // Sau đó chuyển đến trang giỏ hàng
                navigate("/cart");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
