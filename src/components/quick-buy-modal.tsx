import { useAtom, useAtomValue } from "jotai";
import {
  quickBuyState,
  isQuickBuyModalOpenState,
  paymentMethodsState,
  productDetailState,
} from "@/state";
import { formatPrice } from "@/utils/format";
import { useCallback } from "react";

export default function QuickBuyModal() {
  const [isOpen, setIsOpen] = useAtom(isQuickBuyModalOpenState);
  const [quickBuy, setQuickBuy] = useAtom(quickBuyState);
  const product = useAtomValue(productDetailState);
  const paymentMethods = useAtomValue(paymentMethodsState);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleSubmit = useCallback(() => {
    // TODO: Xử lý đặt hàng
    console.log("Đặt hàng:", quickBuy);
    handleClose();
  }, [quickBuy, handleClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Mua ngay</h2>
          <button onClick={handleClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex gap-4 mb-4">
          <img
            src={
              product.file_name
                ? `https://eshopapp.misa.vn/g2/api/file/files?type=3&dbId=678b418c-e461-11ef-9e58-005056b275fa&file=${product.file_name}`
                : ""
            }
            alt={product.inventory_item_name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{product.inventory_item_name}</h3>
            <p className="text-red-500 font-semibold">
              {formatPrice(product.unit_price)}
            </p>
          </div>
        </div>

        {/* Form đặt hàng */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ giao hàng
            </label>
            <input
              type="text"
              value={quickBuy.address}
              onChange={(e) =>
                setQuickBuy({ ...quickBuy, address: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={quickBuy.note}
              onChange={(e) =>
                setQuickBuy({ ...quickBuy, note: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Nhập ghi chú (không bắt buộc)"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức thanh toán
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label key={method.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={quickBuy.paymentMethod === method.id}
                    onChange={() =>
                      setQuickBuy({ ...quickBuy, paymentMethod: method.id })
                    }
                  />
                  <span>
                    {method.icon} {method.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Tổng tiền:</span>
              <span className="font-semibold text-red-500">
                {formatPrice(product.unit_price * quickBuy.quantity)}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
