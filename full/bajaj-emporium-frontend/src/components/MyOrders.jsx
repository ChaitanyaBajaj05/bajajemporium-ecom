import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import {
  containerStyle,
  sectionPadding,
  cardStyle,
  headingStyle,
  buttonStyle,
  errorText,
  emptyText,
} from "../theme";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Debugging info
        console.log("Fetched Orders:", res.data);
        setOrders(res.data);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("Failed to load orders. Try again!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `http://localhost:8000/api/orders/${orderId}/cancel/`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      alert("Failed to cancel order.");
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
      case "refunded":
        return "bg-rose-100 text-rose-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading
  if (loading)
    return (
      <div className="flex justify-center items-center py-16">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );

  // Error
  if (error)
    return (
      <div className={`${sectionPadding} ${containerStyle} text-center`}>
        <p className={`${errorText} mb-4`}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`${buttonStyle} px-6 py-2 rounded shadow-md`}
        >
          Try Again
        </button>
      </div>
    );

  // No orders
  if (!orders.length)
    return (
      <div className={`${sectionPadding} ${containerStyle} text-center`}>
        <p className={emptyText}>
          You have no orders yet.
          <Link to="/products" className="text-rose-600 underline ml-2">
            Shop Now
          </Link>
        </p>
      </div>
    );

  return (
    <div className={`${sectionPadding} ${containerStyle} max-w-4xl mx-auto`}>
      <h1 className={`${headingStyle} mb-8`}>Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className={`${cardStyle} p-6`}>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.placed_at).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
                <p className="text-lg font-bold text-rose-600">
                  ₹{order.total_cost?.toLocaleString("en-IN") || "0"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Items:</h3>
              <div className="space-y-4">
                {(order.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-start border rounded-lg p-3"
                  >
                    <img
                      src={item.product_data?.images?.[0] || "/images/placeholder.jpg"}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.product_price.toLocaleString("en-IN")}</p>
                        {item.product_data?.fabric_type && (
                          <p>Fabric: {item.product_data.fabric_type}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      ₹
                      {(item.product_price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="border-t pt-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">Shipping Address:</p>
                  <p className="text-gray-600">{order.shipping_address || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-medium">Payment Method:</p>
                  <p className="text-gray-600 capitalize">{order.payment_method || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Cancel button */}
            {order.status?.toLowerCase() === "pending" && (
              <div className="border-t pt-4 mt-4 flex justify-end">
                <button
                  className={`${buttonStyle} bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded`}
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
