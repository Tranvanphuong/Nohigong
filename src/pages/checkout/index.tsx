import { Page, Box, Input, Button, Radio } from "zmp-ui";
import { useAtom, useAtomValue } from "jotai";
import {
  cartTotalState,
  selectedAddressState,
  shippingAddressesState,
  cartState,
  userState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import CusButton from "@/components/button";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddAddressModal from "./add-address-modal";
import NoteModal from "./note-modal";
import { ShippingAddress } from "@/types";
import { services } from "@/services/services";

export default function CheckoutPage() {
  const { totalItems, totalAmount } = useAtomValue(cartTotalState);
  const [addresses] = useAtom(shippingAddressesState);
  const [selectedAddress, setSelectedAddress] = useAtom(selectedAddressState);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [cartItems] = useAtom(cartState);
  const userInfo = useAtomValue(userState);
  const [notes, setNotes] = useState({
    seller: "",
    shipping: "",
  });
  const [voucher, setVoucher] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod hoặc bank_transfer
  const [noteModal, setNoteModal] = useState({
    visible: false,
    type: "", // seller hoặc shipping
    title: "",
    placeholder: "",
  });
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

  const openNoteModal = (type: "seller" | "shipping") => {
    const config = {
      seller: {
        title: "Ghi chú cho người bán",
        placeholder: "Nhập ghi chú cho người bán...",
      },
      // shipping: {
      //   title: "Ghi chú cho đơn vị vận chuyển",
      //   placeholder: "Nhập ghi chú cho đơn vị vận chuyển...",
      // },
    };

    setNoteModal({
      visible: true,
      type,
      title: config[type].title,
      placeholder: config[type].placeholder,
    });
  };

  const handleCloseNoteModal = () => {
    setNoteModal((prev) => ({ ...prev, visible: false }));
  };

  const handleChangeNote = (value: string) => {
    setNotes((prev) => ({ ...prev, [noteModal.type]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || isProcessing) return;

    try {
      setIsProcessing(true);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        address: selectedAddress,
        items: cartItems.map((item) => ({
          productId: item.product.inventory_item_name,
          quantity: item.quantity,
          options: item.options,
        })),
        notes,
        voucher: voucher || undefined,
        totalAmount,
        returnRecord: true,
        commitOrder: {
          model: {
            is_master: false,
            State: 1,
            EditVersion: 0,
            id: crypto.randomUUID(),
            order_id: crypto.randomUUID(),
            branch_id: "87e2d19c-89f7-11ef-88d3-005056b34af7",
            ref_no: "#000000",
            ref_type: 5491,
            customer_name: selectedAddress.fullName,
            order_status: 5,
            recipient_name: selectedAddress.fullName,
            recipient_tel: selectedAddress.phone,
            page_id: userInfo?.userInfo?.id,
            page_name: userInfo?.userInfo?.name,
            total_item_amount: totalAmount,
            total_item_quantity: totalItems,
            total_amount: totalAmount,
            remain_amount: totalAmount,
            is_cod: paymentMethod === "cod", // Cập nhật giá trị is_cod dựa trên phương thức thanh toán
            to_province_or_city_id: selectedAddress.province?.name,
            to_district_id: selectedAddress.district?.name,
            to_ward_or_commune_id: selectedAddress.ward?.name,

            to_province_or_city_id_number: selectedAddress.province?.id,
            to_district_id_number: selectedAddress.district?.id,
            to_ward_or_commune_id_number: selectedAddress.ward?.id,
            employee_note: notes.seller,
            shipping_note: notes.shipping,
            type_viewable: 0,
            order_date: new Date().toISOString(),
            channel_id: 120,
            is_save_customer: false,
            pick_option: 1,
            partner_user_id: userInfo?.userInfo?.id,
            reset_from_promotion: false,
            is_apply_tax: true,
            is_tax_reduction: true,
            IsValidForAction: true,
            publish_status: 0,
            created_date: new Date().toISOString(),
            modified_date: new Date().toISOString(),
            Details: cartItems.map((item) => ({
              is_master: false,
              State: 1,
              EditVersion: 0,
              id: crypto.randomUUID(),
              order_detail_id: crypto.randomUUID(),
              order_id: crypto.randomUUID(),
              is_auto_generate: false,
              inventory_item_id: item.product.inventory_item_id,
              inventory_item_name: item.product.inventory_item_name,
              inventory_item_type: 1,
              quantity: item.quantity,
              unit_price: item.product.unit_price,
              sort_order: 0,
              file_name: item.product.file_name,
              amount: item.product.unit_price * item.quantity,
              origin_amount: item.product.unit_price * item.quantity,
              tax_rate: 5,
              tax_rate_display: "5%",
              barcode: item.product.barcode,
              pre_unit_price_before_discount: item.product.unit_price,
              is_e_invoice_component: false,
              is_return: false,
              discounted_unit_price: item.product.unit_price,
              note: "",
              origin_unit_price: item.product.unit_price,
              amount_after_discount: item.product.unit_price * item.quantity,
            })),
          },
          action: 99,
          ReturnRecord: true,
        },
      };
      console.log("Order Data:", JSON.stringify(orderData.commitOrder));
      // Gọi API đặt hàng
      await services.order.create(orderData?.commitOrder);

      // Chuyển đến trang thành công với dữ liệu đơn hàng
      navigate("/payment-success", { state: { orderData } });
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
            <div className="flex space-x-2 items-center">
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

            <div
              className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
              onClick={() => openNoteModal("seller")}
            >
              <div className="flex items-center text-gray-800">
                <span className="min-w-[120px]">Người bán:</span>
                <span className="text-gray-600 flex-1 truncate">
                  {notes.seller ? notes.seller : "Thêm ghi chú"}
                </span>
              </div>
              <div className="text-gray-400 flex-shrink-0 ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {/* 
            <div
              className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
              onClick={() => openNoteModal("shipping")}
            >
              <div className="flex items-center text-gray-800">
                <span className="min-w-[120px]">Vận chuyển:</span>
                <span className="text-gray-600 flex-1 truncate">
                  {notes.shipping ? notes.shipping : "Thêm ghi chú"}
                </span>
              </div>
              <div className="text-gray-400 flex-shrink-0 ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div> */}
          </div>
        </Box>

        {/* Phương thức thanh toán */}
        <Box className="rounded-none bg-white mb-2">
          <div className="p-4">
            <div className="font-medium mb-3 text-gray-800">
              Phương thức thanh toán
            </div>
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  paymentMethod === "cod" ? "border-primary" : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center">
                  <Radio
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="ml-2 text-gray-800">
                    Thanh toán khi nhận hàng
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("bank_transfer")}
              >
                <div className="flex items-center">
                  <Radio
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                  />
                  <span className="ml-2 text-gray-800">Chuyển khoản</span>
                </div>
              </div>
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

      <NoteModal
        visible={noteModal.visible}
        onClose={handleCloseNoteModal}
        title={noteModal.title}
        placeholder={noteModal.placeholder}
        value={notes[noteModal.type as "seller" | "shipping"]}
        onChange={handleChangeNote}
      />
    </Page>
  );
}
