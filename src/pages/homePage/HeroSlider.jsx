import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch fake JSON data
    axios
      .get("/data/slider.json")
      .then((res) => setSlides(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides]);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  if (!slides.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`w-full transition-all duration-700 ease-in-out ${
            index === currentIndex
              ? "opacity-100"
              : "opacity-0 absolute top-0 left-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-[300px]  object-center sm:h-[400px] md:h-[500px] lg:h-auto"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 text-white p-4">
            {/* <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {slide.title}
            </h2> */}
            {/* <p className="mb-6 text-lg md:text-2xl">{slide.description}</p> */}
            <Link to={"/all-offers"} className="bg-gray-900 hover:bg-gray-950 px-4 md:px-8 py-2 md:py-3 rounded md:font-bold uppercase  md:text-3xl">
              Book Now
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
      >
        &#10095;
      </button>
    </div>
  );
}
