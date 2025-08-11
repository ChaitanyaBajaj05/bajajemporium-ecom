import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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

export default function ProductList() {
  const { categorySlug, productTypeSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]); // example price range
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  const PRODUCTS_PER_PAGE = 16;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        ordering: sortBy,
        category: categorySlug || undefined,
        product_type: productTypeSlug || undefined,
        price_min: priceRange[0],
        price_max: priceRange[1],
        page: page,
        page_size: PRODUCTS_PER_PAGE,
      };
      const response = await axios.get("http://localhost:8000/api/filtered-products/", { params });

      setProducts(response.data.results || response.data); // support paginated results or array response
      setTotalPages(response.data.total_pages || 1);
      setError("");
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, categorySlug, productTypeSlug, priceRange, page]);

  const handleAddToCart = (productId) => {
    addToCart(productId, 1);
    toast.success("Added to cart!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // Price range change handlers
  const handlePriceChange = (e, index) => {
    const val = Number(e.target.value);
    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[index] = val;
      if (index === 0 && val > prev[1]) newRange[1] = val;
      if (index === 1 && val < prev[0]) newRange[0] = val;
      return newRange;
    });
    setPage(1); // Reset pagination when filtering
  };

  const handlePageChange = (newPage) => {
    if(newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={`${baseBackground} ${sectionPadding}`}>
      <div className={`${containerStyle}`}>
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
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

          {/* Sort Select */}
          <div className="relative w-full sm:w-auto max-w-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-white py-2 pl-10 pr-4 text-gray-700 appearance-none focus:border-pink-500 focus:ring-2 focus:ring-pink-300 transition outline-none"
              aria-label="Sort products"
            >
              <option value="newest">New Arrivals</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-discount_percentage">Best Discount</option>
            </select>
            <ArrowsUpDownIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-300" />
          </div>

          {/* Price Range Filter */}
          <div className="flex gap-2 items-center max-w-xs w-full">
            <label htmlFor="price-min" className="text-sm font-medium text-gray-700">Min:</label>
            <input
              id="price-min"
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-20 rounded-lg border border-pink-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
            />
            <label htmlFor="price-max" className="text-sm font-medium text-gray-700">Max:</label>
            <input
              id="price-max"
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-20 rounded-lg border border-pink-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-pink-100 h-96 shadow-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-rose-600 text-lg mb-6 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`${buttonStyle} max-w-xs mx-auto`}
              aria-label="Retry fetching products"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg select-none">No products found matching your criteria.</p>
            <Link
              to="/products"
              className={`${buttonStyle} mt-6 inline-block`}
              aria-label="Browse all products"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`${cardStyle} bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-50 flex flex-col relative group ${fadeIn}`}
                  tabIndex={0}
                  aria-label={`View details for ${product.name}`}
                >
                  <Link to={`/product/${product.slug}`} className="flex-grow rounded-t-2xl overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={product.images?.[0]?.image || "/images/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                        loading="lazy"
                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                        draggable={false}
                      />
                      {product.discount_percentage > 0 && (
                        <span className={`${productBadge} bg-rose-600 text-white shadow-md`}>
                          {product.discount_percentage}% OFF
                        </span>
                      )}
                      {product.is_new && (
                        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md select-none">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3
                        className={`${productTitle} text-gray-900 font-semibold line-clamp-2`}
                        title={product.name}
                      >
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
                        {product.available_colors &&
                          product.available_colors.length > 0 && (
                            <div className="flex gap-1 ml-2">
                              {product.available_colors
                                .slice(0, 3)
                                .map((color) => (
                                  <span
                                    key={color.id}
                                    className="w-5 h-5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.hex_code }}
                                    title={color.name}
                                  />
                                ))}
                            </div>
                          )}
                      </div>

                      {product.occasion && (
                        <div className="mt-1 text-xs text-gray-500 capitalize select-none">
                          {product.occasion}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className={`${productPrice} text-rose-600 font-bold text-xl`}>
                        ₹{product.discounted_price.toLocaleString()}
                      </p>
                      {product.discount_percentage > 0 && (
                        <p className="text-gray-400 line-through text-sm select-none">
                          ₹{product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`${buttonStyle} rounded-full text-white font-semibold px-6 py-2 hover:brightness-110 transition-transform transform hover:scale-105 flex justify-center items-center gap-2 select-none`}
                      aria-label={`Add ${product.name} to cart`}
                      type="button"
                    >
                      <ShoppingBagIcon className="inline-block w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 gap-4 select-none">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full bg-pink-200 px-4 py-2 font-semibold text-pink-700 disabled:opacity-50"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-pink-600 font-semibold py-2 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-full bg-pink-200 px-4 py-2 font-semibold text-pink-700 disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
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
