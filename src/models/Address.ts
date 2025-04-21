import { AddressData, AddressLevel } from "@/types/address";

class Address implements AddressData {
  key_id: string;
  id: string;
  parent_id: string;
  key_parent_id: string;
  name: string;
  level: number;

  constructor(data: AddressData) {
    this.key_id = data.key_id;
    this.id = data.id;
    this.parent_id = data.parent_id;
    this.key_parent_id = data.key_parent_id;
    this.name = data.name;
    this.level = data.level;
  }

  /**
   * Kiểm tra nếu địa chỉ là cấp Tỉnh/Thành phố
   */
  isProvince(): boolean {
    return this.level === AddressLevel.Province;
  }

  /**
   * Kiểm tra nếu địa chỉ là cấp Quận/Huyện
   */
  isDistrict(): boolean {
    return this.level === AddressLevel.District;
  }

  /**
   * Kiểm tra nếu địa chỉ là cấp Phường/Xã
   */
  isWard(): boolean {
    return this.level === AddressLevel.Ward;
  }

  /**
   * Kiểm tra nếu địa chỉ là cấp Ấp/Thôn
   */
  isHamlet(): boolean {
    return this.level === AddressLevel.Hamlet;
  }

  /**
   * Chuyển đối tượng thành dạng JSON
   */
  toJSON(): AddressData {
    return {
      key_id: this.key_id,
      id: this.id,
      parent_id: this.parent_id,
      key_parent_id: this.key_parent_id,
      name: this.name,
      level: this.level,
    };
  }

  /**
   * Tạo một đối tượng Address từ dữ liệu JSON
   */
  static fromJSON(json: AddressData): Address {
    return new Address(json);
  }
}

export default Address;
