import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";

//Pages
import LandingPage from "./components/pages/LandingPage";
import Products from "./components/pages/Products";
import About from "./components/pages/About";
import ProductManagement from "./components/adminPages/prodManagement";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import ProfilePage from "./components/pages/ProfilePage";
import Checkout from "./components/Checkout";
import MyOrders from "./components/pages/MyOrders";
import InvManagement from "./components/adminPages/invManagement";
import OrderManagement from "./components/adminPages/orderManagement";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/admin/inventory" element={<InvManagement />} />
          <Route path="/admin/order-management" element={<OrderManagement />} />
          {}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
