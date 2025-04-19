import { Page, Box, Input, Button } from "zmp-ui";
import { useAtom, useAtomValue } from "jotai";
import {
  cartTotalState,
  selectedAddressState,
  shippingAddressesState,
  cartState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import CusButton from "@/components/button";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddAddressModal from "./add-address-modal";
import { ShippingAddress } from "@/types";
import { services } from "@/services/services";

export default function CheckoutPage() {
  const { totalItems, totalAmount } = useAtomValue(cartTotalState);
  const [addresses] = useAtom(shippingAddressesState);
  const [selectedAddress, setSelectedAddress] = useAtom(selectedAddressState);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [cartItems] = useAtom(cartState);
  const [notes, setNotes] = useState({
    seller: "",
    shipping: "",
  });
  const [voucher, setVoucher] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Tự động chọn địa chỉ mặc định khi vào trang
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || isProcessing) return;

    try {
      setIsProcessing(true);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        address: selectedAddress,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          options: item.options,
        })),
        notes,
        voucher: voucher || undefined,
        totalAmount,
      };

      // Gọi API đặt hàng
      await services.order.create(orderData);

      // Chuyển đến trang thành công
      navigate("/payment-success");
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Page className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Địa chỉ nhận hàng */}
        <Box className="rounded-none border-b bg-white mb-2">
          <div
            className="p-4 cursor-pointer"
            onClick={() =>
              navigate("/address", { state: { from: "checkout" } })
            }
          >
            <div className="font-medium mb-4 text-gray-800">
              Địa chỉ nhận hàng
            </div>
            {selectedAddress ? (
              <div className="space-y-1">
                <div className="font-medium text-gray-800">
                  {selectedAddress.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedAddress.phone}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedAddress.address}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-primary">
                <span className="text-2xl">+</span>
                <span>Thêm địa chỉ nhận hàng</span>
              </div>
            )}
          </div>
        </Box>

        {/* Sản phẩm đã chọn */}
        <Box className="rounded-none bg-white mb-2">
          <div className="p-4">
            <div className="font-medium mb-3 text-gray-800">
              Sản phẩm đã chọn ({totalItems})
            </div>
            <div className="space-y-4">
              {/* Danh sách sản phẩm */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  <img
                    src={services.product.getImageUrl(item.product.file_name)}
                    className="w-20 h-20 rounded-lg object-cover flex-none"
                    alt={item.product.inventory_item_name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2 text-gray-800">
                      {item.product.inventory_item_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.options?.size && (
                        <span>Size: {item.options.size}</span>
                      )}
                      {item.options?.color && (
                        <span className="ml-2">Màu: {item.options.color}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-primary font-medium">
                        {formatPrice(item.product.unit_price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* Mã giảm giá */}
        <Box className="rounded-none bg-white mb-2">
          <div className="p-4">
            <div className="font-medium mb-3 text-gray-800">Mã giảm giá</div>
            <div className="flex space-x-2">
              <Input
                className="flex-1"
                placeholder="Nhập mã ưu đãi"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <Button
                className="flex-none px-4 bg-primary text-white rounded-lg"
                disabled={!voucher}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </Box>

        {/* Ghi chú */}
        <Box className="rounded-none bg-white mb-2">
          <div className="p-4 space-y-4">
            <div className="font-medium text-gray-800">Ghi chú</div>
            <div>
              <Input
                label="Ghi chú cho người bán"
                placeholder="Ví dụ: Màu sắc, kích thước cụ thể..."
                clearable={true}
                maxLength={1000}
                value={notes.seller}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, seller: e.target.value }))
                }
                className="w-full rounded-lg border-gray-200"
              />
            </div>
            <div>
              <Input
                label="Ghi chú cho đơn vị vận chuyển"
                placeholder="Ví dụ: Thời gian nhận hàng, địa điểm cụ thể..."
                clearable={true}
                maxLength={1000}
                value={notes.shipping}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, shipping: e.target.value }))
                }
                className="w-full rounded-lg border-gray-200"
              />
            </div>
          </div>
        </Box>

        {/* Phương thức thanh toán */}
        <Box className="rounded-none bg-white mb-2">
          <div className="p-4">
            <div className="font-medium mb-3 text-gray-800">
              Phương thức thanh toán
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-800">Thanh toán khi nhận hàng</span>
              <span className="text-primary">Lựa chọn</span>
            </div>
          </div>
        </Box>

        {/* Tổng tiền */}
        <Box className="rounded-none bg-white">
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính:</span>
                <span className="text-gray-800">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển:</span>
                <span className="text-gray-800">0 đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giảm giá:</span>
                <span className="text-primary">0 đ</span>
              </div>
            </div>
          </div>
        </Box>
      </div>

      {/* Tổng thanh toán và nút đặt hàng */}
      <div className="flex-none bg-white border-t px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Tổng thanh toán:</span>
          <span className="text-xl font-medium text-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
        <Button
          className="w-full bg-primary text-white rounded-lg py-3"
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || isProcessing}
        >
          {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
        </Button>
      </div>

      <AddAddressModal
        visible={showAddAddress}
        onClose={() => setShowAddAddress(false)}
      />
    </Page>
  );
}
