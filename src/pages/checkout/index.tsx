import { Page, Box, Input } from "zmp-ui";
import { useAtom, useAtomValue } from "jotai";
import {
  cartTotalState,
  selectedAddressState,
  shippingAddressesState,
  cartState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import Button from "@/components/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const navigate = useNavigate();

  // Tự động chọn địa chỉ mặc định nếu có
  useState(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  });

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address);
  };

  return (
    <Page className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Địa chỉ nhận hàng */}
        <Box className="rounded-none border-b">
          <div
            className="p-4 cursor-pointer"
            onClick={() =>
              navigate("/address", { state: { from: "checkout" } })
            }
          >
            <div className="font-medium mb-4">Địa chỉ nhận hàng</div>
            {selectedAddress ? (
              <div className="space-y-1">
                <div className="font-medium">{selectedAddress.fullName}</div>
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
        <Box className="rounded-none">
          <div className="p-4">
            <div className="font-medium mb-3">
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
                    <div className="text-sm font-medium line-clamp-2">
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
        <Box className="rounded-none">
          <div className="p-4">
            <div className="font-medium mb-3">Mã giảm giá</div>
            <div className="flex space-x-2">
              <Input
                className="flex-1"
                placeholder="Nhập mã ưu đãi"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <Button className="flex-none px-4" disabled={!voucher}>
                Áp dụng
              </Button>
            </div>
          </div>
        </Box>

        {/* Ghi chú */}
        <Box className="rounded-none">
          <div className="p-4 space-y-4">
            <div className="font-medium">Ghi chú</div>
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Ghi chú cho người bán
              </div>
              <Input.TextArea
                placeholder="Ví dụ: Màu sắc, kích thước cụ thể..."
                rows={2}
                value={notes.seller}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, seller: e.target.value }))
                }
              />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Ghi chú cho đơn vị vận chuyển
              </div>
              <Input.TextArea
                placeholder="Ví dụ: Thời gian nhận hàng, địa điểm cụ thể..."
                rows={2}
                value={notes.shipping}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, shipping: e.target.value }))
                }
              />
            </div>
          </div>
        </Box>

        {/* Phương thức thanh toán */}
        <Box className="rounded-none">
          <div className="p-4">
            <div className="font-medium mb-3">Phương thức thanh toán</div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Thanh toán khi nhận hàng</span>
              <span className="text-primary">Lựa chọn</span>
            </div>
          </div>
        </Box>

        {/* Tổng tiền */}
        <Box className="rounded-none">
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển:</span>
                <span>0 VND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giảm giá:</span>
                <span className="text-primary">0 VND</span>
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
          primary
          className="w-full"
          onClick={() => navigate("/payment-success")}
          disabled={!selectedAddress}
        >
          Đặt hàng
        </Button>
      </div>

      <AddAddressModal
        visible={showAddAddress}
        onClose={() => setShowAddAddress(false)}
      />
    </Page>
  );
}
