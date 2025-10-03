import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaBars } from "react-icons/fa";

export default function NavBar() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="bg-white shadow-md">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
              <div className="text-xl font-bold text-black">
        <a href="/" className="hover:text-indigo-600 transition">
          <img className="h-16" src="/images/easy-ride.png" alt="logo-easy-ride" />
        </a>
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
              <a
                key={item.id}
                href={item.link}
                className="hover:text-indigo-600 transition"
              >
                {item.title}
              </a>
            ))}

          {/* Cart */}
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
              0
            </span>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-black text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
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
              <a
                key={item.id}
                href={item.link}
                className="block hover:text-indigo-600 transition"
              >
                {item.title}
              </a>
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
