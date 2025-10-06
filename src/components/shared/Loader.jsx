import React, { useEffect, useState } from "react";
import logo from "/images/easy-ride.png"; // your logo path

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        setTimeout(() => setDone(true), 800); // fade out after animation ends
        return 100;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900 transition-opacity duration-700 z-[9999] ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-52 h-24 flex items-center justify-center overflow-hidden">
        {/* logo */}
        <img
          src={logo}
          alt="EasyRide Logo"
          className="w-full h-auto object-contain select-none"
        />

        {/* sliding overlay */}
        <div
          className="absolute bottom-0 left-0 w-full bg-white/50 dark:bg-gray-900"
          style={{
            height: `${100 - progress}%`,
            transition: "height 0.3s ease",
          }}
        ></div>
      </div>

      {/* loading text */}
      <p className="text-gray-700 dark:text-gray-200 text-sm font-medium mt-4">
        {progress}%
      </p>
    </div>
  );
}
