import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { MutableRefObject, useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches } from "react-router-dom";
import { cartState, cartTotalState } from "@/state";
import { Cart, CartItem, SelectedOptions } from "@/types/index";
import { getDefaultOptions, isIdentical } from "@/utils/cart";
import { getConfig } from "@/utils/template";
import { openChat, purchase } from "zmp-sdk";
import { Product } from "@/types";

export function useRealHeight(
  element: MutableRefObject<HTMLDivElement | null>,
  defaultValue?: number
) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const [{ contentRect }] = entries;
        setHeight(contentRect.height);
      });
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);

  if (typeof ResizeObserver === "undefined") {
    return -1;
  }
  return height;
}

export function useAddToCart(product: Product, editingCartItemId?: number) {
  const [cart, setCart] = useAtom(cartState);
  const editing = useMemo(
    () => cart.find((item) => item.id === editingCartItemId),
    [cart, editingCartItemId]
  );

  const [options, setOptions] = useState<SelectedOptions>(
    editing?.options || getDefaultOptions(product)
  );

  // Hàm kiểm tra sản phẩm trùng lặp
  const isSameProduct = (item: CartItem, currentProduct: Product) => {
    if (!item || !item.product || !currentProduct) return false;
    return currentProduct.inventory_item_id === item.product.inventory_item_id;
  };

  function handleReplace(quantity: number, cartItems: CartItem[], editing: CartItem) {
    if (quantity === 0) {
      // the user wants to remove this item.
      cartItems.splice(cartItems.indexOf(editing), 1);
    } else {
      const existed = cartItems.find(
        (item) => item.id !== editingCartItemId && isSameProduct(item, product)
      );
      if (existed) {
        // there's another identical item in the cart; let's remove it and update the quantity in the editing item.
        cartItems.splice(cartItems.indexOf(existed), 1);
      }
      cartItems.splice(cartItems.indexOf(editing), 1, {
        ...editing,
        product,
        options,
        quantity: existed
          ? existed.quantity + quantity // updating the quantity of the identical item.
          : quantity,
      });
    }
  }

  // Hàm thêm sản phẩm mới vào giỏ
  function handleAppend(quantity: number, cartItems: CartItem[]) {
    const existed = cartItems.find((item) => isSameProduct(item, product));
    if (existed) {
      cartItems.splice(cartItems.indexOf(existed), 1, {
        ...existed,
        quantity: existed.quantity + quantity,
      });
    } else {
      cartItems.push({
        id: cartItems.length + 1,
        product,
        options,
        quantity,
      });
    }
  }

  const addToCart = (quantity: number) => {
    setCart((currentCart) => {
      const res = [...currentCart];
      if (editing) {
        handleReplace(quantity, res, editing);
      } else {
        handleAppend(quantity,res);
      }
      return res;
    });
  };

  return { addToCart, options, setOptions };
}

export function useCustomerSupport() {
  return () =>
    openChat({
      type: "oa",
      id: getConfig((config) => config.template.oaIDtoOpenChat),
    });
}

export function useToBeImplemented() {
  return () =>
    toast("Chức năng dành cho các bên tích hợp phát triển...", {
      icon: "🛠️",
    });
}

export function useCheckout() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const setCart = useSetAtom(cartState);
  return async () => {
    try {
      await purchase({
        amount: totalAmount,
        desc: "Thanh toán đơn hàng",
        method: "",
      });
      toast.success("Thanh toán thành công. Cảm ơn bạn đã mua hàng!", {
        icon: "🎉",
      });
      setCart([]);
    } catch (error) {
      toast.error(
        "Thanh toán thất bại. Vui lòng kiểm tra nội dung lỗi bên trong Console."
      );
      console.warn(error);
    }
  };
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<
    undefined,
    {
      title?: string | Function;
      logo?: boolean;
      back?: boolean;
      scrollRestoration?: number;
    }
  >[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle, lastMatch, matches] as const;
}
