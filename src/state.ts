import { atom } from "jotai";
import {
  atomFamily,
  unwrap,
  atomWithDefault,
  atomWithStorage,
} from "jotai/utils";
import type {
  Cart,
  Category,
  Color,
  Product,
  InventoryItemCategory,
} from "@/types";
import { GetUserInfoReturns } from "@/types/user";
import {
  post,
  requestWithFallback,
  requestWithFallbackURL,
  getProductDetail,
} from "@/utils/request";
import { getUserInfo } from "zmp-sdk";
import { ShippingAddress } from "./types";

export const userState = atomWithDefault(async () => {
  const user = await getUserInfo({
    avatarType: "normal",
  });
  return user;
});

export const updateUserPhone = atom(null, (get, set, phone: string) => {
  const currentUser = get(userState);
  if (currentUser) {
    const updatedUser = {
      ...currentUser,
      phone: phone,
    };
    set(userState, updatedUser);
  }
});

export const bannersState = atom(() =>
  requestWithFallback<string[]>("/banners", [])
);

export const tabsState = atom(["Tất cả", "Nam", "Nữ", "Trẻ em"]);

export const selectedTabIndexState = atom(0);

export const categoriesState = atom(() =>
  requestWithFallback<Category[]>("/categories", [])
);

export const categoriesStateUpwrapped = unwrap(
  categoriesState,
  (prev) => prev ?? []
);

export const productsState1 = atom(async (get) => {
  const categories = await get(categoriesState);
  const products = await requestWithFallback<
    (Product & { categoryId: number })[]
  >("products", []);
  return products.map((product) => ({
    ...product,
    category:
      categories?.find((category) => category.id === product.categoryId) ||
      null,
  }));
});

export const productFilterState = atom<string>("");

export const productsState = atom(async (get) => {
  try {
    const response = await post<{ Data: Product[] }>(
      "dimob/InventoryItems/list",
      {
        skip: 0,
        take: 50,
        sort: '[{"property":"106","desc":false}]',
        filter:
          '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
        emptyFilter: "",
        columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
        view: 1,
      }
    );

    return response.Data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
});

// export const filteredProductsState = atom(async (get) => {
//   const products = await get(productsState);
//   const filter = get(productFilterState);

//   if (!filter) return products;

//   return products.filter(product => {
//     if (!product.inventory_item_category_name) return false;

//     switch(filter) {
//       case 'dry':
//         return product.inventory_item_category_name.includes('Đồ ăn khô');
//       case 'clothes':
//         return product.inventory_item_category_name.includes('Quần áo');
//       case 'shoes':
//         return product.inventory_item_category_name.includes('Giày dép');
//       default:
//         return true;
//     }
//   });
// });

export const flashSaleProductsState = atom((get) => get(productsState));

export const recommendedProductsState = atom((get) => get(productsState));

export const sizesState = atom(["S", "M", "L", "XL"]);

export const selectedSizeState = atom<string | undefined>(undefined);

export const colorsState = atom<Color[]>([
  {
    name: "Đỏ",
    hex: "#FFC7C7",
  },
  {
    name: "Xanh dương",
    hex: "#DBEBFF",
  },
  {
    name: "Xanh lá",
    hex: "#D1F0DB",
  },
  {
    name: "Xám",
    hex: "#D9E2ED",
  },
]);

export const selectedColorState = atom<Color | undefined>(undefined);

export const productState = atomFamily((id: string) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.find((product) => product.inventory_item_id === id);
  })
);

export const cartState = atom<Cart[]>([]);

export const selectedCartItemIdsState = atom<number[]>([]);

export const checkoutItemsState = atom((get) => {
  const ids = get(selectedCartItemIdsState);
  const cart = get(cartState);
  return cart.filter((item) => ids.includes(item.id));
});

export const cartTotalState = atom((get) => {
  const items = get(checkoutItemsState);
  return {
    totalItems: items.length,
    totalAmount: items.reduce(
      (total, item) => total + item.product.unit_price * item.quantity,
      0
    ),
  };
});

export const keywordState = atom("");

export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  const products = await get(productsState);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products.filter((product) =>
    product.inventory_item_name.toLowerCase().includes(keyword.toLowerCase())
  );
});

export const selectedProductIdState = atom<string | null>(null);

export const productDetailState = atom<Promise<Product | null>>(async (get) => {
  const productId = get(selectedProductIdState);
  console.log("productDetailState - productId:", productId);

  if (!productId) {
    console.log("productDetailState - no productId, returning null");
    return null;
  }

  try {
    console.log("productDetailState - calling getProductDetail");
    const response = await getProductDetail(productId);
    console.log("productDetailState - response:", response);
    return response as Product;
  } catch (error) {
    console.error("productDetailState - error:", error);
    return null;
  }
});

export const shippingAddressesState = atomWithStorage<ShippingAddress[]>(
  "shipping-addresses",
  []
);
export const selectedAddressState = atom<ShippingAddress | null>(null);

// Quick Buy States
export interface QuickBuyState {
  productId: string | null;
  quantity: number;
  address: string;
  note: string;
  paymentMethod: string;
  totalAmount: number;
}

export const quickBuyState = atom<QuickBuyState>({
  productId: null,
  quantity: 1,
  address: "",
  note: "",
  paymentMethod: "transfer", // transfer: chuyển khoản, cash: tiền mặt
  totalAmount: 0,
});

export const isQuickBuyModalOpenState = atom(false);

export const paymentMethodsState = atom([
  { id: "transfer", name: "Chuyển khoản", icon: "💳" },
  { id: "cash", name: "Tiền mặt", icon: "💵" },
]);

export const inventoryCategoriesState = atom<InventoryItemCategory[]>([]);
export const selectedInventoryCategoryState = atom<
  InventoryItemCategory | undefined
>(undefined);

// // State cho danh sách sản phẩm ở trang chủ
// export const homeProductsState = atom(async () => {
//   try {
//     const response = await post<{ Data: Product[] }>(
//       "dimob/InventoryItems/list",
//       {
//         skip: 0,
//         take: 50,
//         sort: '[{"property":"106","desc":false}]',
//         filter: '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
//         emptyFilter: "",
//         columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
//         view: 1,
//       }
//     );

//     return response.Data;
//   } catch (error) {
//     console.error("Error fetching home products:", error);
//     return [];
//   }
// });

// // State cho danh sách sản phẩm ở trang danh mục
// export const catalogProductsState = atom(async () => {
//   try {
//     const response = await post<{ Data: Product[] }>(
//       "dimob/InventoryItems/list",
//       {
//         skip: 0,
//         take: 50,
//         sort: '[{"property":"106","desc":false}]',
//         filter: '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
//         emptyFilter: "",
//         columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
//         view: 1,
//       }
//     );

//     return response.Data;
//   } catch (error) {
//     console.error("Error fetching catalog products:", error);
//     return [];
//   }
// });

// // State cho danh sách sản phẩm đã lọc ở trang danh mục
// export const filteredCatalogProductsState = atom(async (get) => {
//   const products = await get(catalogProductsState);
//   const selectedCategory = get(selectedInventoryCategoryState);

//   if (!selectedCategory) return products;

//   return products.filter(product =>
//     product.inventory_item_category_id === selectedCategory.inventory_item_category_id
//   );
// });
