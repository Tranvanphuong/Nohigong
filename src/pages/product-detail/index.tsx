import { useAtom } from "jotai";
import { productDetailState, selectedProductIdState } from "@/state";
import { Page } from "zmp-ui";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "@/types";

const ProductDetail = () => {
  const { id } = useParams();

  const [productDetail, setProductDetail] = useAtom(productDetailState);
  const [selectedProductId, setSelectedProductId] = useAtom(
    selectedProductIdState
  );

  // State để lưu các thuộc tính đã chọn
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string>>({});
  // State để lưu sản phẩm tương ứng sau khi chọn thuộc tính
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      setSelectedProductId(id);
    }
  }, [id]);

  // Hàm xử lý khi chọn thuộc tính
  // const handlePropertySelect = (propertyName: string, value: string) => {
  //   const newSelectedProperties = {
  //     ...selectedProperties,
  //     [propertyName]: value
  //   };
  //   setSelectedProperties(newSelectedProperties);

  //   // Tìm sản phẩm tương ứng trong classifies
  //   if (productDetail?.classifies) {
  //     const matchedClassify = productDetail.classifies.find(classify => {
  //       return Object.entries(newSelectedProperties).every(([name, val]) => {
  //         return classify.property_name === name && classify.property_value === val;
  //       });
  //     });

  //     if (matchedClassify) {
  //       // Nếu tìm thấy sản phẩm tương ứng, cập nhật state
  //       setMatchedProduct({
  //         ...productDetail,
  //         inventory_item_id: matchedClassify.inventory_item_id
  //       });
  //     } else {
  //       setMatchedProduct(null);
  //     }
  //   }
  // };

  if (!productDetail) {
    return (
      <Page>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="p-4">
        <img
          src={`https://eshopapp.misa.vn/g2/api/di/FileResources/download/${productDetail.file_name}`}
          alt={productDetail.inventory_item_name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">
          {productDetail.inventory_item_name}
        </h1>
        <div className="text-xl font-semibold text-primary mb-4">
          {productDetail.unit_price.toLocaleString("vi-VN")}đ
        </div>

        {/* Mô tả sản phẩm */}
        {productDetail.description && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {productDetail.description}
            </p>
          </div>
        )}

        {/* Thuộc tính sản phẩm */}
        {/* {productDetail.properties && productDetail.properties.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
            <div className="space-y-4">
              {productDetail.properties.map((property) => (
                <div key={property.inventory_item_property_id}>
                  <p className="text-gray-600 mb-2">{property.property_name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.properties
                      ?.filter(p => p.property_name === property.property_name)
                      .map((p) => (
                        <button
                          key={p.inventory_item_property_id}
                          className={`px-4 py-2 rounded border ${
                            selectedProperties[property.property_name] === p.inventory_item_property_value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-gray-300'
                          }`}
                          onClick={() => handlePropertySelect(property.property_name, p.inventory_item_property_value)}
                        >
                          {p.inventory_item_property_value}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Thông tin sản phẩm */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Mã sản phẩm:</p>
              <p className="font-medium">{productDetail.sku_code}</p>
            </div>
            <div>
              <p className="text-gray-600">Danh mục:</p>
              <p className="font-medium">
                {productDetail.inventory_item_category_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Thương hiệu:</p>
              <p className="font-medium">{productDetail.brand_name}</p>
            </div>
          </div>
        </div>

        {/* Hiển thị thông báo khi tìm thấy sản phẩm tương ứng */}
        {matchedProduct && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700">Đã tìm thấy sản phẩm tương ứng!</p>
            <p className="text-sm text-gray-600 mt-2">
              Mã sản phẩm: {matchedProduct.inventory_item_id}
            </p>
          </div>
        )}
      </div>
    </Page>
  );
};

export default ProductDetail;

