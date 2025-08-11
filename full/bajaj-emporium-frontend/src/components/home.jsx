import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import TrendingCollection from "../components/trendingcollection";
import ShopByOccasion from "./ShopByOccasion";
import BestSellers from "../components/BestSellers";
import Brands from "./Brand";
import NewArrivals from "../components/NewArrivals";
import FeaturedCollections from "../components/FeaturedCollections";
import CustomerReviews from "./CustomerReviews";
import WeddingRitualsHero from "../components/WeddingRitualsHero";

// New imports for suggested sections
import FashionShowVideo from "../components/FashionShowVideo";
import {
  baseBackground,
  sectionPadding,
  buttonStyle,
  headingStyle,
  containerStyle,
  sectionTitleWithUnderline,
  bannerCaptionDark,
} from "../theme";

export default function Home() {
  return (
    <main className={`${baseBackground} text-gray-900 transition-colors duration-500`}>
      {/* Hero Banner */}
      <section className="relative h-[90vh] overflow-hidden">
        <Hero />
      </section>

      {/* Fashion Show Video Section (new) */}
      <FashionShowVideo />

      {/* Brands Section Below Hero */}
      <section className={`${baseBackground} ${sectionPadding}`}>
        <div className={containerStyle}>
          <h2 className={`${sectionTitleWithUnderline} mb-8`}>🏷️ Our Partner Brands</h2>
          <Brands />
        </div>
      </section>

      {/* Indian Wedding Rituals Hero Section */}
      <WeddingRitualsHero />

      {/* Trending Now */}
      <section className={`${baseBackground} ${sectionPadding}`}>
        <div className={containerStyle}>
          <h2 className={`${sectionTitleWithUnderline} mb-8`}>Trending Now</h2>
          <TrendingCollection />
        </div>
      </section>
      

      {/* Shop By Category */}
      <section className={`${baseBackground} ${sectionPadding}`}>
        <div className={containerStyle}>
          <h2 className={`${sectionTitleWithUnderline} mb-8`}>Shop by Category</h2>
          <ShopByOccasion />
        </div>
      </section>

  <NewArrivals />

      {/* Fabric Collection Banner */}
      <section className="my-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer hover:brightness-110 transition duration-300">
          <img
            src="https://files.cdn.printful.com/o/upload/blog-og-image-upload/04/04168855533df93acb9d06911537fc4c_l" // Replace if needed
            alt="Premium Fabric Collection"
            className="object-cover w-full h-[320px] sm:h-[360px] rounded-2xl"
            loading="lazy"
          />
          <div className={`${bannerCaptionDark} bg-gradient-to-t from-black/70 to-transparent rounded-2xl`}>
            <h3 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg px-6 py-4">
              Explore Our Premium Fabrics
            </h3>
            <p className="text-white text-lg max-w-md px-6 pb-6">
              Discover handpicked fabrics for all your ethnic and festive occasions.
            </p>
            <Link
              to="/fabrics"
              className={`${buttonStyle} px-10 py-3 rounded-full shadow-lg mx-6 mb-6 inline-block`}
            >
              Shop Fabrics
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Fabrics Button */}
      <div className="text-center my-16">
        <Link
          to="/fabrics"
          className={`${buttonStyle} px-12 py-4 rounded-full shadow-xl hover:brightness-105 transition duration-300`}
        >
          Explore All Fabrics
        </Link>
      </div>

      {/* Best Sellers */}
      <section className={`${baseBackground} ${sectionPadding}`}>
        <div className={containerStyle}>
          <h2 className={`${sectionTitleWithUnderline} mb-8`}>Featured Collections</h2>
          <FeaturedCollections />
        </div>
      </section>

      {/* Customer Reviews */}
      <section className={`${baseBackground} ${sectionPadding}`}>
        <div className={containerStyle}>
          <h2 className={`${sectionTitleWithUnderline} mb-8`}>What Customers Say</h2>
          <CustomerReviews />
        </div>
      </section>
    </main>
  );
}
