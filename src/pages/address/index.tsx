import { Page, Box } from "zmp-ui";
import { useAtom } from "jotai";
import { shippingAddressesState, selectedAddressState } from "@/state";
import Button from "@/components/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AddAddressModal from "./add-address-modal";
import { ShippingAddress } from "@/types";

export default function AddressPage() {
  const [addresses, setAddresses] = useAtom(shippingAddressesState);
  const [, setSelectedAddress] = useAtom(selectedAddressState);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isFromCheckout = location.state?.from === "checkout";

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address);
    if (isFromCheckout) {
      navigate("/checkout");
    }
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
  };

  return (
    <Page className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 space-y-4">
        {/* Danh sách địa chỉ */}
        {addresses.map((address) => (
          <Box key={address.id} className="rounded-lg">
            <div
              className="p-4 space-y-2 cursor-pointer"
              onClick={() => handleSelectAddress(address)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{address.fullName}</div>
                {address.isDefault && (
                  <div className="text-xs text-primary px-2 py-1 bg-primary/10 rounded">
                    Mặc định
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">{address.phone}</div>
              <div className="text-sm text-gray-500">{address.address}</div>
              <div className="flex justify-end space-x-4 mt-2 pt-2 border-t">
                {!address.isDefault && (
                  <button
                    className="text-sm text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(address.id);
                    }}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button
                  className="text-sm text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newAddresses = addresses.filter(
                      (a) => a.id !== address.id
                    );
                    setAddresses(newAddresses);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </Box>
        ))}

        {/* Nút thêm địa chỉ */}
        <Button
          className="w-full flex items-center justify-center space-x-2"
          onClick={() => setShowAddAddress(true)}
        >
          <span className="text-2xl">+</span>
          <span>Thêm địa chỉ mới</span>
        </Button>
      </div>

      <AddAddressModal
        visible={showAddAddress}
        onClose={() => setShowAddAddress(false)}
      />
    </Page>
  );
}
