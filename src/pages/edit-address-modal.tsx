const handleSubmit = () => {
  const fullAddress = buildFullAddress();

  if (addressId) {
    // Cập nhật địa chỉ hiện có
    const updatedAddresses = addresses.map((address) => {
      if (address.id === addressId) {
        return {
          ...address,
          fullName: form.fullName,
          phone: form.phone,
          address: fullAddress,
          province: selectedProvince || undefined,
          district: selectedDistrict || undefined,
          ward: selectedWard || undefined,
          hamlet: selectedHamlet || undefined,
        };
      }
      return address;
    });
    setAddresses(updatedAddresses);
  } else {
    // Thêm địa chỉ mới
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
  }

  onClose();
};
