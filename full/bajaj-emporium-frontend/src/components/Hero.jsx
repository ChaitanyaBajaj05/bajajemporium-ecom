import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  sectionPadding,
  containerStyle,
  headingStyle,
  buttonStyle,
  secondaryButton,
} from "../theme";

// Your hero slide data
const heroSlides = [
  {
    url: "https://gangafashions.com/cdn/shop/files/saadgiBANNER2.jpg?v=1752499417",
    headline: "Unstitched Elegance",
    subtext: "Craft your perfect look with premium fabrics for every occasion.",
    label: "Shop Suit Fabrics",
    ctaLink: "/fabrics",
  },
  {
    url: "https://dishusarees.com/wp-content/uploads/2024/10/heor-banner-02-neo.jpg",
    headline: "Designer Lehenga Fabrics",
    subtext: "Handpicked luxury for weddings and festive celebrations.",
    label: "Explore Lehenga Styles",
    ctaLink: "/collections",
  },
  {
    url: "https://api.raymond.in/uploads/slider/1694599274410Raymond%20Made%20to%20Measure.jpg",
    headline: "Gents Kurta & Blazer Fabrics",
    subtext: "Sophisticated textures tailored to your taste.",
    label: "Shop Gents Collection",
    ctaLink: "/products/gents",
  },
];

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
    };
  },
};

export default function Hero() {
  const [[page, direction], setPage] = useState([0, 0]);

  const slideIndex = page % heroSlides.length;

  // Auto slide every 7 sec
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  function paginate(newDirection) {
    setPage([page + newDirection, newDirection]);
  }

  return (
    <section className={`relative w-full h-[85vh] max-h-[700px] overflow-hidden`}>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={heroSlides[slideIndex].url}
          alt={heroSlides[slideIndex].headline}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </AnimatePresence>

      <div
        className={`relative z-10 ${sectionPadding} ${containerStyle} flex flex-col justify-center h-full max-w-6xl text-center text-white`}
        style={{ pointerEvents: "none" }}
      >
        <motion.h1
          key={`headline-${page}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg"
          style={{ pointerEvents: "auto" }}
        >
          {heroSlides[slideIndex].headline}
        </motion.h1>

        <motion.p
          key={`subtext-${page}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-xl mx-auto mt-4 text-lg sm:text-xl font-medium drop-shadow-md"
          style={{ pointerEvents: "auto" }}
        >
          {heroSlides[slideIndex].subtext}
        </motion.p>

        <motion.div
          key={`buttons-${page}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
          style={{ pointerEvents: "auto" }}
        >
          <a
            href={heroSlides[slideIndex].ctaLink}
            className={`${buttonStyle} px-12 py-3 rounded-full shadow-lg`}
            aria-label={heroSlides[slideIndex].label}
          >
            {heroSlides[slideIndex].label}
          </a>
          <a href="/collections" className={secondaryButton} aria-label="Explore Collections">
            Explore Collections
          </a>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage([idx, idx > slideIndex ? 1 : -1])}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === slideIndex ? "true" : undefined}
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              idx === slideIndex ? "bg-pink-600" : "bg-pink-300 hover:bg-pink-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
  