import React, { useState } from "react";
import { Link } from "react-router";

const packagesData = [
  {
    id: 1,
    title: "Greenride",
    price: "10,000 C/A – 50,000 C/A",
    image: "/public/images/Easyflash-1.jpg",
  },
  {
    id: 2,
    title: "2-hour package",
    price: "12,000 C/A – 20,000 C/A",
    image: "/public/images/Course-2h-1.jpg",
  },
  {
    id: 3,
    title: "Monthly Package",
    price: "2,00,000 C/A – 3,00,000 C/A",
    image: "/images/monthly.jpg",
  },
  {
    id: 4,
    title: "Out of town round trip",
    price: "20,000 C/A – 25,000 C/A",
    image: "/images/towntrip.jpg",
  },
];

export default function CarRentalPage() {
  const [packages] = useState(packagesData);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <aside className="col-span-3 space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Filter by rate */}
        <div>
          <h3 className="font-semibold mb-2">Filter by rate</h3>
          <input type="range" min="0" max="2000000" className="w-full" />
          <button className="bg-red-600 text-white mt-2 w-full py-2 rounded">
            Filter
          </button>
        </div>

        {/* Offers */}
        <div>
          <h3 className="font-semibold mb-2">All Our Offers</h3>
          <ul className="space-y-1 text-gray-700">
            <li>All offers</li>
            <li>Offers</li>
            <li>Special Offers</li>
            <li>Car</li>
          </ul>
        </div>

        {/* Most Requested */}
        <div>
          <h3 className="font-semibold mb-2">Most Requested</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img src="/images/toyota.jpg" alt="" className="w-12 h-8" />
              <p className="text-sm">
                Toyota Corolla <br /> <span>20,000 C/A</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img src="/images/suzuki.jpg" alt="" className="w-12 h-8" />
              <p className="text-sm">
                Suzuki Vitara <br /> <span>7,500 C/A</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["SEDAN", "CITY CAR", "21 HRS", "Deposit", "SUV"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border rounded text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="col-span-9">
        {/* Sorting */}
        <div className="flex justify-between items-center mb-6">
          <p>Showing 1–4 of 22 results</p>
          <select className="border px-3 py-2 rounded">
            <option>Sort from newest to oldest</option>
            <option>Sort by price low to high</option>
            <option>Sort by price high to low</option>
          </select>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="border rounded-xl overflow-hidden shadow"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                <p className="text-gray-600 mt-1">{pkg.price}</p>
                <Link
                  to={"/car-booking"}
                  className="bg-red-600 text-white w-full py-2 mt-3 rounded inline-block text-center hover:bg-red-700"
                >
                  Choice of Vehicle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 border rounded ${
                num === 1 ? "bg-red-600 text-white" : ""
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
