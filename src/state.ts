import { atom } from "jotai";
import { atomFamily, unwrap, atomWithDefault } from "jotai/utils";
import { Cart, Category, Color, Product } from "@/types";
import {
  post,
  requestWithFallback,
  requestWithFallbackURL,
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
    const categories = await get(categoriesState);

    // Hiển thị thông báo trong console cho việc debug
    console.log("Đang thử lấy dữ liệu từ API...");

    // Hãy thử gọi API
    try {
      const products = await post<(Product & { categoryId: number })[]>(
        "dimob/InventoryItems/list",
        {
          skip: 0,
          take: 50,
          sort: '[{"property":"106","desc":false}]',
          filter:
            '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
          emptyFilter: "",
          columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128",
          view: 1,
        },
        {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmEiOiJORCBIaeG6v3UiLCJ1aWQiOiJjZWU4OWIxYS0zM2Q1LTQ5N2ItODE4Zi1mOWUwYjhlNTZiMGIiLCJkYmlkIjoiNjg4MDdjNDAtN2NiYS0xMWVmLWJlMDktMDA1MDU2YjMzMmJjIiwic2lkIjoiNGE3ODVkNDY4MmZmNDI0OWEwOTE5Y2ZiYTBjNDExNjciLCJtaWQiOiI4ODcwNDM3YS1iMGJkLTQ0M2MtODJkZC01MTUyZWVmMWIwOGMiLCJ0aWQiOiJmYWNkOTNiNS03Y2IzLTExZWYtYmUwOS0wMDUwNTZiMzMyYmMiLCJ0Y28iOiJkZXZfbnRhbiIsImVudiI6ImcyIiwibmJmIjoxNzQ0NzcyMTMyLCJleHAiOjE3NDQ4NTg1MzIsImlhdCI6MTc0NDc3MjEzMiwiaXNzIjoiTUlTQUpTQyJ9.XKTkgrMACWQc9FK53xTrLJ_9NYpqm6GjjWwj1_vFPrI",
        }
      );

      console.log("Kết quả API:", products); // Kiểm tra dữ liệu
      let result = products.map((product) => ({
        ...product,
      }));
      console.log("result" + result);
      return result;
    } catch (apiError) {
      console.error("Lỗi khi gọi API:", apiError);
      throw apiError; // Ném lỗi để xử lý ở catch bên ngoài
    }
  } catch (error) {
    console.warn("Chuyển sang sử dụng dữ liệu dự phòng vì lỗi:", error);

    // Lấy dữ liệu từ productsState1 làm dự phòng
    try {
      console.log("Đang lấy dữ liệu từ mock data...");
      const products = await requestWithFallback<
        (Product & { categoryId: number })[]
      >("products", []);
      const categories = await get(categoriesState);

      return products.map((product) => ({
        ...product,
        category: categories.find(
          (category) => category.id === product.categoryId
        )!,
      }));
    } catch (fallbackError) {
      console.error("Không thể lấy dữ liệu dự phòng:", fallbackError);
      return []; // Trả về mảng rỗng nếu cả hai phương pháp đều thất bại
    }
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
