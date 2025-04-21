import { Page, Box, Icon } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import CusButton from "@/components/button";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <Page className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            Không tìm thấy thông tin đơn hàng
          </div>
          <CusButton onClick={() => navigate("/")}>Về trang chủ</CusButton>
        </div>
      </Page>
    );
  }

  return (
    <Page className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4">
        {/* Icon và thông báo thành công */}
        <Box className="rounded-lg bg-white p-6 mb-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="zi-check-circle" className="text-green-500 text-3xl" />
          </div>
          <h1 className="text-xl font-medium text-gray-800 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-500">Cảm ơn bạn đã mua hàng</p>
        </Box>

        {/* Thông tin đơn hàng */}
        <Box className="rounded-lg bg-white p-4 mb-4">
          <h2 className="font-medium text-gray-800 mb-4">Thông tin đơn hàng</h2>
          <div className="space-y-3">
            {/* Địa chỉ nhận hàng */}
            <div>
              <div className="text-gray-500 mb-1">Địa chỉ nhận hàng:</div>
              <div className="text-gray-800">{orderData.address.fullName}</div>
              <div className="text-gray-600">{orderData.address.phone}</div>
              <div className="text-gray-600">{orderData.address.address}</div>
            </div>

            {/* Danh sách sản phẩm */}
            <div>
              <div className="text-gray-500 mb-2">Sản phẩm:</div>
              {orderData.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div className="text-gray-800">{item.productId}</div>
                    <div className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </div>
                    {item.options && (
                      <div className="text-sm text-gray-500">
                        {item.options.size && `Size: ${item.options.size}`}
                        {item.options.color && ` - Màu: ${item.options.color}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Ghi chú */}
            {(orderData.notes.seller || orderData.notes.shipping) && (
              <div>
                <div className="text-gray-500 mb-1">Ghi chú:</div>
                {orderData.notes.seller && (
                  <div className="text-gray-600 mb-1">
                    <span className="text-gray-500">Người bán: </span>
                    {orderData.notes.seller}
                  </div>
                )}
                {orderData.notes.shipping && (
                  <div className="text-gray-600">
                    <span className="text-gray-500">Vận chuyển: </span>
                    {orderData.notes.shipping}
                  </div>
                )}
              </div>
            )}

            {/* Tổng tiền */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="text-xl font-medium text-primary">
                  {formatPrice(orderData.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </Box>

        {/* Nút điều hướng */}
        <div className="space-y-3">
          <CusButton className="w-full" onClick={() => navigate("/orders")}>
            Xem đơn hàng của tôi
          </CusButton>
          <CusButton
            className="w-full bg-gray-100 text-gray-800"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </CusButton>
        </div>
      </div>
    </Page>
  );
}
