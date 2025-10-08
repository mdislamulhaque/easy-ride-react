import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";

export default function CarBookingPage() {
  const { id } = useParams();
  const [cars, setCars] = useState([]);
  const [mainCar, setMainCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("description");
  const [selectedTiming, setSelectedTiming] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [book, setBook] = useState(false);

  useEffect(() => {
    axios
      .get("/data/offers.json")
      .then((res) => {
        setCars(res.data);
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

  // ✅ Find selected timing price
  const selectedTimingObj = mainCar?.timings?.find(
    (t) => t.label === selectedTiming
  );
  const basePrice = selectedTimingObj?.price || mainCar?.price || 0;

  // ✅ Update totalPrice whenever quantity or timing changes
  useEffect(() => {
    if (selectedTiming && basePrice > 0) {
      setTotalPrice(basePrice * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [quantity, selectedTiming, basePrice]);

  // ✅ Update quantity only (without saving to localStorage)
  const updateQuantity = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // ✅ Update header cart count
  const updateHeaderCartCount = (cart) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    window.dispatchEvent(
      new CustomEvent("cartUpdate", {
        detail: { count: totalItems },
      })
    );
  };

  // ✅ Add to Reservation Function (Only this will save to localStorage)
  const handleAddToReservation = () => {
    if (!selectedTiming) {
      alert("Please select a timing first!");
      return;
    }

    // Create reservation item
    const reservationItem = {
      id: mainCar.id,
      name: mainCar.title,
      timing: selectedTiming,
      img: mainCar.image,
      price: basePrice,
      quantity: quantity,
      totalPrice: totalPrice,
      category: mainCar.category,
      features: mainCar.features,
    };

    // Save to localStorage
    const existingCart = JSON.parse(
      localStorage.getItem("reservationCart") || "[]"
    );

    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === reservationItem.id && item.timing === reservationItem.timing
    );

    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex] = reservationItem;
    } else {
      updatedCart = [...existingCart, reservationItem];
    }

    localStorage.setItem("reservationCart", JSON.stringify(updatedCart));
    updateHeaderCartCount(updatedCart);

    setBook(true);
    alert("Added to your reservation cart!");
  };

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

          {/* Base Price */}
          <p className="text-gray-600 text-lg mb-1">
            Base Price:{" "}
            <span className="font-semibold">
              {basePrice.toLocaleString()} CFA
            </span>
          </p>

          <ul className="text-gray-700 mb-4 space-y-1">
            {mainCar.features?.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>

          {/* Timing Selector */}
          <div className="flex items-center gap-6 mb-4">
            <label className="font-semibold text-gray-700">Timing</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedTiming}
                onChange={(e) => {
                  const newTiming = e.target.value;
                  setSelectedTiming(newTiming);
                  setBook(false);
                  // Reset quantity to 1 when timing changes
                  setQuantity(1);
                }}
                className="border rounded-md px-3 py-1"
              >
                <option value="">Select timing...</option>
                {mainCar.timings?.map((time, i) => (
                  <option key={i} value={time.label}>
                    {time.label} - {time.price.toLocaleString()} CFA
                  </option>
                ))}
              </select>

              {selectedTiming && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTiming("");
                    setBook(false);
                    setQuantity(1);
                  }}
                  className="text-gray-500 text-sm hover:text-red-500 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quantity with Plus/Minus */}
          <div className="flex items-center flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    updateQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center py-1 outline-none"
                />
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToReservation}
              className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
            >
              TO BOOK
            </button>
            {book && (
              <Link
                to={"/reservation"}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
              >
                Go To Reservation
              </Link>
            )}
            {book && (
              <Link
                to={"/all-offers"}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
              >
                Select More Offer
              </Link>
            )}
          </div>

          {/* Dynamic Price Calculation */}
          {selectedTiming && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Price Calculation:
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>{basePrice.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-semibold text-lg text-red-600">
                  <span>Total Price:</span>
                  <span>{basePrice * quantity} CFA</span>
                </div>
              </div>
            </div>
          )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.slice(0, 3).map((offer, i) => (
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
                <Link
                  to={`/booking/${offer.id}`}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700"
                >
                  {offer.btn || "TO BOOK"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
