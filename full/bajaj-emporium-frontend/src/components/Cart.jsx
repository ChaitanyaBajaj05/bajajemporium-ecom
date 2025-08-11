import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import {
  baseBackground,
  containerStyle,
  cardStyle,
  buttonStyle,
} from "../theme";

export default function Cart() {
  const {
    cart,
    totalCost,
    loading,
    error,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useCart();

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${baseBackground}`}
        aria-busy="true"
        aria-label="Loading cart"
      >
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-rose-500 border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${baseBackground}`}
        role="alert"
        aria-live="assertive"
      >
        <p className="text-red-600 text-xl mb-6 select-none">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`${buttonStyle} max-w-xs`}
          aria-label="Retry loading cart"
        >
          Try Again
        </button>
      </div>
    );

  if (!cart || cart.length === 0)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center p-8 ${baseBackground}`}
      >
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 select-none">
          Your cart is currently empty
        </h2>
        <Link
          to="/"
          className={`${buttonStyle} inline-flex items-center gap-2`}
          aria-label="Continue shopping"
        >
          <ArrowLeftIcon className="w-6 h-6" />
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className={`${baseBackground} min-h-screen py-10 px-4 sm:px-6 lg:px-8`}>
      <div className={`${containerStyle} flex flex-col lg:flex-row gap-12`}>
        {/* Cart Items */}
        <section className="flex-1">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 select-none">
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="group flex items-center gap-2 text-rose-600 hover:text-rose-700 select-none"
              aria-label="Clear cart"
            >
              <XMarkIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Clear Cart
            </button>
          </header>

          <AnimatePresence>
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`${cardStyle} flex flex-col sm:flex-row gap-6 p-6`}
                  role="group"
                  aria-label={`Cart item: ${product.name}`}
                >
                  <img
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/placeholder.png";
                    }}
                    className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl shadow-md select-none"
                    draggable={false}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        {product.fabric_type && (
                          <p className="text-sm text-gray-600 mt-1 select-none">
                            Fabric: {product.fabric_type}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="text-gray-400 hover:text-red-600 rounded-full p-2 select-none"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg overflow-hidden select-none">
                        <button
                          onClick={() => updateQuantity(product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="px-4 py-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          −
                        </button>
                        <span className="px-6 py-2 bg-white text-center text-lg border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, Math.min(10, item.quantity + 1))}
                          disabled={item.quantity >= 10}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="px-4 py-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-rose-600 select-none">
                          ₹{(product.discounted_price * item.quantity).toLocaleString()}
                        </p>
                        {product.discount_percentage > 0 && (
                          <p className="text-sm text-gray-400 line-through select-none">
                            ₹{(product.price * item.quantity).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Order Summary */}
        <aside
          className={`${cardStyle} max-w-lg shrink-0 sticky top-20 p-8 flex flex-col gap-6`}
          aria-label="Order summary"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 select-none">
            Order Summary
          </h2>
          <div className="flex justify-between text-lg">
            <span>Items ({cart.reduce((acc, i) => acc + i.quantity, 0)})</span>
            <span>₹{totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between text-2xl font-extrabold text-rose-600 select-none">
            <span>Total</span>
            <span>₹{totalCost.toLocaleString()}</span>
          </div>

          <Link
            to="/Checkout"
            className={`${buttonStyle} w-full py-4 text-center`}
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/"
            className="inline-flex justify-center items-center gap-2 mt-4 text-rose-600 hover:underline select-none"
            aria-label="Continue shopping"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
