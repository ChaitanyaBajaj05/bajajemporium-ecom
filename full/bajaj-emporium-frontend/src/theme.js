// 🌸 Pastel Theme Configuration for Bajaj Emporium

// 🌿 Layout & Containers
export const baseBackground = "bg-gradient-to-b from-[#ffffff] to-[#f9f9f9]";
export const sectionPadding = "py-16 px-4 sm:px-6 lg:px-8";
export const containerStyle = "max-w-7xl mx-auto";

// 📝 Typography
export const headingStyle = "text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-4";
export const subHeadingStyle = "text-lg text-gray-500 mb-6";
export const paragraphStyle = "text-base text-gray-700 leading-relaxed";
export const smallText = "text-sm text-gray-500";

// 🔠 Section Titles with Underline
export const sectionTitleWithUnderline = `
  text-2xl md:text-3xl font-bold text-gray-800 relative mb-8
  after:content-[''] after:absolute after:w-16 after:h-1 after:bg-pink-500 after:left-0 after:-bottom-2
`;

// 🖼️ Banner
export const bannerImage = "/assets/banner.jpg"; // change if needed
export const bannerContainer = "relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center rounded-xl overflow-hidden shadow-lg";
export const bannerTextOverlay = "absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center text-white p-6";
export const bannerCaptionDark = "absolute bottom-4 left-6 bg-black/60 text-white px-4 py-2 rounded-lg";
export const bannerCaptionWhite = "absolute bottom-4 left-6 bg-white/80 text-gray-800 px-4 py-2 rounded-lg";
export const bannerOverlay = "absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center p-6";

// 🦸 Hero Section
export const heroSection = "relative h-[90vh] overflow-hidden flex items-center justify-center bg-white";
export const heroImage = "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000";
export const heroOverlay = "absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent";
export const heroContentWrapper = "relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-10";
export const heroText = "text-gray-900 text-center lg:text-left max-w-xl animate-fadeInUp";
export const heroHeadline = "text-4xl lg:text-5xl font-bold leading-tight drop-shadow-sm";
export const heroSubtext = "mt-4 text-lg text-gray-600 leading-relaxed";
export const heroRightImage = "rounded-3xl shadow-2xl object-cover h-[500px] w-full transition-all duration-1000 hover:scale-105";
export const heroIndicatorsWrapper = "absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10";
export const heroIndicatorActive = "w-6 h-3 rounded-full bg-pink-500 transition-all duration-300";
export const heroIndicatorInactive = "w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer transition-all duration-300";
export const secondaryButton = "border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-pink-100 transition-all duration-300";
// theme.js
export const input = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300";
export const navbarLight = "bg-white text-gray-800 border-b border-gray-200";
export const navItem = "text-sm font-medium hover:text-primary transition px-3 py-2";
export const searchInput = "px-4 py-2 border border-gray-300 rounded-l-md w-full focus:outline-none";
export const searchButton = "bg-primary text-white px-4 py-2 rounded-r-md";
export const bottomNav = "bg-white border-t border-gray-200 flex justify-around items-center py-2";
export const bottomNavItem = "flex flex-col items-center text-xs text-gray-700 hover:text-primary";

// 🧱 Cards
export const cardStyle = "rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300";
export const glassCard = "bg-white/40 backdrop-blur-md border border-white/20 rounded-xl shadow-md";
export const productCardMinimal = "group cursor-pointer";
export const productImageWrapper = "relative w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg";
export const productBadge = "absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow";
export const productTitleMinimal = "text-sm font-medium text-gray-800 line-clamp-2 mb-1";
export const productPriceMinimal = "flex justify-center items-center gap-2 text-sm";

// 🎨 Buttons
export const buttonStyle = "inline-block px-6 py-2 rounded-md bg-gradient-to-r from-pink-500 to-red-400 text-white font-semibold hover:brightness-110 transition-transform transform hover:scale-105 duration-300";
export const outlineButton = "px-5 py-2 border-2 border-pink-500 text-pink-500 rounded-md font-medium hover:bg-pink-100 transition-all duration-300";

// 🔍 Inputs & Forms
export const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 bg-white text-gray-800 transition";
export const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

// 🏷️ Tags & Labels
export const tagStyle = "inline-block px-3 py-1 rounded-full text-sm font-semibold bg-pink-100 text-pink-800";

// 🏅 Badges (e.g. New, Sale)
export const badgeStyle = "absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full";

// 🛍️ Product Listing
export const productGrid = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
export const productCard = "bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300";
export const productImage = "w-full h-48 object-cover rounded-md mb-4";
export const productTitle = "text-lg font-semibold text-gray-800";
export const productDescription = "text-sm text-gray-600 mt-1 mb-2";
export const productPrice = "text-pink-600 font-medium";
export const starStyle = "text-yellow-400 text-sm";

// 🌀 Animation Classes
export const fadeIn = "animate-fade-in";
export const scaleUp = "transition-transform duration-300 transform hover:scale-105";

// 🧭 Navigation
export const navLink = "text-gray-700 hover:text-pink-500 font-medium px-3 py-2 transition-colors duration-200";
export const activeNavLink = "text-pink-600 font-semibold";

// 📐 Utilities
export const spacingY = "my-8";
export const spacingX = "mx-4";
export const centerFlex = "flex items-center justify-center";
// Example snippet from theme.js:

export const errorText = "text-red-600 font-semibold";
export const emptyText = "text-gray-500 text-lg";

// 🎨 Color Palette Reference (optional use in Tailwind config)
export const colors = {
  primary: "#ff4d6d",
  accent: "#ffe5ec",
  textDark: "#333333",
  textLight: "#999999",
  bgLight: "#ffffff",
  bgSoft: "#f9f9f9",
  highlight: "#fcd5ce", // pastel peach
  secondary: "#cdb4db", // soft purple
};
