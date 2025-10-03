// src/components/layout/TopNavBar.jsx
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function TopNavBar() {
  return (
    <header className="bg-black text-white">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-2 text-sm">
        {/* Left Text */}
        <p className="font-medium">
          Contact us and rent your vehicle with driver in Douala and Yaoundé
          <span className="ml-2 font-bold">694 431 749</span>
        </p>

        {/* Right Social Icons */}
        <div className="flex gap-4 text-white">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </header>
  );
}
