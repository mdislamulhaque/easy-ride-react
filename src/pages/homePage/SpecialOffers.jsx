import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router"; // fixed router import

export default function SpecialOffers() {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("/data/offers.json");
        if (Array.isArray(res.data)) {
          const packageOffers = res.data.filter(
            (offer) => offer.category === "Package"
          );
          setOffers(packageOffers);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError("Failed to load offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Determine visible cards based on screen width
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

  // Duplicate data for infinite scroll
  const extendedOffers = [...offers, ...offers];
  // const extendedOffers = offers.filter((o) => o.category === "Package");



  // Auto slide
  useEffect(() => {
    if (!offers.length) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [offers, currentIndex, visibleCards]);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  // Reset when reaching cloned end
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

  // 🧩 Conditional rendering
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        Loading offers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">{error}</div>
    );
  }

  if (!offers.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No special offers available right now.
      </div>
    );
  }

  // ✅ Main UI
  return (
    <section className="py-10 bg-white">
      <div className="max-w-8xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          TAKE ADVANTAGE OF OUR SPECIAL OFFERS
        </h2>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
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
                <div className="relative rounded-xl overflow-hidden shadow-md group h-84">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-bold">{offer.title}</h3>
                      {offer.description && (
                        <p className="text-sm">{offer.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors h-12 w-12 flex items-center justify-center"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors h-12 w-12 flex items-center justify-center"
          >
            &#10095;
          </button>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Link
            to="/all-offers"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            SEE ALL OUR SPECIAL OFFERS
          </Link>
        </div>
      </div>
    </section>
  );
}
