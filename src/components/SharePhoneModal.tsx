import React, { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/utils/format";
import { getPhoneNumber } from "zmp-sdk";
import { getToken } from "@/utils/auth";

interface SharePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const savePhoneNumber = async (phone: string) => {
  console.log("savePhoneNumber", phone);
  try {
    let savePhoneBody = {
      customer_name: "test 8",
      phone_number: phone,
      address: "hà nội",
      channel_id: 10,
      channel_user_id: "nggiitss",
      channel_user_name: "Anggitsss",
      seller_id: "zalo",
    };
    const token = getToken();
    const response = await fetch(
      "https://eshopapp.misa.vn/g2/api/socialmob/CustomerChannels/save-customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(savePhoneBody),
      }
    );

    if (!response.ok) {
      throw new Error("Không thể lưu số điện thoại");
    }

    console.log("Đã lưu số điện thoại thành công");
  } catch (error) {
    console.error("Lỗi khi lưu số điện thoại:", error);
  }
};

export default function SharePhoneModal({
  isOpen,
  onClose,
}: SharePhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      getPhoneNumber().then((result) => {
        if (result.number) {
          setPhoneNumber(result.number);
          // Gửi số điện thoại lên server khi nhận được
          savePhoneNumber(result.number);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber || "");
    alert("Đã sao chép số điện thoại");
  };

  const handleShareMessage = () => {
    const message = `Số điện thoại của tôi: ${phoneNumber || ""}`;
    if (navigator.share) {
      navigator.share({
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert("Đã sao chép số điện thoại");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-80">
        <h3 className="text-lg font-medium mb-4">Chia sẻ số điện thoại</h3>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Số điện thoại của bạn</div>
          <div className="text-lg font-medium">
            {formatPhoneNumber(phoneNumber || "")}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={handleCopyPhone}
            className="w-full py-2 bg-primary text-white rounded-lg"
          >
            Sao chép số điện thoại
          </button>

          <button
            onClick={handleShareMessage}
            className="w-full py-2 bg-secondary text-primary rounded-lg"
          >
            Chia sẻ qua tin nhắn
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
