import { Order, OrderDetailImpl, OrderImpl } from "@/models/Order";
import { post, request } from "../utils/request";

const BASE_URL = "https://eshopapp.misa.vn/g2/api";
const Database_ID = "cadc7044-15b1-11f0-9afa-005056b275fa";
export const externalApi = {
  // API cho quản lý sản phẩm
  getProductImage: (fileName: string) => {
    return `${BASE_URL}/file/files?type=3&dbId=${Database_ID}&file=${fileName}`;
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

  // API cho quản lý đơn hàng
  getOrderDetail: (orderId: string) => {
    return request<any>(`${BASE_URL}/bizmob/MessageOrderMobs/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getOrderList: (params: { page: number; pageSize: number }) => {
    return request<any>(`${BASE_URL}/bizmob/MessageOrderMobs/list`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getOrderWithDetail: async () => {
    const response = await post<{ Data: OrderImpl[] }>(
      "order/MessageOrders/list-with-detail`",
      {
        skip: 0,
        take: 50,
        sort: '[{"property":"274","desc":true}]',
        filter:
          '[{"op":14,"aop":1,"field":"120","ors":[],"isOptionFilter":false,"value":[120,10]},{"op":14,"aop":1,"field":"124","ors":[],"isOptionFilter":false,"value":["768536537082805933"]},{"op":7,"aop":1,"field":"218","ors":[],"isOptionFilter":false,"value":"10"}]',
        emptyFilter: "",
        columns:
          "105,472,40,615,218,274,564,720,43,141,581,622,120,47,207,37,207,567,139,122,53,57,218,582,281,280,220,594,615,141,699,142,622,124,41,140,43,399,504,144,648,675,674,673,760",
        view: 21,
      }
    );

    return response.Data;
  },

  // API cho tải file
  downloadFile: (fileResourceId: string) => {
    return `${BASE_URL}/di/FileResources/download/${fileResourceId}`;
  },
};
