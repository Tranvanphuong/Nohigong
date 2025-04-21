import Address from "@/models/Address";
import { AddressData, AddressLevel } from "@/types/address";
import mockAddresses from "@/mock/addresses";

class AddressService {
  private addresses: Address[] = [];
  private initialized: boolean = false;

  /**
   * Tải dữ liệu địa chỉ từ API hoặc nguồn dữ liệu khác
   */
  async loadAddresses(): Promise<void> {
    try {
      if (this.initialized) {
        return; // Đã tải dữ liệu rồi
      }

      // Trong môi trường thực tế, sẽ gọi API
      // const response = await fetch("/api/addresses");
      // const data: AddressData[] = await response.json();

      // Sử dụng mock data cho phát triển
      const data: AddressData[] = mockAddresses;
      this.addresses = data.map((item) => new Address(item));
      this.initialized = true;
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
      this.addresses = [];
    }
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   */
  getProvinces(): Address[] {
    return this.addresses.filter(
      (address) => address.level === AddressLevel.Province
    );
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   */
  getDistrictsByProvince(provinceId: string): Address[] {
    return this.addresses.filter(
      (address) =>
        address.level === AddressLevel.District &&
        address.parent_id === provinceId
    );
  }

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   */
  getWardsByDistrict(districtId: string): Address[] {
    return this.addresses.filter(
      (address) =>
        address.level === AddressLevel.Ward && address.parent_id === districtId
    );
  }

  /**
   * Lấy danh sách ấp/thôn theo phường/xã
   */
  getHamletsByWard(wardId: string): Address[] {
    return this.addresses.filter(
      (address) =>
        address.level === AddressLevel.Hamlet && address.parent_id === wardId
    );
  }

  /**
   * Tìm địa chỉ theo ID
   */
  findById(id: string): Address | undefined {
    return this.addresses.find((address) => address.id === id);
  }

  /**
   * Tìm địa chỉ theo key_id
   */
  findByKeyId(keyId: string): Address | undefined {
    return this.addresses.find((address) => address.key_id === keyId);
  }

  /**
   * Lấy địa chỉ cha của một địa chỉ
   */
  getParentAddress(address: Address): Address | undefined {
    return this.addresses.find((item) => item.id === address.parent_id);
  }

  /**
   * Tạo chuỗi địa chỉ đầy đủ từ cấp thấp nhất đến cấp tỉnh/thành phố
   */
  getFullAddressString(addressId: string): string {
    const parts: string[] = [];
    let currentAddress = this.findById(addressId);

    while (currentAddress) {
      parts.unshift(currentAddress.name);
      currentAddress = this.getParentAddress(currentAddress);
    }

    return parts.join(", ");
  }
}

// Tạo instance singleton
const addressService = new AddressService();
export default addressService;
