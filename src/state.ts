import { atom } from "jotai";
import { atomFamily, unwrap, atomWithDefault } from "jotai/utils";
import { Cart, Category, Color, Product } from "@/types";
import {
  post,
  requestWithFallback,
  requestWithFallbackURL,
  getProductDetail
} from "@/utils/request";
import { getUserInfo } from "zmp-sdk";

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
    category: categories.find(
      (category) => category.id === product.categoryId
    )!,
  }));
});

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
      },
      {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmEiOiJWxINuIFBoxrDGoW5nIiwidWlkIjoiNDdmZjUxYWItNDdlYS00OTg5LWJlOWYtYzU4NjAxNjIzNDhjIiwiZGJpZCI6IjY3OGI0MThjLWU0NjEtMTFlZi05ZTU4LTAwNTA1NmIyNzVmYSIsInNpZCI6Ijc3MGZhZDA5Zjk0YzRlMDJiY2VkNTZlZTg3NTM2NmYyIiwibWlkIjoiOTQ3N2Y5NmQtNWVhMC00NWRkLTliZjQtY2IyODc0MDY4YjVhIiwidGlkIjoiNjc4YWNiMGEtZTQ2MS0xMWVmLTllNTgtMDA1MDU2YjI3NWZhIiwidGNvIjoicWNfc3RvcmU0IiwiZW52IjoiZzIiLCJuYmYiOjE3NDQ3OTIzMTUsImV4cCI6MTc0NDg3ODcxNSwiaWF0IjoxNzQ0NzkyMzE1LCJpc3MiOiJNSVNBSlNDIn0.1WnJ0XM_BvEuQRvCM3eDIrqw6nRZsdtiIBD4larIvH8",
      }
    );

    return response.Data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
});

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

export const cartState = atom<Cart>([]);

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
