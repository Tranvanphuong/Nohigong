export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  province?: any;
  district?: any;
  ward?: any;
  hamlet?: any;
}
