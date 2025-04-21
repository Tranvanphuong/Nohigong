import { post, request } from "../utils/request";

const BASE_URL = "https://eshopapp.misa.vn/g2/api";

export const externalApi = {
  // API cho quản lý sản phẩm
  getProductImage: (fileName: string) => {
    return `${BASE_URL}/file/files?type=3&dbId=cadc7044-15b1-11f0-9afa-005056b275fa&file=${fileName}`;
  },

  // API cho quản lý khách hàng
  saveCustomer: (data: any) => {
    return post(`socialmob/CustomerChannels/save-customer`, data);
  },

  // API cho quản lý kho
  editInventoryItem: (id: string, data: any) => {
    return request(`${BASE_URL}/dimob/InventoryItems/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  createOrder: (data: any) => {
    return post(`bizmob/MessageOrderMobs/commit`, data);
  },

  // API cho tải file
  downloadFile: (fileResourceId: string) => {
    return `${BASE_URL}/di/FileResources/download/${fileResourceId}`;
  },
};
