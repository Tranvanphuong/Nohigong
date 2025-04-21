import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import ProductListPage from "@/pages/catalog/product-list";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import AccountInfoPage from "@/pages/profile/account-info";
import SearchPage from "@/pages/search";
import CheckoutPage from "@/pages/checkout";
import AddressPage from "@/pages/address";
import PaymentSuccessPage from "@/pages/payment-success";
import OrdersPage from "@/pages/orders";
import OrderDetail from "@/pages/orders/order-detail";
import { createBrowserRouter } from "react-router-dom";
import { getBasePath } from "@/utils/zma";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/categories",
          element: <CategoryListPage />,
          handle: {
            title: "Danh mục sản phẩm",
            back: false,
          },
        },
        {
          path: "/cart",
          element: <CartPage />,
          handle: {
            title: "Giỏ hàng",
          },
        },
        {
          path: "/checkout",
          element: <CheckoutPage />,
          handle: {
            title: "Thanh toán",
            back: true,
          },
        },
        {
          path: "/address",
          element: <AddressPage />,
          handle: {
            title: "Địa chỉ nhận hàng",
            back: true,
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/profile/account-info",
          element: <AccountInfoPage />,
          handle: {
            title: "Thông tin tài khoản",
            back: true,
          },
        },
        {
          path: "/orders",
          element: <OrdersPage />,
          handle: {
            title: "Đơn đã mua",
            back: true,
          },
        },
        {
          path: "/orders/:id",
          element: <OrderDetail />,
          handle: {
            title: "Chi tiết đơn hàng",
            back: true,
          },
        },
        {
          path: "/flash-sales",
          element: <ProductListPage />,
          handle: {
            title: "Flash Sales",
          },
        },
        {
          path: "/category/:id",
          element: <ProductListPage />,
          handle: {
            title: ({ categories, params }) =>
              categories.find((c) => c.id === Number(params.id))?.name,
          },
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          handle: {
            scrollRestoration: 0, // when user selects another product in related products, scroll to the top of the page
          },
        },
        {
          path: "/search",
          element: <SearchPage />,
          handle: {
            title: "Tìm kiếm",
          },
        },
        {
          path: "/payment-success",
          element: <PaymentSuccessPage />,
          handle: {
            title: "Đặt hàng thành công",
            back: false,
          },
        },
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;
