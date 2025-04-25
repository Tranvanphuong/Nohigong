import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { BackIcon } from "../../components/vectors";
import { useAtomValue } from "jotai";
import { userState } from "@/state";
import { getUserInfo, getPhoneNumber } from "zmp-sdk";
import { useEffect, useState } from "react";
import { getAccessToken } from "zmp-sdk/apis";
import { getUserNumber } from "@/utils/request";

export default function AccountInfoPage() {
  const navigate = useNavigate();
  const userInfo = useAtomValue(userState);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const accessToken = await getAccessToken({});
        console.log("Access Token:", accessToken);
        await new Promise((resolve, reject) => {
          getPhoneNumber({
            success: async (data) => {
              try {
                let { token } = data;
                var userPhones = await getUserNumber({
                  access_token: accessToken,
                  code: token,
                });
                setPhoneNumber(userPhones?.data?.number);

                resolve(null);
              } catch (error) {
                reject(error);
              }
            },
            fail: reject,
          });
        });
      } catch (error) {
        console.error("Error getting phone number:", error);
      }
    };
    fetchPhoneNumber();
  }, []);

  return (
    <div className="min-h-full bg-section p-4">
      {/* <div className="flex items-center gap-2 mb-4">
        <Button 
          className="p-2"
          onClick={() => navigate(-1)}
        >
          <BackIcon />
        </Button>
        <h1 className="text-xl font-semibold">Thông tin tài khoản</h1>
      </div> */}

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-3">Thông tin cá nhân</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium">
                {userInfo?.userInfo?.name || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">{phoneNumber || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
          <h2 className="text-lg font-medium mb-3">Thông tin thành viên</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">ID người dùng</p>
              <p className="font-medium">
                {userInfo?.userInfo?.id || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
