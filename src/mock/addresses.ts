import { AddressData, AddressLevel } from "@/types/address";

// Mock data cho địa chỉ hành chính Việt Nam
const mockAddresses: AddressData[] = [
  // Tỉnh/Thành phố
  {
    key_id: "598ecb71-e842-11ef-8d17-005056b332bc",
    id: "01",
    parent_id: "",
    key_parent_id: "",
    name: "Hà Nội",
    level: AddressLevel.Province,
  },
  {
    key_id: "598ecb72-e842-11ef-8d17-005056b332bc",
    id: "79",
    parent_id: "",
    key_parent_id: "",
    name: "Hồ Chí Minh",
    level: AddressLevel.Province,
  },
  {
    key_id: "598ecb73-e842-11ef-8d17-005056b332bc",
    id: "31",
    parent_id: "",
    key_parent_id: "",
    name: "Hải Phòng",
    level: AddressLevel.Province,
  },
  {
    key_id: "598ecb74-e842-11ef-8d17-005056b332bc",
    id: "48",
    parent_id: "",
    key_parent_id: "",
    name: "Đà Nẵng",
    level: AddressLevel.Province,
  },

  // Quận/Huyện của Hà Nội
  {
    key_id: "598ecb75-e842-11ef-8d17-005056b332bc",
    id: "001",
    parent_id: "01",
    key_parent_id: "598ecb71-e842-11ef-8d17-005056b332bc",
    name: "Ba Đình",
    level: AddressLevel.District,
  },
  {
    key_id: "598ecb76-e842-11ef-8d17-005056b332bc",
    id: "002",
    parent_id: "01",
    key_parent_id: "598ecb71-e842-11ef-8d17-005056b332bc",
    name: "Hoàn Kiếm",
    level: AddressLevel.District,
  },
  {
    key_id: "598ecb77-e842-11ef-8d17-005056b332bc",
    id: "003",
    parent_id: "01",
    key_parent_id: "598ecb71-e842-11ef-8d17-005056b332bc",
    name: "Tây Hồ",
    level: AddressLevel.District,
  },

  // Quận/Huyện của Hồ Chí Minh
  {
    key_id: "598ecb78-e842-11ef-8d17-005056b332bc",
    id: "760",
    parent_id: "79",
    key_parent_id: "598ecb72-e842-11ef-8d17-005056b332bc",
    name: "Quận 1",
    level: AddressLevel.District,
  },
  {
    key_id: "598ecb79-e842-11ef-8d17-005056b332bc",
    id: "761",
    parent_id: "79",
    key_parent_id: "598ecb72-e842-11ef-8d17-005056b332bc",
    name: "Quận 12",
    level: AddressLevel.District,
  },
  {
    key_id: "598ecb80-e842-11ef-8d17-005056b332bc",
    id: "762",
    parent_id: "79",
    key_parent_id: "598ecb72-e842-11ef-8d17-005056b332bc",
    name: "Thủ Đức",
    level: AddressLevel.District,
  },

  // Phường/Xã của Ba Đình
  {
    key_id: "598ecb81-e842-11ef-8d17-005056b332bc",
    id: "00001",
    parent_id: "001",
    key_parent_id: "598ecb75-e842-11ef-8d17-005056b332bc",
    name: "Phúc Xá",
    level: AddressLevel.Ward,
  },
  {
    key_id: "598ecb82-e842-11ef-8d17-005056b332bc",
    id: "00004",
    parent_id: "001",
    key_parent_id: "598ecb75-e842-11ef-8d17-005056b332bc",
    name: "Trúc Bạch",
    level: AddressLevel.Ward,
  },

  // Phường/Xã của Quận 1
  {
    key_id: "598ecb83-e842-11ef-8d17-005056b332bc",
    id: "76001",
    parent_id: "760",
    key_parent_id: "598ecb78-e842-11ef-8d17-005056b332bc",
    name: "Bến Nghé",
    level: AddressLevel.Ward,
  },
  {
    key_id: "598ecb84-e842-11ef-8d17-005056b332bc",
    id: "76002",
    parent_id: "760",
    key_parent_id: "598ecb78-e842-11ef-8d17-005056b332bc",
    name: "Bến Thành",
    level: AddressLevel.Ward,
  },

  // Ấp/Thôn của Phúc Xá
  {
    key_id: "598ecb85-e842-11ef-8d17-005056b332bc",
    id: "0000101",
    parent_id: "00001",
    key_parent_id: "598ecb81-e842-11ef-8d17-005056b332bc",
    name: "Tổ dân phố 1",
    level: AddressLevel.Hamlet,
  },
  {
    key_id: "598ecb86-e842-11ef-8d17-005056b332bc",
    id: "0000102",
    parent_id: "00001",
    key_parent_id: "598ecb81-e842-11ef-8d17-005056b332bc",
    name: "Tổ dân phố 2",
    level: AddressLevel.Hamlet,
  },
];

export default mockAddresses;
