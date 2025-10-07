import React, { useState } from "react";
import { Link } from "react-router";

export default function MyReservation() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Greenride – Half Day",
      timing: "Half Day",
      img: "/images/greenride-car.png",
      price: 95000,
      quantity: 8,
    },
    {
      id: 2,
      name: "SUZUKI VITARA",
      timing: "",
      img: "/images/suzuki-vitara.jpg",
      price: 7500,
      quantity: 1,
    },
    {
      id: 3,
      name: "Greenride – On time",
      timing: "On time",
      img: "/images/greenride-car.png",
      price: 10000,
      quantity: 1,
    },
  ]);

  // Update quantity
  const handleQuantityChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  // Remove item
  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-[#0d1a2d] py-10 text-center text-white">
        <h1 className="text-3xl font-bold">My reservations</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-600 text-white text-sm md:text-base">
                <th className="p-3"></th>
                <th className="p-3">OFFER</th>
                <th className="p-3">PRICE</th>
                <th className="p-3">QUANTITY</th>
                <th className="p-3">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cart.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td
                    className="p-3 text-center text-red-500 cursor-pointer font-bold"
                    onClick={() => handleRemove(item.id)}
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
                          Timmming: {item.timing}
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
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-16 border border-gray-300 rounded text-center py-1"
                    />
                  </td>
                  <td className="p-3 text-gray-700">
                    {(item.price * item.quantity).toLocaleString()} CFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart total */}
        <div className="mt-10 flex flex-col md:flex-row md:justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white shadow-sm p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Cart total</h2>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Subtotal</span>
              <span className="text-red-600 font-semibold">
                {subtotal.toLocaleString()} CFA
              </span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Total</span>
              <span className="text-red-600 font-semibold">
                {subtotal.toLocaleString()} CFA
              </span>
            </div>
            <Link
              to={"/checkout"}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mt-6 rounded inline-block text-center"
            >
              VALIDATE THE ORDER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
