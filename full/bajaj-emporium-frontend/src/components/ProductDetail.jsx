import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  ShoppingBagIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  buttonStyle,
  secondaryButton,
  baseBackground,
  containerStyle,
  productBadge,
  sectionPadding,
  headingStyle,
  starStyle,
  cardStyle,
} from "../theme";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(
          `http://127.0.0.1:8000/api/products/${slug}/`
        );
        setProduct(productResponse.data);

        const reviewsResponse = await axios.get(
          `http://127.0.0.1:8000/api/reviews/?product=${productResponse.data.id}`
        );
        setReviews(reviewsResponse.data);
      } catch {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleAddToCart = async () => {
    if (product.stock === 0) return toast.error("Product is out of stock.");
    const success = await addToCart(product.id, quantity);
    success
      ? toast.success(`${product.name} added to cart!`)
      : toast.error("Failed to add to cart");
  };

  const submitReview = async (reviewData) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/reviews/", {
        ...reviewData,
        product: product.id,
      });
      toast.success("Review submitted!");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reviews/?product=${product.id}`
      );
      setReviews(response.data);
      setShowReviewForm(false);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${baseBackground} min-h-screen py-10 px-4 sm:px-6 lg:px-10`}
    >
      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex items-center justify-between border-t border-gray-200 z-30">
        <div>
          <span className="text-lg font-bold text-rose-600">
            ₹{product.discounted_price.toLocaleString()}
          </span>
          {product.discount_percentage > 0 && (
            <span className="ml-2 text-gray-400 line-through text-sm">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        <button
          disabled={product.stock === 0}
          onClick={handleAddToCart}
          className={`flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white transition ${
            product.stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
          aria-label="Add to cart"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          Add to Cart
        </button>
      </div>

      {/* Main content container */}
      <div className={`${containerStyle} grid grid-cols-1 lg:grid-cols-2 gap-12`}>
        {/* Image Gallery */}
        <motion.div variants={childVariants} className="space-y-6">
          <div className="relative aspect-[1/1] bg-white rounded-3xl shadow-xl overflow-hidden group">
            <img
              src={product.images[selectedImg]?.image}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105 rounded-3xl"
              onClick={() =>
                window.open(product.images[selectedImg]?.image, "_blank")
              }
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_best_seller && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`${productBadge} bg-amber-500 text-white shadow-lg`}
                >
                  Bestseller
                </motion.span>
              )}
              {product.discount_percentage > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`${productBadge} bg-rose-600 text-white animate-pulse shadow-lg`}
                >
                  {product.discount_percentage}% OFF
                </motion.span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <motion.div
            variants={childVariants}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-thumb-rounded scrollbar-thumb-pink-300 scrollbar-thin"
          >
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                  selectedImg === idx
                    ? "border-rose-600 ring-2 ring-rose-100"
                    : "border-gray-200 hover:border-rose-300"
                }`}
                aria-label={`Select image ${idx + 1}`}
              >
                <img
                  src={img.image}
                  alt={`${product.name} image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          variants={childVariants}
          className="lg:sticky lg:top-28 space-y-8 bg-white p-8 rounded-3xl shadow-lg"
        >
          {/* Title and Price */}
          <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-3xl font-bold text-rose-600">
              ₹{product.discounted_price.toLocaleString()}
            </span>
            {product.discount_percentage > 0 && (
              <span className="text-gray-400 line-through text-lg">
                ₹{product.price.toLocaleString()}
              </span>
            )}
            <span className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-800 font-semibold select-none">
              {averageRating} ★ ({reviews.length})
            </span>
          </div>

          {/* Color Swatches */}
          <div>
            <h3 className="font-medium mb-3">Colors</h3>
            <div className="flex gap-4">
              {product.available_colors.map((color) => (
                <button
                  key={color.id}
                  className="w-10 h-10 rounded-full border-2 shadow-md relative group focus:outline-none focus:ring-4 focus:ring-pink-400"
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                >
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none select-none">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-8 flex-wrap">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-5 py-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = Math.min(
                    Math.max(1, Number(e.target.value)),
                    product.stock
                  );
                  setQuantity(val);
                }}
                className="w-20 text-center border-x border-gray-300 outline-none focus:border-pink-400 focus:ring-pink-400 rounded-none"
                aria-label="Quantity input"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-5 py-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span
              className={`text-sm font-semibold select-none ${
                product.stock > 0 ? "text-green-600" : "text-rose-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Product Details Accordion */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <details open className="group">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-gray-50 text-gray-700 font-semibold list-none select-none">
                Product Details
                <svg
                  className="w-6 h-6 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 text-sm text-gray-600 bg-white">
                <DetailItem label="Fabric Type" value={product.fabric_type} />
                <DetailItem label="Work Type" value={product.work_type} />
                <DetailItem label="Occasion" value={product.occasion} />
                <DetailItem label="Care" value={product.care_instructions} />
                <DetailItem label="Kurta Length" value={`${product.kurta_length}m`} />
                <DetailItem label="Bottom Length" value={`${product.bottom_length}m`} />
                <DetailItem label="Dupatta Length" value={`${product.dupatta_length}m`} />
              </dl>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-3 rounded-lg py-4 font-semibold text-white transition ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
              aria-label="Add to cart"
            >
              <ShoppingBagIcon className="w-6 h-6" /> Add to Cart
            </button>
            <button
              className={`${secondaryButton} rounded-lg flex items-center justify-center gap-2 py-3 px-4`}
              aria-label="Add to wishlist"
            >
              <HeartIcon className="w-6 h-6 text-rose-600" />
              Wishlist
            </button>
            <button
              className={`${secondaryButton} rounded-lg flex items-center justify-center gap-2 py-3 px-4`}
              aria-label="Share product"
            >
              <ShareIcon className="w-6 h-6 text-rose-600" />
              Share
            </button>
          </div>

          {/* Reviews Section */}
          <motion.section variants={childVariants} className="pt-12">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-rose-600">
                <StarIcon className="w-7 h-7 text-amber-400" />
                Customer Reviews
                <span className="text-gray-500 text-lg font-medium">({reviews.length})</span>
              </h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-rose-600 hover:text-rose-700 font-semibold uppercase tracking-wide"
                aria-expanded={showReviewForm}
              >
                {showReviewForm ? "Close Review" : "Write a Review"}
              </button>
            </div>

            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-10"
                >
                  <ReviewForm onSubmit={submitReview} />
                </motion.div>
              )}
            </AnimatePresence>

            {reviews.length > 0 ? (
              <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-thumb-rounded scrollbar-thumb-pink-300 scrollbar-thin">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${cardStyle} p-6 rounded-2xl bg-gray-50 shadow-md`}
                    tabIndex={0}
                    aria-label={`Review by ${review.customer_name}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-semibold text-xl select-none">
                        {review.customer_name[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{review.customer_name}</h4>
                        <div className="flex items-center gap-1" aria-label={`Rating: ${review.rating} stars`}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? "text-amber-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-lg leading-relaxed">{review.comment}</p>
                    <time className="text-sm text-gray-400 mt-2 block" dateTime={review.created_at}>
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12 text-lg font-medium">No reviews yet. Be the first to review!</p>
            )}
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ReviewForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ customer_name: "", rating: 5, comment: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto"
      aria-label="Write a product review form"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-rose-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2" role="radiogroup" aria-label="Star rating">
          {[5, 4, 3, 2, 1].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setFormData({ ...formData, rating: num })}
              className={`flex items-center rounded-lg p-2 focus:outline-none ${
                formData.rating === num ? "bg-amber-100" : "bg-gray-100"
              }`}
              aria-checked={formData.rating === num}
              role="radio"
              aria-label={`Rate ${num} star${num > 1 ? "s" : ""}`}
            >
              {[...Array(num)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-amber-400" />
              ))}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Review
        </label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-4 py-3 h-32 resize-none focus:border-rose-500 focus:ring-rose-500 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className={`${buttonStyle} w-full py-3 text-lg font-semibold rounded-lg`}
        aria-label="Submit review"
      >
        Submit Review
      </button>
    </form>
  );
}

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-gray-900">{value || "N/A"}</dd>
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
    <div>
      <div className="aspect-square bg-gray-200 rounded-3xl " />
      <div className="mt-6 flex gap-4 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
    <div className="space-y-8">
      <div className="h-10 bg-gray-200 rounded w-3/4" />
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="max-w-7xl mx-auto px-4 py-16 text-center">
    <div className="p-8 bg-rose-50 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold text-rose-600 mb-6">⚠️ Error Loading Product</h2>
      <p className="text-gray-600 mb-8">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition font-semibold"
        aria-label="Reload page"
      >
        Try Again
      </button>
    </div>
  </div>
);
