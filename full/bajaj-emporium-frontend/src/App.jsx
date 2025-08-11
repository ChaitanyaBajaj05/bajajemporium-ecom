import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Home from "./components/home";
import ProductDetail from "./components/ProductDetail";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Orders from "./components/MyOrders";
import Wishlist from "./components/Wishlist";
import VerifyOtp from "./components/verification";
import Fabrics from "./components/fabrics";
import ChatBot from "./components/ChatBot";
import Checkout from "./components/Checkout"; // 👈 Make sure this exists

function CartProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    const publicRoutes = ["/login", "/signup", "/verify-otp"];
    if (!token && !publicRoutes.includes(location.pathname)) {
      setShowOtp(true);
    }
  }, [token, location.pathname]);

  if (!token && showOtp) {
    return <VerifyOtp onClose={() => setShowOtp(false)} />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/profilepage" element={<ProfilePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/fabrics" element={<Fabrics />} />

              <Route
                path="/cart"
                element={
                  <CartProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 py-8">
                      <Cart />
                    </div>
                  </CartProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <CartProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 py-8">
                      <Checkout />
                    </div>
                  </CartProtectedRoute>
                }
              />

              <Route
                path="/products/:categorySlug/:productTypeSlug"
                element={
                  <div className="max-w-7xl mx-auto px-2 sm:px-6 py-8">
                    <ProductList />
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
          <ToastContainer position="top-right" autoClose={2000} />

          {isLoggedIn && <ChatBot />}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
