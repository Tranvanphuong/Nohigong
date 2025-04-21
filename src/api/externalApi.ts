import { post, request } from "../utils/request";

const BASE_URL = "https://eshopapp.misa.vn/g2/api";

export const externalApi = {
  // API cho quản lý sản phẩm
  getProductImage: (fileName: string) => {
    return `${BASE_URL}/file/files?type=3&dbId=68807c40-7cba-11ef-be09-005056b332bc&file=${fileName}`;
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
