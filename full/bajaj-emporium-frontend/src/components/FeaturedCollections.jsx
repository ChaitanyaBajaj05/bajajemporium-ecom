import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import {
  cardStyle,
  productBadge,
  productTitleMinimal,
  productPriceMinimal,
  productImageWrapper,
  buttonStyle,
  containerStyle,
  sectionPadding,
  headingStyle,
} from "../theme";

export default function FeaturedCollections() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/featured/")
      .then((response) => {
        setFeaturedItems(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load featured collections.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold py-4">{error}</p>;
  }

  if (featuredItems.length === 0) {
    return <p className="text-center text-gray-500 py-4">No featured products found.</p>;
  }

  return (
    <section className={`${sectionPadding} ${containerStyle} bg-white`}>
      <h2 className={`${headingStyle} text-center mb-10 text-rose-700`}>
        Featured Collections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredItems.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.slug}`}
            className={`${cardStyle} flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group overflow-hidden`}
            aria-label={`View product ${item.name}`}
          >
            <div className="relative overflow-hidden group-hover:brightness-90 transition duration-300" style={{ flex: '1 1 auto' }}>
              <img
                src={item.images?.[0]?.image || "/images/placeholder.jpg"}
                alt={item.name}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                loading="lazy"
              />
              {item.discount_percentage > 0 && (
                <div className={`${productBadge} absolute top-3 left-3`}>
                  -{item.discount_percentage}%
                </div>
              )}
              <button
                onClick={(e) => handleAddToCart(e, item.id)}
                className="absolute bottom-3 right-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none transition-opacity"
                aria-label={`Add ${item.name} to cart`}
              >
                <ShoppingBagIcon className="h-4 w-4" /> Add to Cart
              </button>
            </div>

            <div className="p-4">
              <h3 className={`${productTitleMinimal} mb-2 truncate`}>{item.name}</h3>
              <div className={`${productPriceMinimal} mb-3`}>
                {item.discount_percentage > 0 ? (
                  <>
                    <span className="text-rose-600 font-semibold">
                      ₹{item.discounted_price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through ml-2">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-800 font-medium">
                    ₹{item.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Color swatches */}
              <div className="flex items-center space-x-2">
                {item.available_colors?.slice(0, 5).map((color) => (
                  <span
                    key={color.id}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    title={color.name}
                    style={{ backgroundColor: color.hex_code }}
                  />
                ))}
                {item.available_colors?.length > 5 && (
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 font-semibold">
                    +{item.available_colors.length - 5}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
