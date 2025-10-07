import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function RentVehicle() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Fetch vehicle data
  useEffect(() => {
    axios
      .get("/data/offers.json")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const car = res.data.filter(
            (offer) => offer.category === "Car"
          );
          setOffers(car);
        } else {
          throw new Error("Invalid data format received");
        }
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setError("Failed to load vehicle data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Determine visible cards per screen width
  const getVisibleCards = () => {
    if (typeof window === "undefined") return 1;
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
      setCurrentIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Duplicate data for smooth infinite loop
  const extendedOffers = [...offers, ...offers];

  // Auto slide every 4 seconds
  useEffect(() => {
    if (!offers.length) return;
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [offers, currentIndex, visibleCards]);

  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));

  // Reset instantly when reaching cloned end
  useEffect(() => {
    if (currentIndex === offers.length) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(0);
      }, 800);
      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(true);
    }
  }, [currentIndex, offers.length]);

  // Conditional UI rendering
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        Loading vehicle offers...
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

  if (!offers.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No vehicles available at the moment.
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-8xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          RENT ONE OF OUR STAR VEHICLES
        </h2>

        <div className="relative overflow-hidden py-6">
          {/* Carousel container */}
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
            transition={
              isAnimating
                ? { duration: 0.8, ease: "easeInOut" }
                : { duration: 0 }
            }
          >
            {extendedOffers.map((offer, index) => (
              <motion.div
                key={index}
                className="px-2 flex-shrink-0"
                style={{ width: `${100 / visibleCards}%` }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white rounded-xl  overflow-hidden text-center p-4 flex flex-col items-center h-[320px] justify-between transition hover:shadow-lg">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-contain"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                  <div>
                    <h3 className="text-lg font-bold mt-3 text-gray-900">
                      {offer.title}
                    </h3>
                    <button className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors">
                      TO BOOK
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
