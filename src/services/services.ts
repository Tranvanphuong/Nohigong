import { externalApi } from "@/api/externalApi";
import { getAccessToken, getPhoneNumber, getUserInfo } from "zmp-sdk/apis";
import { getUserNumber } from "@/utils/request";

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
  },

  // Dịch vụ quản lý file
  file: {
    download: (fileResourceId: string) => {
      return externalApi.downloadFile(fileResourceId);
    },
  },
};
