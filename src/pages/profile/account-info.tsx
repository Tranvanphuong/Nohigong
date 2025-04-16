import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { BackIcon } from "../../components/vectors";

export default function AccountInfoPage() {
  const navigate = useNavigate();
  
  // Mock data - sẽ được thay thế bằng dữ liệu thực từ state management
  const userData = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
    email: "nguyenvana@example.com",
    memberSince: "01/01/2023",
    points: 1000
  };

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
              <p className="font-medium">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">{userData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Địa chỉ</p>
              <p className="font-medium">{userData.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-3">Thông tin thành viên</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Ngày tham gia</p>
              <p className="font-medium">{userData.memberSince}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm tích lũy</p>
              <p className="font-medium">{userData.points} điểm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 