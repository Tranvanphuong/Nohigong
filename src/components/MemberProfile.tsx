import React from 'react';

interface MemberProfileProps {
  name: string;
  phone: string;
  address: string;
}

function MemberProfile({ name, phone, address }: MemberProfileProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <span className="text-gray-500 text-sm">Tên</span>
        <div className="text-lg font-medium">{name}</div>
      </div>
      
      <div className="mb-4">
        <span className="text-gray-500 text-sm">Số điện thoại</span>
        <div className="text-lg font-medium">{phone}</div>
      </div>
      
      <div className="mb-4">
        <span className="text-gray-500 text-sm">Địa chỉ</span>
        <div className="text-lg font-medium">{address}</div>
      </div>
    </div>
  );
}

export default MemberProfile; 