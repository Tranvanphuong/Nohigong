import { Order, OrderDetailImpl, OrderImpl } from "@/models/Order";
import { post, request } from "../utils/request";
import { getConfig } from "@/utils/template";

const BASE_URL = getConfig((config) => config.template.apiUrl);

const API_URL = "https://eshopapp.misa.vn/g2/api";
const Database_ID = "cadc7044-15b1-11f0-9afa-005056b275fa";
export const externalApi = {
  // API cho quản lý sản phẩm
  getProductImage: (fileName: string) => {
    return `${API_URL}/file/files?type=3&dbId=${Database_ID}&file=${fileName}`;
  },

  // API cho quản lý khách hàng
  saveCustomer: (data: any) => {
    return post(`CustomerChannels/save-customer`, data);
  },

  // API cho quản lý kho
  editInventoryItem: (id: string, data: any) => {
    return request(`${BASE_URL}/InventoryItemZMAs/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  createOrder: (data: any) => {
    return post(`MessageOrderZMAs/commit`, data);
  },

  // API cho quản lý đơn hàng
  getOrderDetail: (orderId: string) => {
    return request<any>(`${BASE_URL}MessageOrderZMAs/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getOrderList: (params: { page: number; pageSize: number }) => {
    return request<any>(`${BASE_URL}MessageOrderZMAs/list`, {
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

  // API mới theo curl đã cung cấp
  getOrdersWithDetailNew: async (params?: {
    skip?: number;
    take?: number;
    dateFrom?: Date;
    dateTo?: Date;
    statuses?: number[];
  }) => {
    const dateFrom = params?.dateFrom || new Date();
    const dateTo = params?.dateTo || new Date();
    dateTo.setMonth(dateTo.getMonth() + 1);

    const response = await post<{ Data: any[]; Total: number }>(
      "MessageOrderZMAs/list-with-detail",
      {
        skip: params?.skip || 0,
        take: params?.take || 50,
        sort: '[{"property":"274","desc":true}]',
        filter: JSON.stringify([
          {
            op: 10,
            aop: 1,
            field: "274",
            ors: [],
            isOptionFilter: false,
            value: dateFrom.toISOString(),
          },
          {
            op: 12,
            aop: 1,
            field: "274",
            ors: [],
            isOptionFilter: false,
            value: dateTo.toISOString(),
          },
          {
            op: 14,
            aop: 1,
            field: 120,
            ors: [],
            isOptionFilter: false,
            value: params?.statuses || [5, 110, 120, 10],
          },
          {
            op: 7,
            aop: 1,
            field: "218",
            ors: [],
            isOptionFilter: false,
            value: "5",
          },
        ]),
        emptyFilter: "",
        columns:
          "105,472,40,615,218,274,720,564,43,53,581,622,120,47,207,37,207,567,139,122,53,57,218,582,281,280,220,594,615,141,699,142,622,124,41,140,43,399,504,144,648,675,674,673,760",
        view: 21,
      }
    );

    // Chuyển đổi dữ liệu thành các đối tượng OrderImpl
    const orders = response.Data.map((orderData) => new OrderImpl(orderData));
    return { orders, totalCount: response.Total };
  },

  // API cho tải file
  downloadFile: (fileResourceId: string) => {
    return `${API_URL}/di/FileResources/download/${fileResourceId}`;
  },
};
