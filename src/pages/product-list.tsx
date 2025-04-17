import { useAtom } from "jotai";
import { productsState } from "@/state";
import { Product } from "@/types";
import { Page } from "zmp-ui";

const ProductList = () => {
  const [products] = useAtom(productsState);

  return (
    <Page>
      <div className="grid grid-cols-2 gap-4 p-4">
        {products.map((product: Product) => (
          <div key={product.inventory_item_id} className="bg-white rounded-lg shadow p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {product.inventory_item_name}
            </h3>
            <p className="text-primary font-semibold">
              {product.unit_price.toLocaleString('vi-VN')}đ
            </p>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default ProductList; 