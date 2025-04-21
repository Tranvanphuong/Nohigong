import React, { useState } from "react";
import { Box, Page, Icon, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";

// Component Tab cho các trạng thái đơn hàng
const OrderTabs = ({ activeTab, onTabChange }) => {
  const tabs = ["Tất cả", "Chờ giao hàng", "Đã giao", "Trả hàng", "Đã hủy"];

  return (
    <div className="flex justify-between bg-white overflow-x-auto sticky top-0 z-10 border-b">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`py-3 px-3 whitespace-nowrap cursor-pointer ${
            activeTab === tab
              ? "text-primary border-b-2 border-primary font-medium"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

// Component đơn hàng
const OrderItem = ({ order, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box className="mb-3 rounded-lg bg-white">
      <div className="border-b p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mr-2">
              <img
                src={order.storeLogo || "https://placekitten.com/50/50"}
                alt={order.storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">{order.storeName}</span>
          </div>
          <span className="text-primary font-medium">{order.status}</span>
        </div>
      </div>

      <div className="p-3 border-b" onClick={onClick}>
        {order.items.map((item, index) => (
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
              <div className="text-primary">{formatPrice(item.price)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500">
            Tổng {order.items.reduce((acc, item) => acc + item.quantity, 0)} sản
            phẩm:
          </span>
          <span className="font-medium text-lg">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="flex justify-end space-x-3">
          {order.status === "Đã giao" && (
            <Button
              size="small"
              className="border border-gray-300 text-gray-800"
            >
              Đánh giá
            </Button>
          )}
          {order.status === "Chờ giao hàng" && (
            <Button
              size="small"
              className="border border-gray-300 text-gray-800"
            >
              Hủy đơn
            </Button>
          )}
          <Button size="small" className="bg-primary text-white">
            Mua lại
          </Button>
        </div>
      </div>
    </Box>
  );
};

// Trang chính theo dõi đơn hàng
const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Đã giao");

  // Dữ liệu mẫu cho đơn hàng
  const mockOrders = [
    {
      id: 1,
      storeName: "UNITER Shoes Store",
      storeLogo: "",
      status: "Hoàn thành",
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
      totalAmount: 214920,
    },
    {
      id: 2,
      storeName: "Safe1.Store",
      storeLogo: "",
      status: "Hoàn thành",
      items: [
        {
          id: 201,
          name: "Miếng lót giày chống rộng, đệm gót giảm đau",
          image: "https://placekitten.com/201/201",
          variant: "Đen,10mm (1 cặp)",
          quantity: 1,
          price: 18000,
        },
      ],
      totalAmount: 18000,
    },
    {
      id: 3,
      storeName: "KÍNH MẮT LILY LOOK & CARE",
      storeLogo: "",
      status: "Hoàn thành",
      items: [
        {
          id: 301,
          name: "Kính chắn bụi đi đường LILY EYEWEAR chống tia UV",
          image: "https://placekitten.com/202/202",
          variant: "TUJKC1624 -ĐEN +TRẮNG",
          quantity: 1,
          price: 158000,
        },
      ],
      totalAmount: 158000,
    },
  ];

  const filteredOrders =
    activeTab === "Tất cả"
      ? mockOrders
      : mockOrders.filter((order) => {
          if (activeTab === "Chờ giao hàng") return order.status === "Chờ giao";
          if (activeTab === "Đã giao") return order.status === "Hoàn thành";
          if (activeTab === "Trả hàng") return order.status === "Đã trả";
          if (activeTab === "Đã hủy") return order.status === "Đã hủy";
          return false;
        });

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Page className="bg-gray-50">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onClick={() => handleOrderClick(order.id)}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">📦</div>
            <div className="text-gray-500">Không có đơn hàng nào</div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default OrdersPage;
