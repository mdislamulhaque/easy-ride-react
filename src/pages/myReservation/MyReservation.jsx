import React, { useState, useEffect } from "react";
import { Link } from "react-router";

export default function MyReservation() {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("reservationCart") || "[]"
    );
    setCart(savedCart);
    updateHeaderCartCount(savedCart);
  }, []);

  // ✅ Update quantity and recalculate total price
  const handleQuantityChange = (id, timing, value) => {
    const newQuantity = Number(value);
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id && item.timing === timing
        ? {
            ...item,
            quantity: newQuantity,
            totalPrice: item.price * newQuantity, // Recalculate total price
          }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("reservationCart", JSON.stringify(updatedCart));
    updateHeaderCartCount(updatedCart);
  };

  // ✅ Remove item
  const handleRemove = (id, timing) => {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.timing === timing)
    );

    setCart(updatedCart);
    localStorage.setItem("reservationCart", JSON.stringify(updatedCart));
    updateHeaderCartCount(updatedCart);
  };

  // ✅ Clear all reservations
  const handleClearAll = () => {
    setCart([]);
    localStorage.setItem("reservationCart", "[]");
    updateHeaderCartCount([]);
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

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-[#0d1a2d] py-10 text-center text-white">
          <h1 className="text-3xl font-bold">My reservations</h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No reservations yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't made any reservations. Browse our offers and book your
              car!
            </p>
            <Link
              to="/all-offers"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded inline-block"
            >
              Browse Offers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-[#0d1a2d] py-10 text-center text-white">
        <h1 className="text-3xl font-bold">My reservations</h1>
        <p className="text-gray-300 mt-2">
          Total Items: {totalItemsCount} | Total Amount:{" "}
          {subtotal.toLocaleString()} CFA
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Clear All Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            Total Items in Cart:{" "}
            <span className="text-red-600">{totalItemsCount}</span>
          </div>
          <button
            onClick={handleClearAll}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Clear All Reservations
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-600 text-white text-sm md:text-base">
                <th className="p-3"></th>
                <th className="p-3">OFFER</th>
                <th className="p-3">UNIT PRICE</th>
                <th className="p-3">QUANTITY</th>
                <th className="p-3">TOTAL PRICE</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cart.map((item) => (
                <tr
                  key={`${item.id}-${item.timing}`}
                  className="border-t border-gray-200"
                >
                  <td
                    className="p-3 text-center text-red-500 cursor-pointer font-bold text-xl"
                    onClick={() => handleRemove(item.id, item.timing)}
                  >
                    ×
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.timing && (
                        <p className="text-sm text-gray-500">
                          Timing: {item.timing}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">
                    {item.price.toLocaleString()} CFA
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          item.timing,
                          e.target.value
                        )
                      }
                      className="w-16 border border-gray-300 rounded text-center py-1"
                    />
                  </td>
                  <td className="p-3 text-gray-700 font-semibold">
                    {item.totalPrice.toLocaleString()} CFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart total */}
        <div className="mt-10 flex flex-col md:flex-row md:justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white shadow-sm p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Reservation Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Items:</span>
                <span>{totalItemsCount}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Subtotal</span>
                <span className="text-red-600 font-semibold">
                  {subtotal.toLocaleString()} CFA
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="text-red-600 font-semibold text-lg">
                  {subtotal.toLocaleString()} CFA
                </span>
              </div>
            </div>
            <Link
              to={"/checkout"}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mt-4 rounded inline-block text-center"
            >
              VALIDATE THE ORDER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
