import { Modal, Input, Box } from "zmp-ui";
import { useAtom } from "jotai";
import { shippingAddressesState } from "@/state";
import { ShippingAddress } from "@/types/address";
import { useState } from "react";
import Button from "@/components/button";
import AddressSelector from "./address-selector";
import Address from "@/models/Address";

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
    addressDetail: "",
  });

  const [selectedProvince, setSelectedProvince] = useState<Address | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<Address | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Address | null>(null);
  const [selectedHamlet, setSelectedHamlet] = useState<Address | null>(null);

  const handleAddressSelected = (
    province: Address | null,
    district: Address | null,
    ward: Address | null,
    hamlet: Address | null
  ) => {
    setSelectedProvince(province);
    setSelectedDistrict(district);
    setSelectedWard(ward);
    setSelectedHamlet(hamlet);
  };

  const buildFullAddress = (): string => {
    const parts: string[] = [];

    if (form.addressDetail) {
      parts.push(form.addressDetail);
    }

    if (selectedHamlet) {
      parts.push(selectedHamlet.name);
    }

    if (selectedWard) {
      parts.push(selectedWard.name);
    }

    if (selectedDistrict) {
      parts.push(selectedDistrict.name);
    }

    if (selectedProvince) {
      parts.push(selectedProvince.name);
    }

    return parts.join(", ");
  };

  const handleSubmit = () => {
    const fullAddress = buildFullAddress();

    const newAddress: ShippingAddress = {
      id: Date.now().toString(),
      fullName: form.fullName,
      phone: form.phone,
      address: fullAddress,
      isDefault: addresses.length === 0, // Đặt làm địa chỉ mặc định nếu là địa chỉ đầu tiên
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      ward: selectedWard || undefined,
      hamlet: selectedHamlet || undefined,
    };
    setAddresses([...addresses, newAddress]);
    onClose();

    // Reset form
    setForm({ fullName: "", phone: "", addressDetail: "" });
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedHamlet(null);
  };

  const isFormValid = () => {
    return (
      form.fullName.trim() !== "" &&
      form.phone.trim() !== "" &&
      selectedProvince !== null &&
      selectedDistrict !== null &&
      selectedWard !== null
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Thêm địa chỉ mới"
      modalClassName="h-4/5"
    >
      <div className="p-4 space-y-4 overflow-auto">
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

        <Box className="my-4">
          <AddressSelector onAddressSelected={handleAddressSelected} />
        </Box>

        <Input
          label="Địa chỉ chi tiết"
          type="text"
          placeholder="Số nhà, tên đường..."
          value={form.addressDetail}
          onChange={(e) => setForm({ ...form, addressDetail: e.target.value })}
        />

        <Button
          primary
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Thêm địa chỉ
        </Button>
      </div>
    </Modal>
  );
}
