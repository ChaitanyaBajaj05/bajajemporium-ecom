import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  cardStyle,
} from "../theme";

const defaultProductTypes = ['suit', 'lehenga', 'saree']; // fallback if no product types fetched

export default function CategoryNav() {
  const { categorySlug, productTypeSlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [productTypesByCategory, setProductTypesByCategory] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories/`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Optionally fetch product types per category if your API supports it.
  // Here we assume a separate endpoint like `/api/categories/:slug/product-types/`
  // Otherwise, fall back to defaultProductTypes.
  useEffect(() => {
    categories.forEach((cat) => {
      axios.get(`/categories/${cat.slug}/product-types/`)
        .then((res) => {
          setProductTypesByCategory((prev) => ({ ...prev, [cat.slug]: res.data }));
        })
        .catch(() => {
          setProductTypesByCategory((prev) => ({ ...prev, [cat.slug]: defaultProductTypes }));
        });
    });
  }, [categories]);

  return (
    <nav className={`${cardStyle} p-6 bg-white`}>
      {categories.length === 0 ? (
        <p className="text-center text-gray-500 py-6">Loading categories...</p>
      ) : (
        categories.map((cat) => {
          const productTypes = productTypesByCategory[cat.slug] || defaultProductTypes;
          return (
            <div key={cat.slug} className="mb-6">
              <h3 className="text-2xl font-semibold text-rose-700 mb-3 select-none">{cat.name}</h3>
              <ul className="ml-4 space-y-2">
                {productTypes.map((type) => {
                  const isActive = categorySlug === cat.slug && productTypeSlug === type;
                  return (
                    <li key={type}>
                      <Link
                        to={`/shop/${cat.slug}/${type}`}
                        className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-rose-100 text-rose-700 font-semibold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:text-rose-600"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </nav>
  );
}
