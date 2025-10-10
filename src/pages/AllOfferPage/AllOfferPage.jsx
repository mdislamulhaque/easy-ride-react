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
  const [selectedTags, setSelectedTags] = useState([]);
  const itemsPerPage = 4;

  // ✅ Fetch data
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

  const getDisplayPrice = (pkg) => pkg.min_price || 0;

  const formatPrice = (price) => parseInt(price).toLocaleString();

  const getPriceDisplay = (pkg) => {
    if (pkg.min_price && pkg.max_price) {
      return `${formatPrice(pkg.min_price)} - ${formatPrice(pkg.max_price)}`;
    }
    return formatPrice(pkg.min_price || 0);
  };

  const getAllTags = () => {
    const allTags = packages.flatMap((pkg) => pkg.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.slice(0);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✅ Apply filters and sorting
  useEffect(() => {
    let result = [...packages];

    // 🔍 Search
    if (searchTerm) {
      result = result.filter((pkg) =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 📦 Category
    if (selectedCategory !== "all") {
      result = result.filter((pkg) => pkg.category === selectedCategory);
    }

    // 💰 Price filter (apply only if user moves slider)
    if (priceRange < 300000) {
      result = result.filter((pkg) => {
        const packagePrice = getDisplayPrice(pkg);
        return packagePrice <= priceRange;
      });
    }

    // 🏷️ Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((pkg) => {
        const packageTags = pkg.tags || [];
        return selectedTags.some((tag) => packageTags.includes(tag));
      });
    }

    // ↕️ Sorting
    if (sortOption === "low-to-high") {
      result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sortOption === "high-to-low") {
      result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredPackages(result);
    setCurrentPage(1);
  }, [
    packages,
    searchTerm,
    selectedCategory,
    priceRange,
    sortOption,
    selectedTags,
  ]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategory = (category) => setSelectedCategory(category);
  const handleRangeChange = (e) => setPriceRange(parseInt(e.target.value));
  const handleSort = (option) => setSortOption(option);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPackages.length);
  const currentItems = filteredPackages.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);

  const getPackageType = (pkg) => pkg.package || "Standard";

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange(300000);
    setSortOption("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

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
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Offers..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Price Filter */}
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

        {/* Categories */}
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

        {/* Tags */}
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {getAllTags().map((tag) => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 border rounded text-sm cursor-pointer transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-red-600 text-white border-red-600"
                    : "text-gray-600 hover:bg-red-600 hover:text-white border-gray-300"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Clear tags
            </button>
          )}
        </div>

        {/* Most Requested */}
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
      </aside>

      {/* Main Content */}
      <main className="col-span-12 lg:col-span-9">
        {/* Active filters */}
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedTags.length > 0 ||
          priceRange < 300000) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded"
                >
                  Tag: {tag}
                  <button
                    onClick={() => handleTagClick(tag)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              {priceRange < 300000 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                  Max price: {formatPrice(priceRange)} C/A
                  <button
                    onClick={() => setPriceRange(300000)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="ml-2 text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Sorting */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <p>
            Showing <span className="font-semibold">{currentItems.length}</span>{" "}
            results of{" "}
            <span className="font-semibold">{filteredPackages.length}</span>
            {filteredPackages.length === packages.length &&
              ` (Total: ${packages.length})`}
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
              className="flex flex-col rounded-xl overflow-hidden shadow hover:shadow-sm transition-shadow hover:shadow-red-700 cursor-pointer h-full"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-64 object-cover"
                onError={(e) => (e.target.src = "/images/placeholder.png")}
              />

              {/* Make the inner content stretch evenly */}
              <div className="flex flex-col flex-grow p-4">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                <p className="text-gray-600 mt-1">{getPriceDisplay(pkg)} C/A</p>

                <div className="flex gap-6 items-center mt-1">
                  <p className="text-sm text-gray-500 capitalize">
                    {pkg.category}
                  </p>
                  <p className="text-sm text-gray-500">{getPackageType(pkg)}</p>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {pkg.description}
                </p>

                {pkg.tags && pkg.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pkg.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* This pushes the button to the bottom */}
                <div className="flex-grow"></div>

                <Link
                  to={`/booking/${pkg.id}`}
                  state={{ package: pkg }}
                  className="bg-red-600 text-white w-full py-2 mt-3 rounded text-center hover:bg-red-700 transition-colors"
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
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 border-gray-300"
              } transition-colors`}
            >
              ←
            </button>

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

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 border-gray-300"
              } transition-colors`}
            >
              →
            </button>
          </div>
        )}

        {/* No results */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No offers found matching your criteria.
            <br />
            <button
              onClick={resetAllFilters}
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
