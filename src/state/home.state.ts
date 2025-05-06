import { atom } from "jotai";
import { post } from "@/utils/request";
import { Product } from "@/types";

// Kích thước trang mặc định
const PAGE_SIZE = 20;

// State cho số trang hiện tại
export const homeCurrentPageState = atom(0);

// State cho trạng thái đang tải
export const homeLoadingState = atom(false);

// State cho việc đã tải hết dữ liệu hay chưa
export const homeHasMoreState = atom(true);

// State cho danh sách sản phẩm ở trang chủ
export const homeProductsState = atom<Product[]>([]);

// Hàm để lấy sản phẩm dựa trên số trang
export const fetchHomeProducts = async (page: number): Promise<Product[]> => {
  try {
    const skip = page * PAGE_SIZE;
    const response = await post<{ Data: Product[] }>("InventoryItemZMAs/list", {
      skip,
      take: PAGE_SIZE,
      sort: '[{"property":"106","desc":false}]',
      filter:
        '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
      emptyFilter: "",
      columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
      view: 1,
    });

    return response.Data;
  } catch (error) {
    console.error("Error fetching home products:", error);
    return [];
  }
};

// Action để tải thêm sản phẩm
export const loadMoreHomeProductsAction = atom(null, async (get, set) => {
  // Nếu đang tải hoặc đã hết sản phẩm thì không tải thêm
  if (get(homeLoadingState) || !get(homeHasMoreState)) {
    return;
  }

  // Đánh dấu đang tải
  set(homeLoadingState, true);

  // Lấy trang hiện tại và tăng lên 1
  const currentPage = get(homeCurrentPageState);
  const nextPage = currentPage + 1;

  // Lấy danh sách sản phẩm hiện tại
  const currentProducts = get(homeProductsState);

  // Gọi API để lấy thêm sản phẩm
  const newProducts = await fetchHomeProducts(nextPage);

  // Nếu không có sản phẩm mới hoặc ít hơn kích thước trang, đánh dấu đã hết
  if (!newProducts.length || newProducts.length < PAGE_SIZE) {
    set(homeHasMoreState, false);
  }

  // Cập nhật trang hiện tại và danh sách sản phẩm
  set(homeCurrentPageState, nextPage);
  set(homeProductsState, [...currentProducts, ...newProducts]);

  // Đánh dấu đã tải xong
  set(homeLoadingState, false);
});

// Hàm khởi tạo để tải sản phẩm ban đầu
export const initHomeProductsAction = atom(null, async (get, set) => {
  // Đánh dấu đang tải
  set(homeLoadingState, true);

  // Reset về trang đầu tiên
  set(homeCurrentPageState, 0);

  // Đánh dấu còn thêm sản phẩm
  set(homeHasMoreState, true);

  // Gọi API để lấy sản phẩm trang đầu tiên
  const products = await fetchHomeProducts(0);

  // Nếu không có sản phẩm hoặc ít hơn kích thước trang, đánh dấu đã hết
  if (!products.length || products.length < PAGE_SIZE) {
    set(homeHasMoreState, false);
  }

  // Cập nhật danh sách sản phẩm
  set(homeProductsState, products);

  // Đánh dấu đã tải xong
  set(homeLoadingState, false);
});
