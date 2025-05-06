import { externalApi } from "@/api/externalApi";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  showToast,
} from "zmp-sdk/apis";
import { getAsync, getUserNumber, post } from "@/utils/request";
import { getToken } from "@/utils/auth";
import { Order, OrderImpl } from "@/models/Order";

export interface InventoryItemCategory {
  inventory_item_category_id: string;
  item_category_name: string;
  item_category_code: string;
  parent_id: string | null;
  description: string | null;
  misa_code: string;
  grade: number;
  is_leaf: boolean;
  is_parent: boolean;
  inactive: boolean;
  branch_id: string;
  inventory_item_category_name_hash: string;
  tax_rate: number | null;
  created_date: string;
  parent_name: string;
  parent_code: string | null;
}

export interface InventoryItemCategoryResponse {
  Total: number;
  Data: InventoryItemCategory[];
  Empty: boolean;
}

export const services = {
  // Dịch vụ quản lý sản phẩm
  product: {
    getImageUrl: (fileName: string | null) => {
      if (!fileName) return "";
      return externalApi.getProductImage(fileName);
    },
  },

  // Dịch vụ quản lý khách hàng
  customer: {
    savePhoneNumber: async (
      phone: string,
      userName: string,
      zaloid: string
    ) => {
      try {
        const savePhoneBody = {
          customer_name: userName,
          phone_number: phone,
          address: "",
          channel_id: 10,
          channel_user_id: "userName",
          channel_user_name: "userName",
          seller_id: zaloid,
        };
        await externalApi.saveCustomer(savePhoneBody);
        return true;
      } catch (error) {
        console.error("Error saving phone number:", error);
        throw error;
      }
    },

    getAndSavePhoneNumber: async () => {
      try {
        const accessToken = await getAccessToken({});
        const userInfoResult = await new Promise((resolve, reject) => {
          getUserInfo({
            success: resolve,
            fail: reject,
            autoRequestPermission: true,
            avatarType: "large",
          });
        });

        const phoneData = await new Promise((resolve, reject) => {
          getPhoneNumber({
            success: resolve,
            fail: reject,
          });
        });

        const { token } = phoneData as { token: string };
        const userPhones = await getUserNumber({
          access_token: accessToken,
          code: token,
        });

        if (userPhones?.data?.number) {
          await services.customer.savePhoneNumber(
            userPhones.data.number,
            (userInfoResult as any).userInfo?.name,
            (userInfoResult as any).userInfo?.id
          );
          return userPhones.data.number;
        }
        return null;
      } catch (error) {
        console.error("Error getting and saving phone number:", error);
        throw error;
      }
    },
  },

  // Dịch vụ quản lý kho
  inventory: {
    editItem: async (id: string, data: any) => {
      try {
        await externalApi.editInventoryItem(id, data);
        return true;
      } catch (error) {
        console.error("Error editing inventory item:", error);
        throw error;
      }
    },

    getInventoryItems: async (params?: {
      inventory_item_category_id?: string;
    }) => {
      try {
        const response = await fetch(
          "https://eshopapp.misa.vn/g2/api/dimob/inventoryItems/list-combo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({
              skip: 0,
              take: 20,
              sort: "",
              filter: params?.inventory_item_category_id
                ? `[{"property":"inventory_item_category_id","value":"${params.inventory_item_category_id}"}]`
                : "[]",
              emptyFilter: "",
              columns: "*",
              selectedValue:
                '[{"property":21,"value":"2714c71b-41ae-45f7-a675-729fbb071d8f"}]',
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inventory items");
        }

        return response.json();
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        throw error;
      }
    },
  },

  // Dịch vụ quản lý file
  file: {
    download: (fileResourceId: string) => {
      return externalApi.downloadFile(fileResourceId);
    },
  },

  // Dịch vụ quản lý đơn hàng
  order: {
    create: async (orderData: any) => {
      try {
        // Gọi API tạo đơn hàng
        const response = await externalApi.createOrder(orderData);
        // Hiển thị thông báo thành công
        await showToast({
          message: "Đặt hàng thành công!",
        });

        return response;
      } catch (error) {
        console.error("Error creating order:", error);

        // Hiển thị thông báo lỗi
        await showToast({
          message: "Đặt hàng thất bại, vui lòng thử lại!",
        });

        throw error;
      }
    },

    // Lấy chi tiết đơn hàng dựa trên orderId
    getOrder: async (orderId: string): Promise<OrderImpl> => {
      try {
        const response = await externalApi.getOrderDetail(orderId);

        if (!response || !response.Data) {
          throw new Error("Không tìm thấy thông tin đơn hàng.");
        }

        // Chuyển đổi dữ liệu từ API thành đối tượng Order
        const orderData = response.Data;
        return new OrderImpl(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },

    // Lấy danh sách đơn hàng với phân trang
    getOrderList: async (
      page: number = 1,
      pageSize: number = 10
    ): Promise<{ orders: OrderImpl[]; totalCount: number }> => {
      try {
        const response = await externalApi.getOrderList({ page, pageSize });

        if (!response || !response.Data) {
          return { orders: [], totalCount: 0 };
        }

        // Chuyển đổi danh sách đơn hàng thành mảng các đối tượng Order
        const orders = response.Data.map(
          (orderData: any) => new OrderImpl(orderData)
        );

        return {
          orders,
          totalCount: response.Total || 0,
        };
      } catch (error) {
        console.error("Error fetching order list:", error);
        throw error;
      }
    },
    getOrderWithDetail: async () => {
      const response = await externalApi.getOrderWithDetail();
      return response;
    },

    // Phương thức mới để lấy đơn hàng với API mới
    getOrdersWithDetailNew: async (params?: {
      page?: number;
      pageSize?: number;
      dateFrom?: Date;
      dateTo?: Date;
      statuses?: number[];
    }): Promise<{ orders: OrderImpl[]; totalCount: number }> => {
      try {
        const skip = params?.page
          ? (params.page - 1) * (params?.pageSize || 10)
          : 0;
        const take = params?.pageSize || 10;

        const response = await externalApi.getOrdersWithDetailNew({
          skip,
          take,
          dateFrom: params?.dateFrom,
          dateTo: params?.dateTo,
          statuses: params?.statuses,
        });

        return response;
      } catch (error) {
        console.error("Error fetching orders with details:", error);
        return { orders: [], totalCount: 0 };
      }
    },
  },

  category: {
    async getCategories(): Promise<InventoryItemCategoryResponse> {
      const response = await post<InventoryItemCategoryResponse>(
        `inventoryItemCategoryzmas/list-combo`,
        {
          skip: 0,
          take: 20,
          sort: "",
          filter: "[]",
          emptyFilter: "",
          columns: "*",
          selectedValue: "",
        }
      );
      console.log("response", response);

      return response;
    },
  },
};
