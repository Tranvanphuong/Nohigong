import React from "react";

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full pb-[60px] relative">
      <div className="flex-1 overflow-y-auto">
        {/* Skeleton cho carousel */}
        <div className="w-full aspect-square bg-gray-200 animate-pulse" />

        <div className="p-4 space-y-4">
          {/* Skeleton cho category */}
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

          {/* Skeleton cho tên sản phẩm */}
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />

          {/* Skeleton cho giá */}
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />

          {/* Skeleton cho mô tả */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Skeleton cho thông tin sản phẩm */}
          <div className="space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton cho bottom buttons */}
      <div className="fixed bottom-95 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex items-center justify-center p-2 gap-4">
          <div className="w-[190px] h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-[190px] h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
