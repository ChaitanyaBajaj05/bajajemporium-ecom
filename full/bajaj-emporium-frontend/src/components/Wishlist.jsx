import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import axios from "axios";

import {
  containerStyle,
  buttonStyle,
  cardStyle,
  sectionPadding,
  headingStyle,
  errorText,
  emptyText,
} from "../theme";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}wishlist/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data);
      } catch (err) {
        setError("Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8000/api/wishlist/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      setError("Failed to remove item from wishlist.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );

  if (error)
    return (
      <div className={`${sectionPadding} ${containerStyle} text-center`}>
        <p className={`${errorText} mb-4`}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`${buttonStyle} inline-block px-6 py-2 rounded shadow-md hover:bg-rose-600`}
        >
          Try Again
        </button>
      </div>
    );

  if (!wishlist.length)
    return (
      <div className={`${sectionPadding} ${containerStyle} text-center`}>
        <p className={emptyText}>
          Your wishlist is empty.
          <Link to="/products" className="text-rose-600 underline ml-2">
            Browse Products
          </Link>
        </p>
      </div>
    );

  return (
    <div className={`${sectionPadding} ${containerStyle}`}>
      <h1 className={`${headingStyle} mb-8`}>My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className={`${cardStyle} group relative p-4`}>
            <Link to={`/products/${item.product.slug}`} className="block">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <img
                  src={item.product.images?.[0]?.image || "/images/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                  loading="lazy"
                />
                {item.product.discount_percentage > 0 && (
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {item.product.discount_percentage}% OFF
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{item.product.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-rose-600">
                    ₹{item.product.discounted_price?.toLocaleString()}
                  </span>
                  {item.product.discount_percentage > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{item.product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => addToCart(item.product.id, 1)}
                className={`${buttonStyle} flex-1 flex items-center justify-center gap-2`}
                aria-label={`Add ${item.product.name} to cart`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.product.id)}
                className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
                title="Remove from wishlist"
                aria-label={`Remove ${item.product.name} from wishlist`}
              >
                <HeartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
