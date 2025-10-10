import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SubscriptionPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // ✅ Fetch packages from offers.json
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setFetchError("");
        const res = await axios.get("/data/offers.json");
        const packageList = res.data.map((offer) => offer.package);
        setPackages(packageList);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setFetchError("Failed to load packages. Please try again later.");
      }
    };
    fetchPackages();
  }, []);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Fake API call simulation
      await new Promise((resolve, reject) => setTimeout(reject, 1500));
      // setLoading(false);
      // alert("Subscription successful!");
    } catch {
      setError(
        "There was an error trying to send your message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-black">EASYRIDE</h1>
        <p className="mb-6 text-gray-700">
          SUBSCRIBE TO THE EASYRIDE SUBSCRIPTION
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 shadow-lg rounded-lg border"
        >
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* ✅ Package Dropdown */}
          {fetchError ? (
            <p className="text-red-500 text-sm">{fetchError}</p>
          ) : packages.length > 0 ? (
            <select
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              required
            >
              <option value="">Select Package</option>
              {packages.map((pkg, index) => (
                <option key={index} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm">Loading packages...</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "SUBSCRIBE"}
          </button>

          {/* ✅ Error Message */}
          {error && (
            <p className="text-red-500 border border-red-400 rounded p-2 text-sm text-center">
              {error}
            </p>
          )}
        </form>

        {/* ✅ Agency Info Section */}
        <div className="mt-12 text-left">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-black">Douala Agency</h3>
            <p>Bonapriso, Copesco Street</p>
            <p className="text-sm text-gray-600">📧 commande@easyride.cm</p>
            <p className="text-sm text-gray-600">📞 (+237) 694431749</p>
            <p className="text-sm text-gray-600">📞 (+237) 699 231 598</p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-black">Yaoundé Agency</h3>
            <p>Bastos, near the Orthodox church</p>
            <p className="text-sm text-gray-600">📧 commande@easyride.cm</p>
            <p className="text-sm text-gray-600">📞 (+237) 690 801 595</p>
            <p className="text-sm text-gray-600">📞 (+237) 670 089 942</p>
          </div>
        </div>
      </div>
    </div>
  );
}
