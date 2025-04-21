import { atom } from "jotai";
import { post } from "@/utils/request";
import { Product } from "@/types";

// State cho danh sách sản phẩm ở trang chủ
export const homeProductsState = atom(async () => {
  try {
    const response = await post<{ Data: Product[] }>(
      "dimob/InventoryItems/list",
      {
        skip: 0,
        take: 50,
        sort: '[{"property":"106","desc":false}]',
        filter: '[{"op":7,"aop":1,"field":"10","ors":[],"isOptionFilter":false,"value":0},{"op":7,"aop":1,"field":"114","ors":[],"isOptionFilter":false,"value":true}]',
        emptyFilter: "",
        columns: "106,32,105,107,18,108,10,161,742,109,113,111,127,128,153",
        view: 1,
      }
    );

    return response.Data;
  } catch (error) {
    console.error("Error fetching home products:", error);
    return [];
  }
}); 