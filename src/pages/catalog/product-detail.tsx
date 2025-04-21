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
import { Color, Product } from "@/types";
import SharePhoneModal from "@/components/SharePhoneModal";
import { services } from "@/services/services";

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

  const productDetail = useAtomValue(productDetailState) as Product | null;

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  const [selectedColor, setSelectedColor] = useState<Color>();
  // const [selectedSize, setSelectedSize] = useState<Size>();
  const [showSharePhoneModal, setShowSharePhoneModal] = useState(false);

  const { addToCart, setOptions } = useAddToCart(productDetail);

  // useEffect(() => {
  //   setOptions({
  //     size: selectedSize,
  //     color: selectedColor?.name,
  //   });
  // }, [selectedSize, selectedColor]);

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
    <div className="flex flex-col h-full">
     <div className="p-4">
        <img
          src={getImageUrl(productDetail.file_name)}
          alt={productDetail.inventory_item_name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">
          {productDetail.inventory_item_name}
        </h1>
        <div className="text-xl font-semibold text-primary mb-4">
          {productDetail.unit_price.toLocaleString("vi-VN")}đ
        </div>

        {/* Mô tả sản phẩm */}
        {productDetail.description && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {productDetail.description}
            </p>
          </div>
        )}

        {/* Thuộc tính sản phẩm */}
        {productDetail.properties && productDetail.properties.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
            <div className="space-y-2">
              {productDetail.properties.map((property) => (
                <div key={property.inventory_item_property_id} className="flex justify-between">
                  <span className="text-gray-600">{property.property_name}:</span>
                  <span className="font-medium">{property.inventory_item_property_value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thông tin sản phẩm */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Mã sản phẩm:</p>
              <p className="font-medium">{productDetail.sku_code}</p>
            </div>
            <div>
              <p className="text-gray-600">Danh mục:</p>
              <p className="font-medium">
                {productDetail.inventory_item_category_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Thương hiệu:</p>
              <p className="font-medium">{productDetail.brand_name}</p>
            </div>
            {/* <div>
              <p className="text-gray-600">Tình trạng:</p>
              <p className="font-medium">
                {productDetail.instock > 0 ? "Còn hàng" : "Hết hàng"}
              </p>
            </div> */}
          </div>
        </div>
        <HorizontalDivider />
        <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4">
          <Button large onClick={handleAddToCart}>
            Thêm vào giỏ
          </Button>
          <Button
            large
            primary
            onClick={() => {
              addToCart(1);
              navigate("/cart");
            }}
          >
            Mua ngay
          </Button>
        </div>
      </div>

    </div>
  );
}
