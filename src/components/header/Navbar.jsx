import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { Link } from "react-router";
import LanguageToggle from "../../hook/LanguageToogle";
import LanguageToggle2 from "../../hook/LanguageToogle2";

export default function NavBar() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
      // ✅ Load initial cart count from localStorage
      const savedCart = JSON.parse(
        localStorage.getItem("reservationCart") || "[]"
      );
      const initialCount = savedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(initialCount);

      // ✅ Listen for cart updates from other components
      const handleCartUpdate = (event) => {
        setCartCount(event.detail.count);
      };

      window.addEventListener("cartUpdate", handleCartUpdate);

      return () => {
        window.removeEventListener("cartUpdate", handleCartUpdate);
      };
    }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/data/menu.json"); // fetch from public folder
        setMenuItems(res.data || []);
      } catch (err) {
        setError(`Failed to load menu, ${err}`);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <nav className="bg-white">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="text-xl font-bold text-black">
          <Link to={"/"} className="hover:text-indigo-600 transition">
            <img
              className="h-18 w-28 object-contain"
              src="/images/easy-ride.png"
              alt="logo-easy-ride"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-black font-medium">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && menuItems.length === 0 && (
            <p className="text-gray-400">No menu</p>
          )}
          {!loading &&
            !error &&
            menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="hover:text-indigo-600 transition"
              >
                {item.title}
              </Link>
            ))}

          {/* Cart */}
          <LanguageToggle />
          {/* <LanguageToggle2 /> */}
          {/* <div className="relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
              0
            </span>
          </div> */}
          {/* Cart Icon with Counter */}
          <Link to="/reservation" className="relative">
            <svg
              className="w-6 h-6 text-gray-700 hover:text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageToggle />
          {/* <LanguageToggle2 /> */}
          <button
            className=" text-black text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t text-black px-4 py-3 space-y-3">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && menuItems.length === 0 && (
            <p className="text-gray-400">No menu</p>
          )}
          {!loading &&
            !error &&
            menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="block hover:text-indigo-600 transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                {item.title}
              </Link>
            ))}

          {/* Cart */}

          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-xl" />
            <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2">
              0
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
