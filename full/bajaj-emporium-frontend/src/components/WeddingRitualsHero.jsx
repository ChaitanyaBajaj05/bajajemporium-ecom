import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  sectionPadding,
  containerStyle,
  headingStyle,
  buttonStyle,
  cardStyle,
} from "../theme";

const ceremonies = [
  {
    name: "Reception",
    img: "https://i.pinimg.com/originals/e2/be/89/e2be89ae32983ec5028c85aa67607be7.jpg",
    url: "/products/women/reception",
    primary: true,
    button: "Purchase Now",
    overlay: "bg-gradient-to-b from-black/30 via-pink-50/30 to-white/10",
    labelClass: "text-3xl font-extrabold text-white tracking-wide drop-shadow-xl",
  },
  {
    name: "Mehndi",
    img: "https://www.k4fashion.com/wp-content/uploads/2020/02/What-do-brides-wear-for-Mehndi-Function-Know-from-Real-Brides-1.jpg",
    url: "/products/women/sangeet",
    primary:true,
    button: "Shop Now",
    overlay: "bg-gradient-to-b from-purple-200/30 via-white/20 to-transparent",
    labelClass: "text-xl font-bold text-white tracking-wide drop-shadow",
  },
  {
    name: "Engagement",
    img: "https://shaadiwish.com/blog/wp-content/uploads/2021/12/engagement-lehenga-819x1024.jpg",
    url: "/products/women/engagement",
    overlay: "bg-gradient-to-b from-blue-900/30 via-white/10 to-transparent",
    labelClass: "text-xl font-bold text-white tracking-wide drop-shadow",
  },
    {
    name: "Marriage",
    img: "https://cdn0.weddingwire.in/articles/images/7/1/3/6/img_86317/marriage-function-dress-for-female-suneet-varma-red-lehenga.jpg",
    url: "/products/women/sangeet",
    primary:true,
    button: "Shop Now",
    overlay: "bg-gradient-to-b from-purple-200/30 via-white/20 to-transparent",
    labelClass: "text-xl font-bold text-white tracking-wide drop-shadow",
  },
];

const positions = {
  left: { x: "-110%", scale: 0.75, opacity: 0.5, zIndex: 1 },
  center: { x: "0%", scale: 1, opacity: 1, zIndex: 10 },
  right: { x: "110%", scale: 0.75, opacity: 0.5, zIndex: 1 },
};

export default function WeddingRitualsCarousel() {
  const [selected, setSelected] = useState(0);

  const getPosition = (index) => {
    if (index === selected) return "center";
    if ((selected === 0 && index === ceremonies.length - 1) || index === selected - 1) return "left";
    return "right";
  };

  return (
    <section className={`${sectionPadding} ${containerStyle} w-full`}>
      <h1 className={`${headingStyle} text-center mb-4 text-pink-700`}>Indian Wedding Rituals</h1>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Fashionable Outfits &nbsp;||&nbsp; Beautiful Ethnic Wear &nbsp;||&nbsp; Latest Designer Collections
      </p>

      <div className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[550px] select-none">
        {ceremonies.map((ceremony, i) => {
          const position = getPosition(i);
          const isCenter = position === "center";

          return (
            <motion.div
              key={ceremony.name}
              className={`${cardStyle} cursor-pointer absolute top-0 bottom-0 m-auto rounded-3xl shadow-lg overflow-hidden`}
              style={{
                width: isCenter ? "60%" : "35%",
                height: isCenter ? "100%" : "85%",
                left: "50%",
                translateX: "-50%",
                touchAction: "pan-y",
                zIndex: positions[position].zIndex,
              }}
              initial={{ opacity: 0, scale: 0.7, x: positions[position].x }}
              animate={{ x: positions[position].x, scale: positions[position].scale, opacity: positions[position].opacity }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              onClick={() => setSelected(i)}
            >
              <img
                src={ceremony.img}
                alt={ceremony.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 ${ceremony.overlay} rounded-3xl`} />
              <div className="absolute bottom-6 left-6 right-6 text-center z-10">
                <h2
                  className={`${ceremony.labelClass} ${
                    isCenter ? "text-4xl md:text-5xl font-extrabold" : "text-2xl font-semibold"
                  }`}
                >
                  {ceremony.name}
                </h2>
                {isCenter && ceremony.primary && (
                  <Link
                    to={ceremony.url}
                    className={`${buttonStyle} mt-4 inline-block px-10 py-3 rounded-full shadow-lg hover:bg-pink-100`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ceremony.button}
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
