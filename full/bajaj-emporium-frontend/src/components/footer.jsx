import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaCcVisa,
  FaCcMastercard,
  FaGooglePay,
  FaMoneyBillWave,
} from "react-icons/fa";

import { containerStyle } from "../theme";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const quickLinks = [
    { label: "New Arrivals", to: "/new-arrivals" },
    { label: "Women", to: "/products/women" },
    { label: "Men", to: "/products/men" },
    { label: "Handloom", to: "/handloom" },
    { label: "Sale", to: "/sale" },
  ];

  const customerServiceLinks = [
    { label: "Contact Us", to: "/contact" },
    { label: "Order Tracking", to: "/order-tracking" },
    { label: "Shipping & Returns", to: "/shipping-returns" },
    { label: "FAQs", to: "/faqs" },
  ];

  // Example brands - replace with actual brand data or fetch from API
  const brands = [
    "Raymond",
    "Ganga",
    "Netra",
    "Krupali",
    "Jay-Viajy",
    "Krish",
    "Ethnic Aura",
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    // Simulate async submission - replace this with actual API call if available
    setTimeout(() => {
      setSubmitting(false);
      setMessage("Thank you for subscribing!");
      setEmail("");
    }, 1500);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className={`${containerStyle} grid grid-cols-1 md:grid-cols-5 gap-10 px-6`}>
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">Bajaj Emporium</h2>
          <p className="text-sm mt-3 leading-relaxed">
            Premium unstitched ethnic wear for men & women. Discover timeless
            designs with a touch of tradition.
          </p>
          <div className="flex space-x-4 mt-5">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white text-lg transition focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white text-lg transition focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/your-number" // Replace with your WhatsApp link
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-white text-lg transition focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav aria-label="Quick links">
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="hover:text-white transition focus:outline-none focus:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Customer Service */}
        <nav aria-label="Customer Service links">
          <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            {customerServiceLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="hover:text-white transition focus:outline-none focus:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Brands Section */}
        <nav aria-label="Our Brands">
          <h3 className="text-white text-lg font-semibold mb-4">Brands</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {brands.map((brand) => (
              <li key={brand} className="hover:text-white cursor-default transition">
                {brand}
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter & Payment */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-3">
            Stay updated with our latest collections & exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="footer-newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="footer-newsletter"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
              required
              aria-required="true"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={submitting}
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-2 text-sm ${
                message.toLowerCase().includes("thank")
                  ? "text-green-400"
                  : "text-rose-500"
              }`}
              role="alert"
            >
              {message}
            </p>
          )}
          <div className="mt-6">
            <h3 className="text-white text-lg font-semibold mb-2">We Accept</h3>
            <div className="flex items-center space-x-4 text-3xl text-white">
              <FaCcVisa title="Visa" />
              <FaCcMastercard title="MasterCard" />
              <FaGooglePay title="Google Pay / UPI" />
              <FaMoneyBillWave title="Cash on Delivery" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500 px-6">
        &copy; 2025{" "}
        <span className="text-white font-medium">Bajaj Emporium</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
