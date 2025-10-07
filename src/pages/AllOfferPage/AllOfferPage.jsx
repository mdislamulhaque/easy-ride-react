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

  // ✅ Search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(value)
    );
    setFilteredPackages(filtered);
  };

  // ✅ Category filter
  const handleCategory = (category) => {
    if (category === "all") {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter((pkg) => pkg.category === category);
      setFilteredPackages(filtered);
    }
  };

  // ✅ Price range filter
  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange(value);

    const filtered = packages.filter((pkg) => parseInt(pkg.price) <= value);
    setFilteredPackages(filtered);
  };

  // ✅ Sort filter
  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filteredPackages];

    if (option === "low-to-high") {
      sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (option === "high-to-low") {
      sorted.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }
    setFilteredPackages(sorted);
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

  if (!filteredPackages.length) {
    return (
      <div className="text-center py-10 text-gray-500">No offers found.</div>
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
            min="0"
            max="300000"
            value={priceRange}
            onChange={handleRangeChange}
            className="w-full accent-red-600"
          />
          <p className="text-gray-500 mt-1">Up to: {priceRange} C/A</p>
        </div>

        {/* 📦 Offers Category */}
        <div>
          <h3 className="font-semibold mb-2">All Our Offers</h3>
          <ul className="space-y-1 text-gray-700">
            <li
              onClick={() => handleCategory("all")}
              className="hover:text-red-600 cursor-pointer"
            >
              All Offers
            </li>
            <li
              onClick={() => handleCategory("package")}
              className="hover:text-red-600 cursor-pointer"
            >
              Special Offers
            </li>
            <li
              onClick={() => handleCategory("car")}
              className="hover:text-red-600 cursor-pointer"
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
                alt=""
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
                alt=""
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
            {["SEDAN", "CITY CAR", "21 HRS", "Deposit", "SUV"].map((tag) => (
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
            <span className="font-semibold">{filteredPackages.length}</span>{" "}
            results
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-40 object-cover"
                onError={(e) => (e.target.src = "/images/placeholder.png")}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                <p className="text-gray-600 mt-1">{pkg.price} C/A</p>
                <Link
                  to="/booking"
                  className="bg-red-600 text-white w-full py-2 mt-3 rounded inline-block text-center hover:bg-red-700 transition-colors"
                >
                  Choice of Vehicle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 border rounded ${
                num === 1 ? "bg-red-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
