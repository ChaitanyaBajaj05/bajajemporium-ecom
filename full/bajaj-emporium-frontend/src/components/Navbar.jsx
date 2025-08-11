import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Home,
  ChevronDown,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  containerStyle,
  navLink,
  inputStyle,
} from "../theme";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeDropdown, setActiveDropdown] = useState(null); // Desktop dropdown
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [sidebarActiveDropdown, setSidebarActiveDropdown] = useState(null); // Mobile sidebar dropdowns

  const { cart } = useCart();
  const location = useLocation();

  const profileDropdownRef = useRef(null);
  const desktopProfileBtnRef = useRef(null);
  const sidebarRef = useRef(null);

  // Update "isMobile" on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setIsProfileDropdownOpen(false);
    setIsSidebarOpen(false);
    setSidebarActiveDropdown(null);
  }, [location.pathname]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handler = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !desktopProfileBtnRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        !event.target.closest(".nav-item-dropdown") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown || isProfileDropdownOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown, isProfileDropdownOpen]);

  // Close sidebar if clicked outside on mobile
  useEffect(() => {
    const handler = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("#mobile-home-button")
      ) {
        setIsSidebarOpen(false);
        setSidebarActiveDropdown(null);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [isSidebarOpen]);

  // Desktop dropdown toggle
  const toggleDropdown = (section) => {
    if (section === "profile") {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
      setActiveDropdown(null);
    } else {
      setActiveDropdown(activeDropdown === section ? null : section);
      setIsProfileDropdownOpen(false);
    }
  };

  // Mobile sidebar dropdown toggle
  const toggleSidebarDropdown = (section) => {
    setSidebarActiveDropdown((cur) => (cur === section ? null : section));
  };

  const profileMenuItems = [
    { label: "My Account", to: "/profilepage" },
    { label: "Orders", to: "/orders" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Logout", to: "/logout" },
  ];

  const iconButtonClass =
    "p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-400";

  return (
    <>
      {/* Offer Bar */}
      <div className="w-full bg-gradient-to-r from-[#ffe5ec] via-[#fcd5ce] to-[#cdb4db] py-2 text-center text-pink-700 text-sm font-medium tracking-wide shadow-sm z-50 select-none">
        <span className="bg-pink-200 px-2 rounded-full mr-2">Offer</span>
        Get 20% off on your first order!
      </div>

      {/* Desktop Navbar */}
      {!isMobile && (
        <header className="sticky top-0 z-40 shadow-sm bg-gradient-to-b from-white via-[#ffe5ec] to-[#f9f9f9]">
          <nav
            className={`flex items-center justify-between ${containerStyle} py-4`}
            aria-label="Primary Navigation"
          >
            {/* Logo */}
            <Link
              to="/"
              className="font-serif text-3xl font-extrabold text-pink-700 tracking-widest flex flex-col leading-tight hover:scale-105 transition-transform"
              style={{ letterSpacing: "3px" }}
              aria-label="Bajaj Emporium homepage"
            >
              <span>BAJAJ</span>
              <span className="text-xs font-semibold tracking-widest text-pink-500">
                EMPORIUM
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex gap-10 items-center" role="menubar">
              <Link to="/new-arrivals" className={navLink} role="menuitem" tabIndex={0}>
                New Arrivals
              </Link>
              <Link to="/products/handloom" className={navLink} role="menuitem" tabIndex={0}>
                Handloom
              </Link>
              <Link
                to="/products/sale"
                className="bg-pink-100 text-pink-600 font-semibold rounded-full px-4 py-1 hover:bg-pink-200 transition"
                role="menuitem"
                tabIndex={0}
              >
                Sale
              </Link>
              <Link to="/customer-support" className={navLink} role="menuitem" tabIndex={0}>
                Support
              </Link>

              {/* Dropdown Women */}
              <div className="relative nav-item-dropdown">
                <button
                  className={`${navLink} flex items-center gap-1`}
                  onClick={() => toggleDropdown("women")}
                  aria-expanded={activeDropdown === "women"}
                  aria-haspopup="true"
                  aria-controls="women-dropdown"
                  role="menuitem"
                  type="button"
                >
                  Women
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      activeDropdown === "women"
                        ? "rotate-180 text-pink-400"
                        : "rotate-0 text-pink-600"
                    }`}
                  />
                </button>
                <div
                  id="women-dropdown"
                  className={`dropdown-menu absolute left-0 top-full mt-2 w-44 bg-white border border-pink-100 rounded-xl shadow-xl py-2 z-40 transition-all duration-200
                    ${activeDropdown === "women" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                  role="menu"
                  aria-label="Women submenu"
                >
                  {["Suits", "Lehengas", "Sarees"].map((item) => (
                    <Link
                      key={item}
                      to={`/products/women/${item.toLowerCase()}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md transition"
                      role="menuitem"
                      tabIndex={activeDropdown === "women" ? 0 : -1}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dropdown Men */}
              <div className="relative nav-item-dropdown">
                <button
                  className={`${navLink} flex items-center gap-1`}
                  onClick={() => toggleDropdown("men")}
                  aria-expanded={activeDropdown === "men"}
                  aria-haspopup="true"
                  aria-controls="men-dropdown"
                  role="menuitem"
                  type="button"
                >
                  Men
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      activeDropdown === "men"
                        ? "rotate-180 text-pink-400"
                        : "rotate-0 text-pink-600"
                    }`}
                  />
                </button>
                <div
                  id="men-dropdown"
                  className={`dropdown-menu absolute left-0 top-full mt-2 w-44 bg-white border border-pink-100 rounded-xl shadow-xl py-2 z-40 transition-all duration-200
                    ${activeDropdown === "men" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                  role="menu"
                  aria-label="Men submenu"
                >
                  {["Kurtas", "Sherwanis", "Ethnic Jackets"].map((item) => (
                    <Link
                      key={item}
                      to={`/products/men/${item.toLowerCase().replace(" ", "-")}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md transition"
                      role="menuitem"
                      tabIndex={activeDropdown === "men" ? 0 : -1}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Icons: Search, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-4 ml-4">
              <button
                className={iconButtonClass}
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Open search"
                type="button"
              >
                <Search size={20} />
              </button>

              <Link to="/wishlist" className={iconButtonClass} aria-label="Wishlist">
                <Heart size={20} />
              </Link>

              <Link
                to="/cart"
                className="relative p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cart?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full px-1.5">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative" ref={desktopProfileBtnRef}>
                <button
                  onClick={() => toggleDropdown("profile")}
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User profile menu"
                  className={`${iconButtonClass} focus:ring`}
                  type="button"
                  id="profile-menu-button"
                >
                  <User size={20} />
                </button>
                <div
                  ref={profileDropdownRef}
                  className={`absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 py-2 z-50 transition-all duration-200 origin-top-right
                   ${isProfileDropdownOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"}`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-menu-button"
                >
                  {profileMenuItems.map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md transition"
                      role="menuitem"
                      tabIndex={isProfileDropdownOpen ? 0 : -1}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </header>
      )}

      {/* Mobile Top Navbar: Only Logo and Search */}
      {isMobile && (
        <header className="sticky top-0 z-40 shadow-sm bg-gradient-to-b from-white via-[#ffe5ec] to-[#f9f9f9] px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-extrabold text-pink-700 tracking-widest leading-tight hover:scale-105 transition-transform"
            aria-label="Bajaj Emporium homepage"
            id="mobile-home-button"
            onClick={() => setIsSidebarOpen(true)} // Open sidebar when clicking logo or (better) Home icon 
          >
            <span>BAJAJ</span>
            <span className="block text-xs font-semibold tracking-widest text-pink-500 -mt-1">
              EMPORIUM
            </span>
          </Link>

          {/* Search icon */}
          <button
            className={iconButtonClass}
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Open search"
            type="button"
          >
            <Search size={20} />
          </button>
        </header>
      )}

      {/* Mobile Sidebar/Nav Drawer */}
      {isMobile && (
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-pink-100 to-white/95 border-r border-pink-100 shadow-2xl z-[99] transition-transform duration-400
          ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          aria-hidden={!isSidebarOpen}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="flex justify-between items-center px-6 py-3 border-b border-pink-100">
            <h3 className="font-semibold text-lg text-pink-700">Browse Categories</h3>
            <button
              className="p-2 rounded-full hover:bg-pink-50 transition"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              <X size={24} className="text-pink-600" />
            </button>
          </div>
          <nav
            className="flex flex-col px-4 py-3 gap-3"
            role="menu"
            aria-label="Mobile categories"
          >
            <Link
              to="/new-arrivals"
              className="px-3 py-2 rounded-lg text-pink-600 font-semibold hover:bg-pink-50 transition"
              onClick={() => setIsSidebarOpen(false)}
              role="menuitem"
              tabIndex={0}
            >
              New Arrivals
            </Link>
            <Link
              to="/products/handloom"
              className="px-3 py-2 rounded-lg text-pink-600 font-semibold hover:bg-pink-50 transition"
              onClick={() => setIsSidebarOpen(false)}
              role="menuitem"
              tabIndex={0}
            >
              Handloom
            </Link>
            <Link
              to="/products/sale"
              className="px-3 py-2 rounded-lg text-pink-600 font-semibold hover:bg-pink-50 transition"
              onClick={() => setIsSidebarOpen(false)}
              role="menuitem"
              tabIndex={0}
            >
              Sale
            </Link>

            {/* Mobile Category dropdown: Women */}
            <div>
              <button
                className="w-full flex justify-between items-center px-3 py-2 font-semibold rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100 transition"
                type="button"
                aria-expanded={sidebarActiveDropdown === "women"}
                aria-controls="mobile-women-submenu"
                onClick={() =>
                  setSidebarActiveDropdown(
                    sidebarActiveDropdown === "women" ? null : "women"
                  )
                }
              >
                Women
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    sidebarActiveDropdown === "women" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {sidebarActiveDropdown === "women" && (
                <div
                  id="mobile-women-submenu"
                  className="pl-6 mt-2 flex flex-col gap-2"
                  role="menu"
                  aria-label="Women mobile submenu"
                >
                  {["Suits", "Lehengas", "Sarees"].map((item) => (
                    <Link
                      key={item}
                      to={`/products/women/${item.toLowerCase()}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className="px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Category dropdown: Men */}
            <div>
              <button
                className="w-full flex justify-between items-center px-3 py-2 font-semibold rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100 transition"
                type="button"
                aria-expanded={sidebarActiveDropdown === "men"}
                aria-controls="mobile-men-submenu"
                onClick={() =>
                  setSidebarActiveDropdown(
                    sidebarActiveDropdown === "men" ? null : "men"
                  )
                }
              >
                Men
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    sidebarActiveDropdown === "men" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {sidebarActiveDropdown === "men" && (
                <div
                  id="mobile-men-submenu"
                  className="pl-6 mt-2 flex flex-col gap-2"
                  role="menu"
                  aria-label="Men mobile submenu"
                >
                  {["Kurtas", "Sherwanis", "Ethnic Jackets"].map((item) => (
                    <Link
                      key={item}
                      to={`/products/men/${item.toLowerCase().replace(" ", "-")}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className="px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[90] flex items-start justify-center pt-24 px-4">
          <div
            className={`relative w-full max-w-xl bg-white rounded-xl shadow-2xl flex items-center p-4 border border-pink-100`}
          >
            <input
              type="text"
              autoFocus
              placeholder="Search for products..."
              className={`flex-grow bg-[#f9f9f9] border-2 border-pink-100 rounded-l-md px-4 py-3 text-base focus:ring focus:ring-pink-200 outline-none ${inputStyle}`}
              aria-label="Search"
            />
            <button
              className="ml-2 text-pink-400 hover:text-pink-700"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
              type="button"
            >
              <X size={26} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 w-full bg-white/95 border-t border-pink-100 shadow-lg flex justify-around items-center py-2 z-50 rounded-t-2xl"
          role="navigation"
          aria-label="Mobile navigation bar"
        >
          <button
            id="mobile-home-button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            aria-label="Open menu"
            type="button"
          >
            <Home size={26} />
            <span className="text-[11px] mt-1 font-semibold">Menu</span>
          </button>
          <button
            className="flex flex-col items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Open search"
            type="button"
          >
            <Search size={26} />
            <span className="text-[11px] mt-1 font-semibold">Search</span>
          </button>
          <Link
            to="/wishlist"
            className="flex flex-col items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            aria-label="Wishlist"
          >
            <Heart size={26} />
            <span className="text-[11px] mt-1 font-semibold">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            aria-label="Cart"
          >
            <ShoppingBag size={26} />
            {cart?.length > 0 && (
              <span className="absolute top-0 right-1 bg-pink-500 text-white text-xs rounded-full px-1.5 font-bold">
                {cart.length}
              </span>
            )}
            <span className="text-[11px] mt-1 font-semibold">Cart</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              aria-label="Profile menu"
              aria-expanded={isProfileDropdownOpen}
              className="flex flex-col items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
              type="button"
            >
              <User size={26} />
              <span className="text-[11px] mt-1 font-semibold">Profile</span>
            </button>
            <div
              className={`absolute bottom-full mb-2 right-0 w-44 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 py-2 z-50 transition-transform origin-bottom-right
               ${
                 isProfileDropdownOpen
                   ? "opacity-100 visible scale-100"
                   : "opacity-0 invisible scale-95"
               }`}
              role="menu"
              aria-orientation="vertical"
              tabIndex={-1}
            >
              {profileMenuItems.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md transition"
                  role="menuitem"
                  tabIndex={isProfileDropdownOpen ? 0 : -1}
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

const profileMenuItems = [
  { label: "My Account", to: "/profilepage" },
  { label: "Orders", to: "/orders" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Logout", to: "/logout" },
];
