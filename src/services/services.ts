import { externalApi } from "@/api/externalApi";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  showToast,
} from "zmp-sdk/apis";
import { getUserNumber } from "@/utils/request";
import { getToken } from "@/utils/auth";

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
        console.log("userInfoResult", userInfoResult);

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

    getInventoryItems: async (params?: { inventory_item_category_id?: string }) => {
      try {
        const response = await fetch('https://eshopapp.misa.vn/g2/api/dimob/inventoryItems/list-combo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
          },
          body: JSON.stringify({
            skip: 0,
            take: 20,
            sort: "",
            filter: params?.inventory_item_category_id ? 
              `[{"property":"inventory_item_category_id","value":"${params.inventory_item_category_id}"}]` : 
              "[]",
            emptyFilter: "",
            columns: "*",
            selectedValue: "[{\"property\":21,\"value\":\"2714c71b-41ae-45f7-a675-729fbb071d8f\"}]"
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        
        return response.json();
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        throw error;
      }
    }
  },

  // Dịch vụ quản lý file
  file: {
    download: (fileResourceId: string) => {
      return externalApi.downloadFile(fileResourceId);
    },
  },

  // Dịch vụ quản lý đơn hàng
  order: {
    create: async (orderData: {
      address: any;
      items: any[];
      notes: {
        seller: string;
        shipping: string;
      };
      voucher?: string;
      totalAmount: number;
    }) => {
      try {
        // Gọi API tạo đơn hàng
        const response = await externalApi.createOrder(orderData);

        // Hiển thị thông báo thành công
        await showToast({
          message: "Đặt hàng thành công!",
          type: "success",
        });

        return response;
      } catch (error) {
        console.error("Error creating order:", error);

        // Hiển thị thông báo lỗi
        await showToast({
          message: "Đặt hàng thất bại, vui lòng thử lại!",
          type: "error",
        });

        throw error;
      }
    },
  },

  category: {
    async getCategories(): Promise<InventoryItemCategoryResponse> {
      const response = await fetch('https://eshopapp.misa.vn/g2/api/dimob/inventoryItemCategorys/list-combo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          skip: 0,
          take: 20,
          sort: "",
          filter: "[]",
          emptyFilter: "",
          columns: "*",
          selectedValue: ""
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return response.json();
    }
  }
};
