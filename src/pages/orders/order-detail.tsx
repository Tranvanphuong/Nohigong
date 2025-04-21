import React from "react";
import { Page, Icon, Box, Button } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Hàm định dạng giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Dữ liệu mẫu chi tiết đơn hàng
  const mockOrderDetail = {
    id: 1,
    orderNumber: "DH23456789",
    storeName: "UNITER Shoes Store",
    storeLogo: "",
    status: "Hoàn thành",
    statusHistory: [
      {
        status: "Đặt hàng thành công",
        time: "18/07/2023 17:11",
        isCompleted: true,
      },
      {
        status: "Người bán đang chuẩn bị hàng",
        time: "18/07/2023 17:32",
        isCompleted: true,
      },
      {
        status: "Đơn hàng đang vận chuyển",
        time: "19/07/2023 08:45",
        isCompleted: true,
      },
      {
        status: "Đơn hàng đã được giao",
        time: "20/07/2023 09:30",
        isCompleted: true,
      },
      {
        status: "Đơn hàng hoàn thành",
        time: "20/07/2023 09:45",
        isCompleted: true,
      },
    ],
    items: [
      {
        id: 101,
        name: "Ckxmhm 38-47 Dép Nam Nhẹ Bền Sandal",
        image: "https://placekitten.com/200/200",
        variant: "Kaki,41",
        quantity: 1,
        price: 214920,
      },
    ],
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    shippingInfo: {
      name: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
    },
    totalAmount: 214920,
    shippingFee: 0,
    discount: 0,
    finalAmount: 214920,
    placedAt: "18/07/2023 17:11",
  };

  return (
    <Page className="bg-gray-50">
      <div className="bg-white flex items-center px-4 py-2 sticky top-0 z-10">
        <div
          className="cursor-pointer pr-4"
          onClick={() => navigate("/orders")}
        >
          <Icon icon="zi-arrow-left" />
        </div>
        <div className="text-lg font-medium">Chi tiết đơn hàng</div>
      </div>

      {/* Trạng thái đơn hàng */}
      <Box className="mb-3 rounded-none">
        <div className="p-4 bg-primary text-white">
          <div className="font-medium text-lg mb-1">
            {mockOrderDetail.status}
          </div>
          <div className="text-sm">
            Mã đơn hàng: {mockOrderDetail.orderNumber}
          </div>
        </div>

        <div className="p-4 bg-white">
          <div className="relative">
            {mockOrderDetail.statusHistory.map((step, index) => (
              <div key={index} className="flex mb-4 last:mb-0">
                <div className="mr-3 relative">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step.isCompleted ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    {step.isCompleted && (
                      <Icon icon="zi-check" className="text-white text-xs" />
                    )}
                  </div>
                  {index < mockOrderDetail.statusHistory.length - 1 && (
                    <div
                      className={`absolute top-5 left-2.5 w-0.5 h-full -ml-px ${
                        step.isCompleted ? "bg-primary" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.status}</div>
                  <div className="text-sm text-gray-500">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>

      {/* Thông tin người bán */}
      <Box className="mb-3">
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mr-2">
              <img
                src={
                  mockOrderDetail.storeLogo || "https://placekitten.com/50/50"
                }
                alt={mockOrderDetail.storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">{mockOrderDetail.storeName}</span>
          </div>
        </div>
      </Box>

      {/* Thông tin sản phẩm */}
      <Box className="mb-3">
        <div className="p-4">
          <h2 className="font-medium mb-3">Sản phẩm đã mua</h2>
          {mockOrderDetail.items.map((item, index) => (
            <div key={index} className="flex mb-3 last:mb-0">
              <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1 line-clamp-2">{item.name}</div>
                <div className="text-gray-500 text-sm">
                  {item.variant && <span className="mr-1">{item.variant}</span>}
                  <span>x{item.quantity}</span>
                </div>
                <div className="text-primary mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Box>

      {/* Thông tin thanh toán */}
      <Box className="mb-3">
        <div className="p-4">
          <h2 className="font-medium mb-3">Thông tin thanh toán</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng tiền hàng:</span>
              <span>{formatPrice(mockOrderDetail.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phí vận chuyển:</span>
              <span>{formatPrice(mockOrderDetail.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giảm giá:</span>
              <span className="text-primary">
                -{formatPrice(mockOrderDetail.discount)}
              </span>
            </div>
            <div className="flex justify-between font-medium mt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">
                {formatPrice(mockOrderDetail.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phương thức thanh toán:</span>
              <span>{mockOrderDetail.paymentMethod}</span>
            </div>
          </div>
        </div>
      </Box>

      {/* Thông tin giao hàng */}
      <Box className="mb-3">
        <div className="p-4">
          <h2 className="font-medium mb-3">Thông tin giao hàng</h2>
          <div className="space-y-2">
            <div>
              <div className="text-gray-500 text-sm">Người nhận:</div>
              <div>{mockOrderDetail.shippingInfo.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Số điện thoại:</div>
              <div>{mockOrderDetail.shippingInfo.phone}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Địa chỉ:</div>
              <div>{mockOrderDetail.shippingInfo.address}</div>
            </div>
          </div>
        </div>
      </Box>

      {/* Thông tin đơn hàng */}
      <Box className="mb-3">
        <div className="p-4">
          <h2 className="font-medium mb-3">Thông tin đơn hàng</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <span>{mockOrderDetail.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Thời gian đặt hàng:</span>
              <span>{mockOrderDetail.placedAt}</span>
            </div>
          </div>
        </div>
      </Box>

      {/* Các nút tác vụ */}
      <div className="p-4 flex space-x-3">
        <Button className="flex-1 bg-primary text-white">
          Liên hệ người bán
        </Button>
        <Button className="flex-1 bg-gray-200 text-gray-800">Mua lại</Button>
      </div>
    </Page>
  );
};

export default OrderDetail;
