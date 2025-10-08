import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";

export default function CarBookingPage() {
  const { id } = useParams(); // URL থেকে id নিবো
  const [cars, setCars] = useState([]);
  const [mainCar, setMainCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("description");

  useEffect(() => {
    axios
      .get("/data/offers.json")
      .then((res) => {
        setCars(res.data);
        // URL এর id দিয়ে car খুঁজে বের করি
        const found = res.data.find((c) => c.id === parseInt(id));
        setMainCar(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setError("Failed to load car data.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!mainCar) return <div className="text-center py-10">Car not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            src={mainCar.image}
            alt={mainCar.title}
            className="rounded-xl shadow-md w-full"
          />
          <div className="flex gap-3 mt-3">
            {mainCar.gallery?.map((g, i) => (
              <img
                key={i}
                src={g}
                alt="thumbnail"
                className="w-20 h-20 rounded-md border cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">{mainCar.title}</h2>
          <p className="text-red-500 text-lg font-semibold mb-3">
            {mainCar.price}
          </p>
          <ul className="text-gray-700 mb-4 space-y-1">
            {mainCar.features?.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-16 border rounded-md text-center py-1"
            />
            <Link
              to={"/reservation"}
              className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700"
            >
              TO BOOK
            </Link>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-semibold">Categories:</span>{" "}
            {mainCar.category} <br />
            <span className="font-semibold">Tags:</span>{" "}
            {mainCar.tags?.join(", ")}
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
          <div className="py-5 text-gray-700">{mainCar.description}</div>
        ) : (
          <div className="py-5 text-gray-700">No additional information.</div>
        )}
      </div>
      {/* Similar Offers */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Similar Offers</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {cars.map((offer, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={offer.image || offer.img}
                alt={offer.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h4 className="font-medium mb-1">{offer.title}</h4>
                <p className="text-red-500 text-sm mb-3">{offer.price}</p>
                <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700">
                  {offer.btn || "TO BOOK"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
