// src/components/Brand.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  sectionPadding,
  containerStyle,
  headingStyle,
  productGrid,
  cardStyle,
  fadeIn,
} from "../theme";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/brands/");
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <section className={`${sectionPadding} ${containerStyle}`}>
      <h2 className={`${headingStyle} text-center mb-12`}>Our Brands</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className={productGrid}>
          {brands.map((brand) => (
            <div
              key={brand.id}
              className={`${cardStyle} flex flex-col items-center text-center ${fadeIn}`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-24 sm:h-28 object-contain mb-3 transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Brand;
