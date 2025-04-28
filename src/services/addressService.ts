import Address from "@/models/Address";
import { AddressData, AddressLevel } from "@/types/address";
import { getAsync } from "@/utils/request";

class AddressService {
  private addresses: Map<string, Address[]> = new Map();
  private initialized: boolean = false;

  /**
   * Tải dữ liệu địa chỉ từ API với level và parentId tương ứng
   */
  async getAddressesByLevelAndParent(
    level: number,
    parentId?: string
  ): Promise<Address[]> {
    try {
      const cacheKey = `${level}_${parentId || "root"}`;

      // Kiểm tra cache trước khi gọi API
      if (this.addresses.has(cacheKey)) {
        return this.addresses.get(cacheKey) || [];
      }

      // Xây dựng URL API
      let url = `Logistics/addresses?shippingPartnerCode=GHTK&level=${level}`;
      if (parentId) {
        url += `&parentId=${parentId}`;
      }

      // Gọi API
      const response = await getAsync<Address[]>(url);
      const addressList = response.map(
        (item: Address) =>
          new Address({
            key_id: item.id,
            id: item.id,
            parent_id: item.parent_id || "",
            key_parent_id:
              response.find((parentItem) => parentItem.id === item.parent_id)
                ?.key_id || "",
            name: item.name,
            level: item.level,
          })
      );

      // Lưu vào cache
      this.addresses.set(cacheKey, addressList);

      return addressList;
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
      return [];
    }
  }

  /**
   * Lấy danh sách tỉnh/thành phố (Level 1)
   */
  async getProvinces(): Promise<Address[]> {
    return this.getAddressesByLevelAndParent(AddressLevel.Province);
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố (Level 2)
   */
  async getDistrictsByProvince(provinceId: string): Promise<Address[]> {
    return this.getAddressesByLevelAndParent(AddressLevel.District, provinceId);
  }

  /**
   * Lấy danh sách phường/xã theo quận/huyện (Level 3)
   */
  async getWardsByDistrict(districtId: string): Promise<Address[]> {
    return this.getAddressesByLevelAndParent(AddressLevel.Ward, districtId);
  }

  /**
   * Lấy danh sách ấp/thôn theo phường/xã (Level 4)
   */
  async getHamletsByWard(wardId: string): Promise<Address[]> {
    return this.getAddressesByLevelAndParent(AddressLevel.Hamlet, wardId);
  }

  /**
   * Tìm địa chỉ theo ID từ cache
   */
  findById(id: string, level: number): Address | undefined {
    for (const [key, addresses] of this.addresses.entries()) {
      if (key.startsWith(`${level}_`)) {
        const found = addresses.find((address) => address.id === id);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Tìm địa chỉ theo key_id
   */
  findByKeyId(keyId: string): Address | undefined {
    for (const [key, addresses] of this.addresses.entries()) {
      const found = addresses.find((address) => address.key_id === keyId);
      if (found) return found;
    }
    return undefined;
  }

  /**
   * Lấy địa chỉ cha của một địa chỉ
   */
  getParentAddress(address: Address): Address | undefined {
    return this.findById(address.parent_id, address.level - 1);
  }

  /**
   * Tạo chuỗi địa chỉ đầy đủ từ cấp thấp nhất đến cấp tỉnh/thành phố
   */
  getFullAddressString(addressId: string): string {
    const parts: string[] = [];
    let currentAddress = this.findById(addressId, AddressLevel.Ward);

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
