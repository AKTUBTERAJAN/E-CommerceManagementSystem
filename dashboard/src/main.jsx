import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import { WatchListProvider } from "./landingpage/watchlist/watchlistcontext";
import { CartProvider } from "./landingpage/mycard/cardconext";
import { WalletProvider } from "./landingpage/wallet/walletcontext";
import { OrderProvider } from "./landingpage/myorder/ordercontext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <WatchListProvider>
      <CartProvider>
        <WalletProvider>
          <OrderProvider>

            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </BrowserRouter>

          </OrderProvider>
        </WalletProvider>
      </CartProvider>
    </WatchListProvider>
  </React.StrictMode>
);