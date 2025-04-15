import { View, Text } from '@zmp-ui/core';

interface MemberProfileProps {
  name: string;
  phone: string;
  address: string;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ name, phone, address }) => {
  return (
    <View className="p-4">
      <View className="mb-4">
        <Text className="text-gray-500 text-sm">Tên</Text>
        <Text className="text-lg font-medium">{name}</Text>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-500 text-sm">Số điện thoại</Text>
        <Text className="text-lg font-medium">{phone}</Text>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-500 text-sm">Địa chỉ</Text>
        <Text className="text-lg font-medium">{address}</Text>
      </View>
    </View>
  );
};

export default MemberProfile; 