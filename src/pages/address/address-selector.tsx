import { useState, useEffect } from "react";
import { Select, Box, Sheet, Text } from "zmp-ui";
import addressService from "@/services/addressService";
import Address from "@/models/Address";

interface AddressSelectorProps {
  onAddressSelected: (
    province: Address | null,
    district: Address | null,
    ward: Address | null,
    hamlet: Address | null
  ) => void;
}

export default function AddressSelector({
  onAddressSelected,
}: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Address[]>([]);
  const [districts, setDistricts] = useState<Address[]>([]);
  const [wards, setWards] = useState<Address[]>([]);
  const [hamlets, setHamlets] = useState<Address[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Address | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<Address | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Address | null>(null);
  const [selectedHamlet, setSelectedHamlet] = useState<Address | null>(null);

  // Tải dữ liệu tỉnh/thành phố khi component được mount
  useEffect(() => {
    const loadData = async () => {
      await addressService.loadAddresses();
      const provinceList = addressService.getProvinces();
      setProvinces(provinceList);
    };

    loadData();
  }, []);

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (provinceId: string) => {
    const province = provinces.find((p) => p.id === provinceId) || null;
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedHamlet(null);

    if (province) {
      const districtList = addressService.getDistrictsByProvince(province.id);
      setDistricts(districtList);
    } else {
      setDistricts([]);
    }

    onAddressSelected(province, null, null, null);
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (districtId: string) => {
    const district = districts.find((d) => d.id === districtId) || null;
    setSelectedDistrict(district);
    setSelectedWard(null);
    setSelectedHamlet(null);

    if (district) {
      const wardList = addressService.getWardsByDistrict(district.id);
      setWards(wardList);
    } else {
      setWards([]);
    }

    onAddressSelected(selectedProvince, district, null, null);
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (wardId: string) => {
    const ward = wards.find((w) => w.id === wardId) || null;
    setSelectedWard(ward);
    setSelectedHamlet(null);

    if (ward) {
      const hamletList = addressService.getHamletsByWard(ward.id);
      setHamlets(hamletList);
    } else {
      setHamlets([]);
    }

    onAddressSelected(selectedProvince, selectedDistrict, ward, null);
  };

  // Xử lý khi chọn ấp/thôn
  const handleHamletChange = (hamletId: string) => {
    const hamlet = hamlets.find((h) => h.id === hamletId) || null;
    setSelectedHamlet(hamlet);

    onAddressSelected(selectedProvince, selectedDistrict, selectedWard, hamlet);
  };

  const { Option } = Select;

  return (
    <Box className="space-y-4">
      <Select
        label="Tỉnh/Thành phố"
        placeholder="Chọn Tỉnh/Thành phố"
        value={selectedProvince?.id || ""}
        onChange={(value) => handleProvinceChange(value as string)}
        closeOnSelect={true}
      >
        {provinces.map((province) => (
          <Option key={province.id} value={province.id} title={province.name} />
        ))}
      </Select>

      {selectedProvince && (
        <Select
          label="Quận/Huyện"
          placeholder="Chọn Quận/Huyện"
          value={selectedDistrict?.id || ""}
          onChange={(value) => handleDistrictChange(value as string)}
          closeOnSelect={true}
        >
          {districts.map((district) => (
            <Option
              key={district.id}
              value={district.id}
              title={district.name}
            />
          ))}
        </Select>
      )}

      {selectedDistrict && (
        <Select
          label="Phường/Xã"
          placeholder="Chọn Phường/Xã"
          value={selectedWard?.id || ""}
          onChange={(value) => handleWardChange(value as string)}
          closeOnSelect={true}
        >
          {wards.map((ward) => (
            <Option key={ward.id} value={ward.id} title={ward.name} />
          ))}
        </Select>
      )}

      {selectedWard && hamlets.length > 0 && (
        <Select
          label="Ấp/Thôn"
          placeholder="Chọn Ấp/Thôn"
          value={selectedHamlet?.id || ""}
          onChange={(value) => handleHamletChange(value as string)}
          closeOnSelect={true}
        >
          {hamlets.map((hamlet) => (
            <Option key={hamlet.id} value={hamlet.id} title={hamlet.name} />
          ))}
        </Select>
      )}
    </Box>
  );
}
