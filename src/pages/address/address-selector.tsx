import { useState, useEffect } from "react";
import { Select, Box, Sheet, Text, Spinner } from "zmp-ui";
import addressService from "@/services/addressService";
import Address from "@/models/Address";
import { AddressLevel } from "@/types/address";

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

  const [loading, setLoading] = useState<boolean>(false);

  // Tải dữ liệu tỉnh/thành phố khi component được mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(true);
      try {
        const provinceList = await addressService.getProvinces();
        setProvinces(provinceList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProvinces();
  }, []);

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = async (provinceId: string) => {
    const province = provinces.find((p) => p.id === provinceId) || null;
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedHamlet(null);
    setDistricts([]);
    setWards([]);
    setHamlets([]);

    if (province) {
      setLoading(true);
      try {
        const districtList = await addressService.getDistrictsByProvince(
          province.id
        );
        setDistricts(districtList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      } finally {
        setLoading(false);
      }
    }

    onAddressSelected(province, null, null, null);
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = async (districtId: string) => {
    const district = districts.find((d) => d.id === districtId) || null;
    setSelectedDistrict(district);
    setSelectedWard(null);
    setSelectedHamlet(null);
    setWards([]);
    setHamlets([]);

    if (district) {
      setLoading(true);
      try {
        const wardList = await addressService.getWardsByDistrict(district.id);
        setWards(wardList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phường/xã:", error);
      } finally {
        setLoading(false);
      }
    }

    onAddressSelected(selectedProvince, district, null, null);
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = async (wardId: string) => {
    const ward = wards.find((w) => w.id === wardId) || null;
    setSelectedWard(ward);
    setSelectedHamlet(null);
    setHamlets([]);

    if (ward) {
      setLoading(true);
      try {
        const hamletList = await addressService.getHamletsByWard(ward.id);
        setHamlets(hamletList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách ấp/thôn:", error);
      } finally {
        setLoading(false);
      }
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
      {loading && (
        <Box className="flex justify-center py-2">
          <Spinner />
        </Box>
      )}

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
