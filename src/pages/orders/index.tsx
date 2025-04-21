import React, { useState, useEffect } from "react";
import { Box, Page, Icon, Button, Spinner } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { OrderImpl } from "@/models/Order";
import { services } from "@/services/services";
import { formatCurrency } from "@/utils/formatters";

// Component Tab cho các trạng thái đơn hàng
const OrderTabs = ({ activeTab, onTabChange }) => {
  const tabs = ["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

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
    return formatCurrency(price);
  };

  // Lấy thông tin trạng thái đơn hàng
  const getStatusText = () => {
    if (!order) return "";

    switch (order.order_status) {
      case 10:
        return "Đơn mới";
      case 20:
        return "Đã xác nhận";
      case 30:
        return "Đang xử lý";
      case 40:
        return "Đang giao hàng";
      case 50:
        return "Hoàn thành";
      case 60:
        return "Đã hủy";
      case 70:
        return "Đã trả hàng";
      default:
        return "Không xác định";
    }
  };

  // Lấy màu cho trạng thái đơn hàng
  const getStatusColor = () => {
    if (!order) return "text-gray-500";

    switch (order.order_status) {
      case 10:
        return "text-blue-500";
      case 20:
        return "text-blue-500";
      case 30:
        return "text-yellow-500";
      case 40:
        return "text-yellow-500";
      case 50:
        return "text-green-500";
      case 60:
        return "text-red-500";
      case 70:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Box className="mb-3 rounded-lg bg-white">
      <div className="border-b p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mr-2">
              <Icon icon="zi-user" />
            </div>
            <span className="font-medium">
              {order.seller_name || order.page_name}
            </span>
          </div>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="p-3 border-b" onClick={onClick}>
        {order.Details &&
          order.Details.map((item, index) => (
            <div key={index} className="flex mb-3 last:mb-0">
              <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                {item.file_name ? (
                  <img
                    src={services.product.getImageUrl(item.file_name)}
                    alt={item.inventory_item_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="zi-photo" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1 line-clamp-2">
                  {item.inventory_item_name}
                </div>
                <div className="text-gray-500 text-sm">
                  {item.sku_code && (
                    <span className="mr-1">SKU: {item.sku_code}</span>
                  )}
                  <span>x{item.quantity}</span>
                </div>
                <div className="text-primary">
                  {formatPrice(
                    order.total_amount / (order.total_item_quantity || 1)
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500">
            Tổng {order.total_item_quantity || order.Details?.length || 0} sản
            phẩm:
          </span>
          <span className="font-medium text-lg">
            {formatPrice(order.total_amount)}
          </span>
        </div>

        <div className="flex justify-end space-x-3">
          {order.order_status === 50 && (
            <Button
              size="small"
              className="border border-gray-300 text-gray-800"
            >
              Đánh giá
            </Button>
          )}
          {(order.order_status === 10 || order.order_status === 20) && (
            <Button
              size="small"
              className="border border-gray-300 text-gray-800"
            >
              Hủy đơn
            </Button>
          )}
          <Button
            size="small"
            className="bg-primary text-white"
            onClick={(e) => {
              e.stopPropagation();
              // Xử lý mua lại sau này
            }}
          >
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
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [orders, setOrders] = useState<OrderImpl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await services.order.getOrderList(1, 20);
        setOrders(result.orders);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc đơn hàng theo tab đang chọn
  const getFilteredOrders = () => {
    if (activeTab === "Tất cả") return orders;

    return orders.filter((order) => {
      if (activeTab === "Chờ xác nhận")
        return order.order_status === 10 || order.order_status === 20;
      if (activeTab === "Đang giao")
        return order.order_status === 30 || order.order_status === 40;
      if (activeTab === "Hoàn thành") return order.order_status === 50;
      if (activeTab === "Đã hủy")
        return order.order_status === 60 || order.order_status === 70;
      return false;
    });
  };

  const filteredOrders = getFilteredOrders();

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <Page className="bg-gray-50">
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      </Page>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <Page className="bg-gray-50">
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="text-center mb-4 text-red-500">
            <Icon icon="zi-close-circle" size={48} />
          </div>
          <div className="text-lg font-medium text-center">{error}</div>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem
              key={order.order_id}
              order={order}
              onClick={() => handleOrderClick(order.order_id)}
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
