import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import QuickBuyModal from "./components/quick-buy-modal";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <QuickBuyModal />
    </>
  );
} 