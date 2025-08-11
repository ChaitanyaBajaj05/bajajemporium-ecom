import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  baseBackground,
  containerStyle,
  sectionPadding,
  cardStyle,
  productBadge,
  buttonStyle,
  productTitle,
  productPrice,
  fadeIn,
} from "../theme";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products/", {
          params: {
            search: searchQuery,
            ordering: sortBy,
          },
        });
        setProducts(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayFetch = setTimeout(fetchAllProducts, 500);
    return () => clearTimeout(delayFetch);
  }, [searchQuery, sortBy]);

  const handleAddToCart = (productId) => {
    addToCart(productId, 1);
    toast.success("Added to cart!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  };

  if (loading) {
    return (
      <div className={`${baseBackground} ${sectionPadding}`}>
        <div className={`${containerStyle} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8`}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-pink-100 h-[360px] shadow-md"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseBackground} ${sectionPadding}`}>
        <div className={`${containerStyle} text-center py-16`}>
          <p className="text-rose-600 text-lg mb-6 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`${buttonStyle} max-w-xs mx-auto`}
            aria-label="Retry fetch products"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseBackground} ${sectionPadding}`}>
      <div className={`${containerStyle}`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-5">
          <h1 className="text-4xl font-extrabold text-gray-900 select-none">All Products</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-pink-300 bg-white px-10 py-2 text-gray-700 placeholder-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 transition outline-none"
                aria-label="Search products"
                spellCheck={false}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-300 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative flex items-center w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-pink-300 bg-white py-2 pl-10 pr-6 text-gray-700 appearance-none focus:border-pink-500 focus:ring-2 focus:ring-pink-300 transition outline-none"
                aria-label="Sort products"
              >
                <option value="newest">New Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-discount_percentage">Best Discount</option>
              </select>
              <ArrowsUpDownIcon className="pointer-events-none absolute left-3 h-5 w-5 text-pink-300" />
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-20 select-none">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`${cardStyle} group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-50 flex flex-col relative`}
                tabIndex={0}
                aria-label={`View details for ${product.name}`}
              >
                <Link to={`/product/${product.slug}`} className="flex-grow rounded-t-2xl overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={product.images?.[0]?.image || "/images/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 rounded-t-2xl"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      draggable={false}
                    />
                    {product.discount_percentage > 0 && (
                      <span className={`${productBadge} bg-rose-600 text-white shadow-lg`}>
                        {product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className={`${productTitle} text-gray-900 font-semibold line-clamp-2`} title={product.name}>
                      {product.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-3 items-center">
                      {product.is_best_seller && (
                        <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg font-semibold select-none">
                          Bestseller
                        </span>
                      )}
                      {product.fabric_type && (
                        <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-lg capitalize select-none">
                          {product.fabric_type}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className={`${productPrice} text-rose-600 font-extrabold text-2xl`}>
                          ₹{product.discounted_price.toLocaleString()}
                        </p>
                        {product.discount_percentage > 0 && (
                          <p className="text-gray-400 line-through text-sm select-none">
                            ₹{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={`${buttonStyle} m-5 px-6 py-3 rounded-full text-white font-semibold text-center hover:brightness-110 transition-transform transform hover:scale-105 flex justify-center items-center gap-2 select-none`}
                  aria-label={`Add ${product.name} to cart`}
                  type="button"
                >
                  <ShoppingBagIcon className="inline-block w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
