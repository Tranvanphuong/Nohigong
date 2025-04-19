import { useAtom } from "jotai";
import { productDetailState, selectedProductIdState } from "@/state";
import { Page } from "zmp-ui";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProductDetail = () => {
  console.log("ProductDetail - render");
  const { id } = useParams();
  console.log("ProductDetail - id from params:", id);

  const [productDetail, setProductDetail] = useAtom(productDetailState);
  const [selectedProductId, setSelectedProductId] = useAtom(
    selectedProductIdState
  );

  useEffect(() => {
    console.log("ProductDetail - useEffect - id:", id);
    if (id) {
      console.log("ProductDetail - useEffect - setting product ID:", id);
      setSelectedProductId(id);
    }
  }, [id]);

  if (!productDetail) {
    console.log("ProductDetail - rendering loading state");
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

  console.log("ProductDetail - rendering product detail:", productDetail);
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {productDetail.description}
          </p>
        </div>
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
            <div>
              <p className="text-gray-600">Tình trạng:</p>
              <p className="font-medium">
                {productDetail.instock > 0 ? "Còn hàng" : "Hết hàng"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProductDetail;
