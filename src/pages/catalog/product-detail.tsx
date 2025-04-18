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
import { Color, Size, Product } from "@/types";
import SharePhoneModal from "@/components/SharePhoneModal";
import { getToken } from "@/utils/auth";
import { getUserNumber } from "@/utils/request";

export default function ProductDetailPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const savePhoneNumber = async (phone: string, userName: string) => {
    console.log("savePhoneNumber", phone);
    try {
      let savePhoneBody = {
        customer_name: userName,
        phone_number: phone,
        address: "hà nội",
        channel_id: 10,
        channel_user_id: "nggiitss",
        channel_user_name: "Anggitsss",
        seller_id: "zalo",
      };
      const token = getToken();
      const response = await fetch(
        "https://eshopapp.misa.vn/g2/api/socialmob/CustomerChannels/save-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(savePhoneBody),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lưu số điện thoại");
      }

      console.log("Đã lưu số điện thoại thành công");
    } catch (error) {
      console.error("Lỗi khi lưu số điện thoại:", error);
    }
  };
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
    if (!fileName) return "";
    return `https://eshopapp.misa.vn/g2/api/file/files?type=3&dbId=678b418c-e461-11ef-9e58-005056b275fa&file=${fileName}`;
  };

  const product = useAtomValue(productDetailState) as Product | null;

  if (!product) {
    return <div>Loading...</div>;
  }

  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [showSharePhoneModal, setShowSharePhoneModal] = useState(false);

  const { addToCart, setOptions } = useAddToCart(product);

  useEffect(() => {
    setOptions({
      size: selectedSize,
      color: selectedColor?.name,
    });
  }, [selectedSize, selectedColor]);

  const handleAddToCart = async () => {
    console.log("1. Bắt đầu xử lý click button");
    addToCart(1);
    try {
      console.log("2. Bắt đầu lấy access token");
      const accessToken = await getAccessToken({});
      console.log("3. Access token:", accessToken);

      // Lấy thông tin người dùng - sửa lại cách xử lý promise
      console.log("4. Bắt đầu lấy user info");
      const userInfoResult = await new Promise((resolve, reject) => {
        getUserInfo({
          success: resolve,
          fail: reject,
          autoRequestPermission: true,
          avatarType: "large",
        });
      });
      console.log("5. User info success:", userInfoResult);

      console.log("6. Bắt đầu gọi getPhoneNumber");
      await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: async (data) => {
            try {
              console.log("data", data);
              let { token } = data;
              console.log("Phone token:", token);
              if (!token) {
                throw new Error("Phone token is required");
              }
              var userPhones = await getUserNumber({
                access_token: accessToken,
                code: token,
              });
              await savePhoneNumber(userPhones?.data?.number, "Khách hàng"); 
              resolve(null);
            } catch (error) {
              reject(error);
            }
          },
          fail: reject,
        });
      });

      toast.success("Đã thêm vào giỏ hàng");
    } catch (error: unknown) {
      console.error("Error in handleAddToCart:", error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Có lỗi xảy ra: " + errorMessage);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
              {/* {product.unit_price && (
                <div className="line-through text-subtitle text-3xs">
                  {formatPrice(product.unit_price)}
                </div>
              )} */}
            </div>
          </div>
          <div className="space-y-2">
            {/* {product.colors && (
              <VariantPicker
                title="Màu sắc"
                variants={product.colors}
                value={selectedColor}
                onChange={(color) => setSelectedColor(color)}
                renderVariant={(variant, selected) => (
                  <div
                    className={"w-full h-full flex justify-center items-center ".concat(
                      selected ? "bg-primary text-white" : ""
                    )}
                  >
                    <div className="truncate">{variant?.name || ""}</div>
                  </div>
                )}
              />
            )}
            {product.sizes && (
              <VariantPicker
                title="Size"
                variants={product.sizes}
                value={selectedSize}
                onChange={(size) => setSelectedSize(size)}
                renderVariant={(variant, selected) => (
                  <div
                    className={"w-full h-full flex justify-center items-center ".concat(
                      selected ? "bg-primary text-white" : ""
                    )}
                  >
                    <div className="truncate">{variant || ""}</div>
                  </div>
                )}
              />
            )} */}
          </div>
          {/* {product.details && (
            <>
              <div className="bg-section h-2 w-full"></div>
              <Collapse items={product.details} />
            </>
          )} */}
          {/* <div className="bg-section h-2 w-full"></div>
          <div className="font-medium py-2 px-4">
            <div className="pt-2 pb-2.5">Sản phẩm khác</div>
            <HorizontalDivider />
          </div> */}
          {/* <RelatedProducts currentProductId={product.inventory_item_id} /> */}
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

      {/* <SharePhoneModal
        isOpen={showSharePhoneModal}
        onClose={() => setShowSharePhoneModal(false)}
      /> */}
    </div>
  );
}
