import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  sectionPadding,
  containerStyle,
  sectionTitleWithUnderline,
  productCardMinimal,
  productImageWrapper,
  productTitleMinimal,
  productPriceMinimal,
  buttonStyle,
} from "../theme";

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/best-sellers/");
        setNewArrivals(response.data);
      } catch (err) {
        setError("Failed to load new arrivals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className={`${sectionPadding} ${containerStyle}`}>
        <h2 className={`${sectionTitleWithUnderline} mb-8`}>New Arrivals</h2>
        <p className="text-center text-gray-500">Loading latest products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${sectionPadding} ${containerStyle}`}>
        <h2 className={`${sectionTitleWithUnderline} mb-8`}>New Arrivals</h2>
        <p className="text-center text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className={`${sectionPadding} ${containerStyle}`}>
      <h2 className={`${sectionTitleWithUnderline} mb-8`}>New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {newArrivals.length === 0 && <p className="text-center text-gray-500 col-span-full">No new arrivals available right now.</p>}
        {newArrivals.map((product) => (
          <div
            key={product.id}
            className={`${productCardMinimal} cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            onClick={() => navigate(`/product/${product.slug}`)}
            role="link"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/product/${product.slug}`);
            }}
            aria-label={`View product ${product.name}`}
          >
            <div className={`${productImageWrapper} rounded-t-lg overflow-hidden bg-gray-50`} aria-hidden="true">
              <img
                src={product.images?.[0]?.image || "/images/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h3 className={`${productTitleMinimal} text-gray-900 truncate`}>{product.name}</h3>
              <div className={`${productPriceMinimal} mt-2`}>
                {product.discount_percentage > 0 ? (
                  <>
                    <span className="font-bold text-rose-600">₹{product.discounted_price.toLocaleString()}</span>
                    <span className="line-through text-gray-400 ml-2">₹{product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
