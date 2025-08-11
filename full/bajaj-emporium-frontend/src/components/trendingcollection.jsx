import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import {
  containerStyle,
  sectionPadding,
  productCardMinimal,
  productImageWrapper,
  productBadge,
  productTitleMinimal,
  productPriceMinimal,
} from "../theme";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TrendingCollection() {
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/trending/");
        setTrendingItems(response.data);
      } catch (err) {
        setError("Failed to load trending products.");
        console.error("Trending products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <section className={sectionPadding}>
      <div className={containerStyle}>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold py-4">{error}</p>
        )}

        {trendingItems.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 py-4">No trending products found.</p>
        )}

        {trendingItems.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              type: "bullets",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={800}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="relative"
          >
            {trendingItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className={`${productCardMinimal}`}
                  onClick={() => navigate(`/product/${item.slug}`)}
                >
                  <div className={productImageWrapper}>
                    <img
                      src={item.images?.[0]?.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      loading="lazy"
                    />
                    {item.discount_percentage > 0 && (
                      <span className={productBadge}>{item.discount_percentage}% OFF</span>
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <h3 className={productTitleMinimal}>{item.name}</h3>
                    <div className={productPriceMinimal}>
                      {item.discount_percentage > 0 ? (
                        <>
                          <span className="font-bold text-rose-600">
                            ₹{item.discounted_price.toLocaleString()}
                          </span>
                          <span className="text-gray-400 line-through">
                            ₹{item.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="swiper-button-prev !text-rose-600 hover:!text-rose-800" />
            <div className="swiper-button-next !text-rose-600 hover:!text-rose-800" />
            <div className="swiper-pagination mt-6" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
