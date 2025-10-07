import React, { useState } from "react";

export default function CheckoutPage() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const [payment, setPayment] = useState("mobile");

  const orderItems = [
    { name: "SUZUKI VITARA × 1", price: 7500 },
    {
      name: "Greenride – On time × 2",
      timing: "Timmming: On time",
      price: 20000,
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm">
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
                    className="w-full border rounded-md p-2"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    type="text"
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
                  className="w-full border rounded-md p-2"
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
                  className="w-full border rounded-md p-2"
                >
                  <option>Cameroon</option>
                  <option>Nigeria</option>
                  <option>Ghana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pick-up location
                </label>
                <input
                  name="pickup"
                  value={form.pickup}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Place of arrival
                </label>
                <input
                  name="arrival"
                  value={form.arrival}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  type="text"
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
                  className="w-full border rounded-md p-2"
                  type="text"
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
                  className="w-full border rounded-md p-2"
                  type="email"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={form.createAccount}
                  onChange={handleChange}
                />
                <label className="text-sm">Create an account?</label>
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
              className="w-full border rounded-md p-2"
              placeholder="Comments regarding your order, e.g. delivery instructions."
            ></textarea>
          </div>
        </div>

        {/* Order Table */}
        <h3 className="text-lg font-semibold mb-3">Your order</h3>
        <div className="overflow-x-auto mb-10">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Offer</th>
                <th className="text-right p-3 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">
                    {item.name}
                    {item.timing && (
                      <p className="text-gray-500 text-xs">{item.timing}</p>
                    )}
                  </td>
                  <td className="p-3 text-right text-red-600 font-medium">
                    {item.price.toLocaleString()} CFA
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-3 font-medium">Subtotal</td>
                <td className="p-3 text-right text-red-600 font-medium">
                  {subtotal.toLocaleString()} CFA
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Total</td>
                <td className="p-3 text-right text-red-600 font-semibold">
                  {subtotal.toLocaleString()} CFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Section */}
        <div className="border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="bg-gray-100 p-3 font-semibold text-sm flex items-center justify-between">
            <span>💳 Payment by Mobile Money</span>
          </div>
          <div className="p-4 text-sm space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="mobile"
                checked={payment === "mobile"}
                onChange={(e) => setPayment(e.target.value)}
              />
              <span>Pay by Orange Money or MTN Money</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="check"
                checked={payment === "check"}
                onChange={(e) => setPayment(e.target.value)}
              />
              <span>Check payments</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="agency"
                checked={payment === "agency"}
                onChange={(e) => setPayment(e.target.value)}
              />
              <span>Payment in Agency</span>
            </label>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />{" "}
            <span>
              I would like to receive exclusive emails with discounts and
              product information
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />{" "}
            <span>
              I have read and agree to the website conditions générales
              <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button className="bg-red-600 text-white font-semibold py-3 px-8 mt-6 rounded hover:bg-red-700">
          MAKE MY RESERVATION
        </button>
      </div>
    </div>
  );
}
