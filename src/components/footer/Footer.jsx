// src/components/layout/Footer.jsx
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
        {/* Column 1: Agencies */}
        <div>
          <h4 className="font-bold uppercase mb-3 border-b border-white/40 pb-1">
            Our Agencies
          </h4>
          <p className="mb-2">Douala, Bonapriso, Copseco Street</p>
          <p>Yaoundé, Bastos, near the Orthodox church</p>
        </div>

        {/* Column 2: Offers */}
        <div>
          <h4 className="font-bold uppercase mb-3 border-b border-white/40 pb-1">
            Our Offers
          </h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-red-500">
                2H Package
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                EasySchool
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Easy Work
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Our Subscriptions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                All Our Offers
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contacts */}
        <div>
          <h4 className="font-bold uppercase mb-3 border-b border-white/40 pb-1">
            Contacts
          </h4>
          <ul className="space-y-1">
            <li>contact@easyride.cm</li>
            <li>commande@easyride.cm</li>
            <li>694 431 749</li>
            <li>690 801 955</li>
          </ul>
        </div>

        {/* Column 4: Socials */}
        <div>
          <h4 className="font-bold uppercase mb-3 border-b border-white/40 pb-1">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white text-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-3 text-sm">
          {/* Left */}
          <p className="mb-2 md:mb-0">Copyright© 2021 Easyride</p>

          {/* Right Links */}
          <div className="flex gap-6">
            <a href="/legal" className="hover:text-red-600">
              Legal notices
            </a>
            <a href="/faqs" className="hover:text-red-600">
              FAQs
            </a>
            <a href="/privacy" className="hover:text-red-600">
              Privacy Policy
            </a>
            <a href="/login" className="hover:text-red-600">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 bg-red-600 text-white p-3 rounded"
      >
        ↑
      </button>
    </footer>
  );
}
