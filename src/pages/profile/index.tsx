import ProfileActions from "./actions";
import FollowOA from "./follow-oa";
import Points from "./points";
// import MemberProfile from "../../components/MemberProfile";

export default function ProfilePage() {
  // Mock data - sẽ được thay thế bằng dữ liệu thực từ state management
  // const userData = {
  //   name: "Nguyễn Văn A",
  //   phone: "0123456789",
  //   address: "123 Đường ABC, Quận XYZ, TP.HCM"
  // };

  return (
    <div className="min-h-full bg-section p-4 space-y-2.5">
      {/* <MemberProfile 
        name={userData.name}
        phone={userData.phone}
        address={userData.address}
      /> */}
      <Points />
      <ProfileActions />
      <FollowOA />
    </div>
  );
}
