import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { containerStyle, sectionPadding, buttonStyle } from "../theme";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/cart/get_cart/");
        setCart(res.data);
      } catch (err) {
        console.error("Cart fetch error:", err);
        toast.error("Failed to load cart. Please try again.");
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) {
      toast.info("Your cart is empty.");
      return;
    }
    setPlacingOrder(true);
    try {
      await axios.post("/api/orders/place_order/");
      toast.success("Order placed successfully!");
      navigate("/profile"); // Adjust this as per your route for orders/profile
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <div className={`flex justify-center items-center py-16 ${containerStyle}`}>
        <svg
          className="animate-spin h-10 w-10 text-rose-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading cart"
          role="img"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );

  return (
    <div className={`${containerStyle} ${sectionPadding} max-w-3xl mx-auto bg-white rounded-xl shadow p-6`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>

      {cart?.items?.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200 mb-6" aria-label="Cart items list">
            {cart.items.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  ₹{item.total_price.toLocaleString("en-IN")}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Total: ₹{cart.total.toLocaleString("en-IN")}
            </h3>
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className={`${buttonStyle} px-6 py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-disabled={placingOrder}
              aria-busy={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}
