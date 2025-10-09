import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

export default function AllOfferPage() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState(300000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 4;

  // ✅ Fetch data from local JSON
  useEffect(() => {
    axios
      .get("/data/offers.json")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPackages(res.data);
          setFilteredPackages(res.data);
        } else {
          throw new Error("Invalid data format received");
        }
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setError("Failed to load offers. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Helper function to get display price (use min_price for filtering and display)
  const getDisplayPrice = (pkg) => {
    return pkg.min_price || 0;
  };

  // ✅ Helper function to format price for display
  const getPriceDisplay = (pkg) => {
    if (pkg.min_price && pkg.max_price) {
      return `${formatPrice(pkg.min_price)} - ${formatPrice(pkg.max_price)}`;
    }
    return formatPrice(pkg.min_price || 0);
  };

  // ✅ Apply all filters and sorting
  useEffect(() => {
    let result = [...packages];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((pkg) =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((pkg) => pkg.category === selectedCategory);
    }

    // Apply price range filter - using min_price for comparison
    result = result.filter((pkg) => {
      const packagePrice = getDisplayPrice(pkg);
      return packagePrice <= priceRange;
    });

    // Apply sorting
    if (sortOption === "low-to-high") {
      result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sortOption === "high-to-low") {
      result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    }
    // Default: newest to oldest (assuming IDs are sequential)
    else {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredPackages(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [packages, searchTerm, selectedCategory, priceRange, sortOption]);

  // ✅ Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // ✅ Category filter
  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  // ✅ Price range filter
  const handleRangeChange = (e) => {
    setPriceRange(parseInt(e.target.value));
  };

  // ✅ Sort handler
  const handleSort = (option) => {
    setSortOption(option);
  };

  // ✅ Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPackages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ Format price with commas
  const formatPrice = (price) => {
    return parseInt(price).toLocaleString();
  };

  // ✅ Get package type display text
  const getPackageType = (pkg) => {
    return pkg.package || "Standard";
  };

  // ✅ Conditional rendering
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        Loading offers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
      {/* ✅ Sidebar */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        {/* 🔍 Search */}
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Offers..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* 💰 Filter by rate */}
        <div>
          <h3 className="font-semibold mb-2">Filter by rate</h3>
          <input
            type="range"
            min="10000"
            max="300000"
            step="10000"
            value={priceRange}
            onChange={handleRangeChange}
            className="w-full accent-red-600"
          />
          <p className="text-gray-500 mt-1">
            Up to: {formatPrice(priceRange)} C/A
          </p>
        </div>

        {/* 📦 Offers Category */}
        <div>
          <h3 className="font-semibold mb-2">All Our Offers</h3>
          <ul className="space-y-1 text-gray-700">
            <li
              onClick={() => handleCategory("all")}
              className={`hover:text-red-600 cursor-pointer ${
                selectedCategory === "all" ? "text-red-600 font-semibold" : ""
              }`}
            >
              All Offers
            </li>
            <li
              onClick={() => handleCategory("Package")}
              className={`hover:text-red-600 cursor-pointer ${
                selectedCategory === "Package"
                  ? "text-red-600 font-semibold"
                  : ""
              }`}
            >
              Special Offers
            </li>
            <li
              onClick={() => handleCategory("Car")}
              className={`hover:text-red-600 cursor-pointer ${
                selectedCategory === "Car" ? "text-red-600 font-semibold" : ""
              }`}
            >
              Cars
            </li>
          </ul>
        </div>

        {/* 🚗 Most Requested */}
        <div>
          <h3 className="font-semibold mb-2">Most Requested</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img
                src="/images/Toyota-Corolla.png"
                alt="Toyota Corolla"
                className="w-12 h-8 object-cover"
              />
              <p className="text-sm">
                Toyota Corolla <br />
                <span className="text-gray-500">20,000 C/A</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/images/Suzuki-Vitara.png"
                alt="Suzuki Vitara"
                className="w-12 h-8 object-cover"
              />
              <p className="text-sm">
                Suzuki Vitara <br />
                <span className="text-gray-500">7,500 C/A</span>
              </p>
            </div>
          </div>
        </div>

        {/* 🏷️ Tags */}
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["SEDAN", "CITY CAR", "21 HRS", "Driver", "SUV"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ✅ Main Content */}
      <main className="col-span-12 lg:col-span-9">
        {/* Sorting */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <p>
            Showing{" "}
            <span className="font-semibold">
              {Math.min(currentItems.length, itemsPerPage)}
            </span>{" "}
            results of{" "}
            <span className="font-semibold">{filteredPackages.length}</span>
          </p>
          <select
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Sort from newest to oldest</option>
            <option value="low-to-high">Sort by price low to high</option>
            <option value="high-to-low">Sort by price high to low</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {currentItems.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow border"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = "/images/placeholder.png";
                }}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                <p className="text-gray-600 mt-1">{getPriceDisplay(pkg)} C/A</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 capitalize">
                    {pkg.category}
                  </p>
                  <p className="text-sm text-gray-500">{getPackageType(pkg)}</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {pkg.description}
                </p>
                <Link
                  to={`/booking/${pkg.id}`}
                  state={{ package: pkg }}
                  className="bg-red-600 text-white w-full py-2 mt-3 rounded inline-block text-center hover:bg-red-700 transition-colors"
                >
                  {pkg.category === "Car"
                    ? "Choice of Vehicle"
                    : "View Details"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 border rounded ${
                  num === currentPage
                    ? "bg-red-600 text-white border-red-600"
                    : "hover:bg-gray-100 border-gray-300"
                } transition-colors`}
              >
                {num}
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No offers found matching your criteria.
            <br />
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange(300000);
                setSortOption("");
              }}
              className="mt-2 text-red-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
