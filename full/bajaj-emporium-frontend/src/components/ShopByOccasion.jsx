import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  sectionPadding,
  containerStyle,
  cardStyle,
} from "../theme";

const hoverShadows = [
  "hover:shadow-pink-200",
  "hover:shadow-purple-200",
  "hover:shadow-pink-300",
  "hover:shadow-yellow-100",
  "hover:shadow-blue-100",
];

const categories = [
  {
    name: "Lehengas",
    img: "https://dishusarees.com/wp-content/uploads/2024/10/banner-tile-lehanga-2048x2048.webp",
    url: "/products/women/lehenga",
    grid: "md:col-start-1 md:row-start-1",
    overlay: "bg-pink-100/40",
    labelClass: "text-2xl font-bold text-gray-900",
    shadow: hoverShadows[0],
  },
  {
    name: "Suits",
    img: "https://dishusarees.com/wp-content/uploads/2024/09/g3-2048x1156.webp",
    url: "/products/women/suit",
    grid: "md:col-start-4 md:row-start-1",
    overlay: "bg-purple-100/40",
    labelClass: "text-2xl font-bold text-gray-900",
    shadow: hoverShadows[1],
  },
  {
    name: "Sarees",
    img: "https://dishusarees.com/wp-content/uploads/2024/10/saree-banner-title-2048x954.webp",
    url: "/products/women/saree",
    grid: "md:col-start-2 md:row-start-1 md:row-span-2 md:col-span-2 z-10",
    overlay: "bg-gradient-to-t from-pink-100/70 via-white/70 to-transparent",
    labelClass: "text-[2rem] md:text-[2.7rem] leading-none font-extrabold text-gray-900 drop-shadow",
    shadow: hoverShadows[2],
  },
  {
    name: "Dress",
    img: "https://dishusarees.com/wp-content/uploads/2024/10/bn-ts-1-2048x1156.png",
    url: "/products/women/dress",
    grid: "md:col-start-1 md:row-start-2",
    overlay: "bg-yellow-50/60",
    labelClass: "text-xl font-bold text-gray-900",
    shadow: hoverShadows[3],
  },
  {
    name: "Gowns",
    img: "https://dishusarees.com/wp-content/uploads/2024/09/gn-iii-2048x1156.webp",
    url: "/products/women/gown",
    grid: "md:col-start-4 md:row-start-2",
    overlay: "bg-blue-100/40",
    labelClass: "text-xl font-bold text-gray-900",
    shadow: hoverShadows[4],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function CategoryShowcase() {
  return (
    <section className={`${sectionPadding} ${containerStyle}`}>
      {/* Desktop & Tablet Grid (hidden on small screens) */}
      <motion.div
        className="hidden md:grid grid-cols-4 grid-rows-2 gap-6 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ minHeight: 420 }}
        aria-label="Category Tiles"
      >
        {categories.map((cat) => (
          <Link
            to={cat.url}
            key={cat.name}
            tabIndex={0}
            className={cat.grid}
            style={{ zIndex: cat.name === "Sarees" ? 9 : 1 }}
            aria-label={cat.name}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.045 }}
              className={`
                ${cardStyle}
                aspect-[1/1.05]
                md:aspect-[1/1.1]
                group
                bg-white
                overflow-hidden
                rounded-2xl
                transition
                duration-300
                ${cat.shadow}
                relative
                cursor-pointer
              `}
              style={{
                boxShadow:
                  cat.name === "Sarees"
                    ? "0 6px 32px 0 #f8bbd044"
                    : "0 3px 10px 0 #dfdae644",
              }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className={`
                  w-full h-full object-cover absolute inset-0
                  group-hover:scale-105 transition-transform duration-300
                `}
                style={{ zIndex: 1 }}
              />
              <div
                className={`
                  absolute inset-0
                  ${cat.overlay}
                  pointer-events-none
                  transition-all
                  duration-300
                  rounded-2xl
                `}
                style={{ zIndex: 2 }}
              />
              <div className="absolute bottom-0 left-0 right-0 w-full flex items-end justify-center pb-7 z-10">
                <span
                  className={`
                    ${cat.labelClass}
                    bg-white/70 backdrop-blur-[2px]
                    rounded-xl px-4 py-1
                    shadow-md
                    group-hover:text-pink-700
                    transition-colors
                    select-none
                  `}
                >
                  {cat.name}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Mobile Vertical List with Big Cards*/}
      <div className="md:hidden space-y-6">
        {categories.map((cat) => (
          <Link
            to={cat.url}
            key={cat.name}
            aria-label={cat.name}
            className="group block relative rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={cat.img}
              alt={cat.name}
              loading="lazy"
              className="w-full h-40 sm:h-48 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl pointer-events-none" />
            {/* Text & Button */}
            <div className="absolute inset-0 flex flex-col justify-center items-center px-6">
              <h3 className="text-white text-2xl font-bold drop-shadow-lg mb-3 text-center">
                {cat.name}
              </h3>
              <button className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold shadow-lg transition">
                Shop Now
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
