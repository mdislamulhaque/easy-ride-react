import React, { useState } from "react";
import { Link } from "react-router";

export default function CarBookingPage() {
  const [tab, setTab] = useState("description");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div>
          <img
            src="/images/Easyflash-1.jpg" 
            alt="Greenride"
            className="rounded-xl shadow-md w-full"
          />
          <div className="flex gap-3 mt-3">
            <img
              src="/images/Easyflash-1.jpg"
              alt="Greenride thumbnail"
              className="w-20 h-20 rounded-md border cursor-pointer"
            />
            <img
              src="/images/Course-2h-1.jpg"
              alt="Greenride thumbnail"
              className="w-20 h-20 rounded-md border cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Greenride</h2>
          <p className="text-red-500 text-lg font-semibold mb-3">
            10,000 CFA - 95,000 CFA
          </p>

          <ul className="text-gray-700 mb-4 space-y-1">
            <li>• Electric Car</li>
            <li>• The first e-mobility solution in Cameroon.</li>
            <li>• On time</li>
            <li>• By the day</li>
            <li>• Airport</li>
          </ul>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-sm">Trimmings</label>
            <select className="border rounded-md px-3 py-2 w-full">
              <option>Choose an option</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-16 border rounded-md text-center py-1"
            />
            <Link to={"/reservation"} className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700">
              TO BOOK
            </Link>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-semibold">SKU:</span> N/D <br />
            <span className="font-semibold">Categories:</span> Offers, Special
            Offers, All our offers, Car <br />
            <span className="font-semibold">Label:</span> SEDAN, CITY CAR, 24
            Hours, SUV
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-gray-300">
        <div className="flex gap-6 border-b">
          <button
            onClick={() => setTab("description")}
            className={`pb-2 ${
              tab === "description"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab("additional")}
            className={`pb-2 ${
              tab === "additional"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
          >
            Additional information
          </button>
        </div>

        {tab === "description" ? (
          <div className="py-5 text-gray-700">
            The first e-mobility solution in Cameroon.
          </div>
        ) : (
          <div className="py-5 text-gray-700">No additional information.</div>
        )}
      </div>

      {/* Similar Offers */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Similar Offers</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Day Package",
              price: "70,000 CFA - 101,000 CFA",
              img: "/images/Course-2h-1.jpg",
              btn: "CHOICE OF VEHICLE",
            },
            {
              title: "Monthly Package",
              price: "200,000 CFA - 300,000 CFA",
              img: "/images/Easyschool-1.jpg",
              btn: "CHOICE OF VEHICLE",
            },
            {
              title: "SUZUKI DZIRE",
              price: "75,000 CFA",
              img: "/images/Easyride-recompense-votre-fidelite.jpg",
              btn: "TO BOOK",
            },
          ].map((offer, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={offer.img}
                alt={offer.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h4 className="font-medium mb-1">{offer.title}</h4>
                <p className="text-red-500 text-sm mb-3">{offer.price}</p>
                <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700">
                  {offer.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
