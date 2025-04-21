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
          productId: item.product.inventory_item_name,
          quantity: item.quantity,
          options: item.options,
        })),
        notes,
        voucher: voucher || undefined,
        totalAmount,
        returnRecord: true,

        model: {
          is_master: false,
          State: 1,
          EditVersion: 0,
          id: "1f84c5be-adce-400c-b03e-ac77dc8104db",
          order_id: "1f84c5be-adce-400c-b03e-ac77dc8104db",
          branch_id: "87e2d19c-89f7-11ef-88d3-005056b34af7",
          ref_no: "#001059",
          ref_type: 5491,
          customer_name: "Nguyễn Long Nhật",
          order_status: 5,
          recipient_name: "Nguyễn Long Nhật",
          recipient_tel: "0922111146",
          page_id: "757103802701361965",
          page_name: "Nguyễn Diệu Linh",
          total_item_amount: 45000,
          total_item_quantity: 1,
          total_amount: 60000,
          remain_amount: 60000,
          is_cod: false,
          to_province_or_city_id: "Lào Cai",
          to_district_id: "Huyện Si Ma Cai",
          to_ward_or_commune_id: "Xã Thào Chư Phìn",
          employee_note: "aaaaaaaaaaaaa",
          shipping_note: "ffffffff",
          type_viewable: 0,
          order_date: "2025-04-20T11:17:39.000Z",
          channel_id: 120,
          is_save_customer: false,

          pick_option: 1,
          to_province_or_city_id_number: "269",
          to_district_id_number: "2264",
          to_ward_or_commune_id_number: "80213",
          partner_user_id: "2485980537744713171",
          reset_from_promotion: false,
          is_apply_tax: true,
          is_tax_reduction: true,
          IsValidForAction: true,
          publish_status: 0,
          created_date: "2025-04-20T18:17:39",
          modified_date: "2025-04-20T18:17:39",
          Details: [
            {
              is_master: false,
              State: 1,
              EditVersion: 0,
              id: "a2ae65fb-4896-48dd-9ee8-4575bd6c2cdf",
              order_detail_id: "a2ae65fb-4896-48dd-9ee8-4575bd6c2cdf",
              order_id: "1f84c5be-adce-400c-b03e-ac77dc8104db",
              is_auto_generate: false,
              inventory_item_id: "2e2c6a53-f92e-4d7b-b918-3573d1606537",
              inventory_item_name:
                " Bàn chải bảo vệ răng trẻ em và người lớn PIERROT JUNIOR 1",
              inventory_item_type: 1,
              quantity: 1,
              unit_price: 45000,
              sort_order: 0,
              file_name: "60f98cd6-ded6-486a-b198-891851147a67.png",
              amount: 45000,
              origin_amount: 45000,
              tax_rate: 5,
              tax_rate_display: "5%",
              barcode: "100010",
              pre_unit_price_before_discount: 45000,
              is_e_invoice_component: false,
              is_return: false,
              discounted_unit_price: 45000,
              note: 'curl --location \'https://eshopapp.misa.vn.local/g1/api/ai/order/create\' \\\n--header \'x-ms-tk: 144f5e2cd8bd4090abbda2b848f9aff3\' \\\n--header \'Content-Type: application/json\' \\\n--data \'{\n    "branch_id": "a38f9189-ad87-11ef-a35e-005056b28600",\n    "is_create_order": false,\n    "eshop_info": {\n        "chatbot_id": "1a2b3c4d-1234-5678-9101-abcdefabcdef",\n        "chatbot_name": "Diệu Linh",\n        "partner_uid": "8788352037846024",\n        "seller_id": "378828585321124",\n        "conv_id": "t_1233811014414376",\n        "partner_name": "Vũ",\n        "channel_id": 5\n    },\n    "model": {\n        "customer_tel": "0778580934",\n        "customer_name": "",\n        "recipient_name": "Thủy",\n        "recipient_tel": "0778580934",\n        "recipient_address": "tòa N03T1, ngoại giao đoàn, xuân tảo, Btl, hà nội",\n        "recipient_address_detail": {\n            "street": "Tòa N03T1, Ngoại Giao Đoàn",\n            "ward": "Xuân Tảo",\n            "district": "Bắc Từ Liêm",\n            "province": "Hà Nội"\n        },\n        "employee_note": "",\n        "shipping_note": "",\n        "details": [\n            {\n                "inventory_item_id": "622fc9ea-4e6c-4091-a892-7cd281b80c0d",\n                "product_name": "Áo Thun Nữ Xoắn Eo Trơn (Đen/Freesize <64kg)",\n                "product_quantity": 2.0,\n                "unit_id": "097330eb-f92d-4b88-95a8-1a83fd3d8062",\n                "unit_name": "Chiếc"\n            }\n        ]\n    },\n    "db_id": "bbd0cdf2-0649-11f0-9afa-005056b275fa"\n}\'\n\na605fd88-f547-4d2c-9633-9e3d6bf65a21\nCÔNG TY TNHH JACOB\'S VÕ\n0902919676',
              origin_unit_price: 45000,
              amount_after_discount: 45000,
            },
          ],
        },
        action: 99,
      };

      // Gọi API đặt hàng
      await services.order.create(orderData);

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
