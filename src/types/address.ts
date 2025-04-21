import Address from "@/models/Address";

export interface AddressData {
  key_id: string;
  id: string;
  parent_id: string;
  key_parent_id: string;
  name: string;
  level: number;
}

export enum AddressLevel {
  Province = 1, // Tỉnh/Thành phố
  District = 2, // Quận/Huyện
  Ward = 3, // Phường/Xã
  Hamlet = 4, // Ấp/Thôn
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  province?: Address;
  district?: Address;
  ward?: Address;
  hamlet?: Address;
}
