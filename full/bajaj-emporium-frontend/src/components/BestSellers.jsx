import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  sectionPadding,
  containerStyle,
  headingStyle,
  baseBackground,
  productCard,
  productImage,
  productTitle,
  productPrice,
  productBadge,
} from "../theme";

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/best-sellers/")
      .then((response) => {
        setBestSellers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load best-selling products.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-semibold py-8">{error}</p>
    );
  }

  if (bestSellers.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No best-selling products found.</p>
    );
  }

  return (
    <section className={`${sectionPadding} ${baseBackground}`}>
      <div className={`${containerStyle}`}>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            type: "bullets",
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={800}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="relative"
        >
          {bestSellers.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className={`${productCard} cursor-pointer relative rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white flex flex-col`}
                onClick={() => navigate(`/product/${item.slug}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && navigate(`/product/${item.slug}`)}
                aria-label={`View details for ${item.name}`}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-xl">
                  <img
                    src={item.images?.[0]?.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    className={`${productImage} object-cover w-full h-full transition-transform duration-500 hover:scale-105 rounded-t-xl`}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    loading="lazy"
                  />
                  {item.is_trending && (
                    <div className={`${productBadge} top-2 left-2 bg-rose-600 text-white font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 text-xs shadow-lg`}>
                      <StarIcon className="h-4 w-4" /> Trending
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 flex flex-col flex-grow">
                  <h3
                    className={`${productTitle} text-gray-900 font-semibold text-lg truncate`}
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-2">
                    {item.discount_percentage > 0 ? (
                      <>
                        <span className={`${productPrice} text-rose-600 font-bold text-lg`}>
                          ₹{item.discounted_price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className={`${productPrice} font-semibold text-lg`}>
                        ₹{item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation Buttons */}
          <button
            aria-label="Previous slide"
            className="swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-rose-600 hover:bg-rose-50 transition cursor-pointer z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            aria-label="Next slide"
            className="swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-rose-600 hover:bg-rose-50 transition cursor-pointer z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* Pagination */}
          <div className="swiper-pagination mt-8 flex justify-center gap-3" />
        </Swiper>
      </div>
    </section>
  );
}
