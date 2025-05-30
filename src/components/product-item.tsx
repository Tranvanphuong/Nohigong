import { Product } from "../types";
import { formatPrice } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { selectedProductIdState, isQuickBuyModalOpenState, quickBuyState } from "@/state";
import { services } from "@/services/services";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const navigate = useNavigate();
  const setSelectedProductId = useSetAtom(selectedProductIdState);
  const setIsQuickBuyModalOpen = useSetAtom(isQuickBuyModalOpenState);
  const setQuickBuy = useSetAtom(quickBuyState);

  console.log(setSelectedProductId);
  const getImageUrl = (fileName: string | null) => {
    return services.product.getImageUrl(fileName);
  };

  const handleClick = async () => {
    console.log(
      "ProductItem - handleClick - setting product ID:",
      props.product.inventory_item_id
    );
    setSelectedProductId(props.product.inventory_item_id);
    console.log("ProductItem - handleClick - navigating to product page");
    navigate(`/product/${props.product.inventory_item_id}`);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductId(props.product.inventory_item_id);
    setQuickBuy({
      productId: props.product.inventory_item_id,
      quantity: 1,
      address: "",
      note: "",
      paymentMethod: "transfer",
      totalAmount: props.product.unit_price,
    });
    setIsQuickBuyModalOpen(true);
  };

  return (
    <div className="flex flex-col cursor-pointer group" onClick={handleClick}>
      <div className="w-full aspect-square rounded-t-lg overflow-hidden">
        {props.product.file_name ? (
          <img
            src={getImageUrl(props.product.file_name)}
            className="w-full h-full object-cover"
            alt={props.product.inventory_item_name}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Không có ảnh</span>
          </div>
        )}
      </div>

      <div className="py-2">
        {/* <div className="text-3xs text-subtitle truncate">
          {props.product.category.name}
        </div> */}
        <div className="text-xs h-9 line-clamp-2">
          {props.product.inventory_item_name}
        </div>
        <div className="mt-0.5 text-sm font-medium">
          {formatPrice(props.product.unit_price)}
        </div>
        {/* <div className="text-3xs text-subtitle line-through">
          {formatPrice(props.product.unit_price)}
        </div> */}
        {/* <button
          onClick={handleQuickBuy}
          className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
        >
          Mua ngay
        </button> */}
      </div>
    </div>
  );
}
