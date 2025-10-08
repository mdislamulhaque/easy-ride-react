import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "Cameroon",
    pickup: "",
    arrival: "",
    phone: "",
    email: "",
    notes: "",
    createAccount: false,
  });

  const [payment, setPayment] = useState("mobile");
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load reservation data from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("reservationCart") || "[]"
    );

    if (savedCart.length === 0) {
      // ✅ If no reservations, redirect to reservation page
      alert(
        "No reservations found! Please add items to your reservation first."
      );
      navigate("/reservation");
      return;
    }

    // ✅ Transform cart data to order items format
    const transformedItems = savedCart.map((item) => ({
      id: item.id,
      name: `${item.name} × ${item.quantity}`,
      timing: item.timing ? `Timing: ${item.timing}` : "",
      price: item.totalPrice || item.price * item.quantity,
      quantity: item.quantity,
      unitPrice: item.price,
      image: item.img,
      category: item.category,
    }));

    setOrderItems(transformedItems);
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      alert("Please fill in all required fields!");
      return;
    }

    // Create order object
    const orderData = {
      customerInfo: form,
      paymentMethod: payment,
      orderItems: orderItems,
      totalAmount: subtotal,
      orderDate: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`,
    };

    // Save order to localStorage (or send to backend)
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, orderData])
    );

    // Clear reservation cart after successful order
    localStorage.removeItem("reservationCart");

    // Show success message and redirect
    alert("Order placed successfully! Thank you for your reservation.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm text-center">
          <div className="text-lg">Loading your reservation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm">
        {/* Order Summary Header */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Complete Your Reservation
          </h1>
          <p className="text-gray-600">
            You have{" "}
            <span className="font-semibold text-red-600">{totalItems}</span>{" "}
            item(s) in your reservation
          </p>
        </div>

        {/* Login Notice */}
        <div className="mb-6 text-sm text-gray-700 border border-red-100 bg-red-50 p-3 rounded">
          <input type="checkbox" id="login" className="mr-2" />
          <label htmlFor="login">
            Already a customer? Click here to log in
          </label>
        </div>

        {/* Billing + Additional Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Billing Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name (optional)
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country/region
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>Cameroon</option>
                  <option>Nigeria</option>
                  <option>Ghana</option>
                  <option>Ivory Coast</option>
                  <option>Senegal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pick-up location <span className="text-red-500">*</span>
                </label>
                <input
                  name="pickup"
                  value={form.pickup}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  placeholder="Enter pick-up address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Place of arrival <span className="text-red-500">*</span>
                </label>
                <input
                  name="arrival"
                  value={form.arrival}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  placeholder="Enter destination address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="tel"
                  placeholder="e.g., +237 6XX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={form.createAccount}
                  onChange={handleChange}
                  className="rounded focus:ring-red-500"
                />
                <label className="text-sm">
                  Create an account for faster booking next time?
                </label>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Additional information
            </h2>
            <label className="block text-sm font-medium mb-1">
              Order Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="8"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Comments regarding your order, e.g. special delivery instructions, preferred contact time, etc."
            ></textarea>
          </div>
        </div>

        {/* Order Table */}
        <h3 className="text-lg font-semibold mb-3">Your Order Summary</h3>
        <div className="overflow-x-auto mb-10 border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold">Offer Details</th>
                <th className="text-right p-4 font-semibold">Quantity</th>
                <th className="text-right p-4 font-semibold">Unit Price</th>
                <th className="text-right p-4 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">
                          {item.name.split(" × ")[0]}
                        </p>
                        {item.timing && (
                          <p className="text-gray-500 text-xs">{item.timing}</p>
                        )}
                        <p className="text-gray-500 text-xs">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">{item.quantity}</td>
                  <td className="p-4 text-right text-gray-600">
                    {item.unitPrice.toLocaleString()} CFA
                  </td>
                  <td className="p-4 text-right text-red-600 font-semibold">
                    {item.price.toLocaleString()} CFA
                  </td>
                </tr>
              ))}

              {/* Summary Row */}
              <tr className="bg-gray-50">
                <td colSpan="3" className="p-4 text-right font-semibold">
                  Total ({totalItems} items):
                </td>
                <td className="p-4 text-right text-red-600 font-bold text-lg">
                  {subtotal.toLocaleString()} CFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Section */}
        <div className="border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="bg-gray-100 p-4 font-semibold text-lg flex items-center justify-between">
            <span>💳 Payment Method</span>
            <span className="text-sm font-normal text-gray-600">
              Choose how you want to pay
            </span>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer">
              <input
                type="radio"
                value="mobile"
                checked={payment === "mobile"}
                onChange={(e) => setPayment(e.target.value)}
                className="text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="font-medium">Pay by Mobile Money</span>
                <p className="text-sm text-gray-600">
                  Orange Money or MTN Money
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer">
              <input
                type="radio"
                value="check"
                checked={payment === "check"}
                onChange={(e) => setPayment(e.target.value)}
                className="text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="font-medium">Check payments</span>
                <p className="text-sm text-gray-600">Bank transfer or check</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer">
              <input
                type="radio"
                value="agency"
                checked={payment === "agency"}
                onChange={(e) => setPayment(e.target.value)}
                className="text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="font-medium">Payment in Agency</span>
                <p className="text-sm text-gray-600">
                  Pay when you pick up the vehicle
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="space-y-4 text-sm mb-6 p-4 bg-gray-50 rounded-md">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 rounded focus:ring-red-500"
            />
            <span>
              I would like to receive exclusive emails with discounts and
              product information
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              className="mt-1 rounded focus:ring-red-500"
            />
            <span>
              I have read and agree to the website terms and conditions
              <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white font-semibold py-4 px-8 mt-6 rounded-md hover:bg-red-700 transition duration-200 text-lg"
        >
          CONFIRM & MAKE MY RESERVATION - {subtotal.toLocaleString()} CFA
        </button>
      </div>
    </div>
  );
}
