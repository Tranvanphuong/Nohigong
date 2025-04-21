import React, { useEffect, useState } from "react";
import { Page, Icon, Box, Button, Spinner } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";
import { Order, OrderImpl } from "@/models/Order";
import { services } from "@/services/services";
import { formatCurrency, formatDate } from "@/utils/formatters";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<OrderImpl | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm định dạng giá
  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  // Tải dữ liệu đơn hàng khi component được mount
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        const orderData = await services.order.getOrder(id);
        setOrder(orderData as OrderImpl);
      } catch (err) {
        console.error("Lỗi khi tải thông tin đơn hàng:", err);
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Tạo dữ liệu lịch sử trạng thái đơn hàng dựa trên trạng thái hiện tại
  const getOrderStatusHistory = () => {
    if (!order) return [];

    const statuses = [
      {
        status: "Đặt hàng thành công",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      },
    ];

    if (order.order_status >= 20) {
      statuses.push({
        status: "Người bán đã xác nhận",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    if (order.order_status >= 30) {
      statuses.push({
        status: "Đang xử lý đơn hàng",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    if (order.order_status >= 40) {
      statuses.push({
        status: "Đang giao hàng",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    if (order.order_status >= 50) {
      statuses.push({
        status: "Đơn hàng hoàn thành",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    if (order.order_status === 60) {
      statuses.push({
        status: "Đơn hàng đã hủy",
        time: order.cancel_date
          ? formatDate(order.cancel_date)
          : order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    if (order.order_status === 70) {
      statuses.push({
        status: "Đơn hàng đã trả lại",
        time: order.getFormattedOrderDate(),
        isCompleted: true,
      });
    }

    return statuses;
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <Page className="flex items-center justify-center h-screen">
        <Spinner />
      </Page>
    );
  }

  // Hiển thị thông báo lỗi
  if (error || !order) {
    return (
      <Page className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-center mb-4 text-red-500">
          <Icon icon="zi-close-circle" size={48} />
        </div>
        <div className="text-lg font-medium text-center">
          {error || "Không tìm thấy đơn hàng"}
        </div>
        <Button className="mt-4" onClick={() => navigate("/orders")}>
          Quay lại danh sách đơn hàng
        </Button>
      </Page>
    );
  }

  const statusHistory = getOrderStatusHistory();

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
            {order.getStatusText()}
          </div>
          <div className="text-sm">Mã đơn hàng: {order.ref_no}</div>
        </div>

        <div className="p-4 bg-white">
          <div className="relative">
            {statusHistory.map((step, index) => (
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
                  {index < statusHistory.length - 1 && (
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
              <Icon icon="zi-user" />
            </div>
            <span className="font-medium">
              {order.seller_name || order.page_name}
            </span>
          </div>
        </div>
      </Box>

      {/* Thông tin sản phẩm */}
      <Box className="mb-3">
        <div className="p-4">
          <h2 className="font-medium mb-3">Sản phẩm đã mua</h2>
          {order.Details.map((item, index) => (
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
                <div className="text-primary mt-1">
                  {formatPrice(order.total_amount / order.total_item_quantity)}
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
              <span>{order.getFormattedTotal()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phí vận chuyển:</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giảm giá:</span>
              <span className="text-primary">-{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between font-medium mt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">{order.getFormattedTotal()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phương thức thanh toán:</span>
              <span>
                {order.payment_type || "Thanh toán khi nhận hàng (COD)"}
              </span>
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
              <div>{order.recipient_name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Số điện thoại:</div>
              <div>{order.recipient_tel}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Địa chỉ:</div>
              <div>{order.recipient_address}</div>
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
              <span>{order.ref_no}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Thời gian đặt hàng:</span>
              <span>{order.getFormattedOrderDate()}</span>
            </div>
            {order.employee_note && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ghi chú:</span>
                <span>{order.employee_note}</span>
              </div>
            )}
          </div>
        </div>
      </Box>

      {/* Các nút tác vụ */}
      <div className="p-4 flex space-x-3">
        <Button className="flex-1 bg-primary text-white">
          Liên hệ người bán
        </Button>
        {!order.canCancel() && (
          <Button className="flex-1 bg-gray-200 text-gray-800">Mua lại</Button>
        )}
        {order.canCancel() && (
          <Button
            className="flex-1 bg-red-500 text-white"
            onClick={() => {
              // Xử lý hủy đơn hàng - sẽ thêm API sau
              navigate("/orders");
            }}
          >
            Hủy đơn hàng
          </Button>
        )}
      </div>
    </Page>
  );
};

export default OrderDetail;
