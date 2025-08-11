import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  containerStyle,
  sectionPadding,
  headingStyle,
  cardStyle,
  starStyle,
  subHeadingStyle,
} from "../theme";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/reviews/")
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to load reviews. Showing sample data.");
        // Sample fallback reviews on error
        setReviews([
          {
            id: 1,
            customer_name: "Priya Sharma",
            rating: 5,
            comment: "Beautiful fabric and amazing fit! Will buy again.",
            created_at: "2025-07-18T10:30:00Z",
          },
          {
            id: 2,
            customer_name: "Amit Verma",
            rating: 4,
            comment: "Great quality at this price. Delivery was quick too!",
            created_at: "2025-07-16T14:00:00Z",
          },
          {
            id: 3,
            customer_name: "Sneha Rajput",
            rating: 5,
            comment: "Loved the designer suits. Truly elegant and classy.",
            created_at: "2025-07-12T09:20:00Z",
          },
          {
            id: 4,
            customer_name: "Ravi Malhotra",
            rating: 3,
            comment: "Nice collection but size could be better.",
            created_at: "2025-07-10T08:15:00Z",
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section className={`${containerStyle} ${sectionPadding}`} aria-label="Customer Reviews">

      {loading && (
        <p className="text-center text-gray-500 text-lg py-12">Loading reviews...</p>
      )}

      {error && (
        <p className="text-center text-orange-600 mb-6 font-medium">{error}</p>
      )}

      {!loading && reviews.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          speed={800}
          className="max-w-3xl mx-auto"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <article
                className={`${cardStyle} p-8 rounded-3xl shadow-lg bg-white text-center mx-4`}
                tabIndex={0}
                aria-label={`Review by ${review.customer_name}`}
              >
                <h3 className="text-xl font-semibold text-rose-700 mb-3">
                  {review.customer_name}
                </h3>

                <div className="flex justify-center mb-4" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < review.rating;
                    return (
                      <svg
                        key={i}
                        className={`${starStyle} w-6 h-6 ${filled ? "text-rose-500" : "text-gray-300"}`}
                        fill={filled ? "currentColor" : "none"}
                        stroke={filled ? "none" : "currentColor"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" />
                      </svg>
                    );
                  })}
                </div>

                <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">"{review.comment}"</p>

                <time className="text-sm text-gray-400" dateTime={review.created_at}>
                  {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
