import { Modal, Input } from "zmp-ui";
import { useAtom } from "jotai";
import { shippingAddressesState } from "@/state";
import { ShippingAddress } from "@/types";
import { useState } from "react";
import Button from "@/components/button";

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddAddressModal({
  visible,
  onClose,
}: AddAddressModalProps) {
  const [addresses, setAddresses] = useAtom(shippingAddressesState);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleSubmit = () => {
    const newAddress: ShippingAddress = {
      id: Date.now().toString(),
      ...form,
      isDefault: addresses.length === 0, // Đặt làm địa chỉ mặc định nếu là địa chỉ đầu tiên
    };
    setAddresses([...addresses, newAddress]);
    onClose();
    setForm({ fullName: "", phone: "", address: "" });
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Thêm địa chỉ mới"
      modalClassName="h-4/5"
    >
      <div className="p-4 space-y-4">
        <Input
          label="Họ và tên"
          type="text"
          placeholder="Nhập họ và tên người nhận"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Input
          label="Số điện thoại"
          type="text"
          placeholder="Nhập số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input.TextArea
          label="Địa chỉ"
          placeholder="Nhập địa chỉ nhận hàng"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={3}
        />
        <Button
          primary
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={!form.fullName || !form.phone || !form.address}
        >
          Thêm địa chỉ
        </Button>
      </div>
    </Modal>
  );
}
