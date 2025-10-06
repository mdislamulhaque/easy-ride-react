import React, { useState, useEffect, useRef, useCallback } from "react";
import { Globe, Check } from "lucide-react";
import enFlag from "/images/uk.png";
import frFlag from "/images/france.png";
import logo from "/images/france.png";
import Loader from "../components/shared/Loader";

export default function LanguageToggle() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropdownRef = useRef(null);
  const langChangeTimeout = useRef(null);
  const isInitialized = useRef(false);
  const progressInterval = useRef(null);

  const changeLanguage = useCallback(
    (language) => {
      if (lang === language || isTranslating) return;

      console.log("🎯 Changing language to:", language);

      if (langChangeTimeout.current) {
        clearTimeout(langChangeTimeout.current);
      }

      // Reset progress
      setProgress(0);
      setShowOverlay(true);
      setOpen(false);
      setIsTranslating(true);

      // Start progress animation
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval.current);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      // Change language after a small delay
      setTimeout(() => {
        setLang(language);
        localStorage.setItem("preferred-language", language);

        const domain = window.location.hostname;
        document.cookie = `googtrans=/auto/${language}; path=/; max-age=31536000; domain=${domain}`;
        document.cookie = `googtrans=/${language}; path=/; max-age=31536000; domain=${domain}`;

        langChangeTimeout.current = setTimeout(() => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            select.value = language;
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }

          // Complete progress and hide overlay
          setTimeout(() => {
            setProgress(100);
            clearInterval(progressInterval.current);

            setTimeout(() => {
              setIsTranslating(false);
              setShowOverlay(false);
              setProgress(0);
            }, 600);
          }, 500);
        }, 300);
      }, 200);
    },
    [lang, isTranslating]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Rest of your existing code (initialization, effects, etc.)
  useEffect(() => {
    if (isInitialized.current) return;

    const initializeLanguage = () => {
      const savedLang = localStorage.getItem("preferred-language");
      if (savedLang) {
        setLang(savedLang);
      }

      const initGoogleTranslate = () => {
        const select = document.querySelector(".goog-te-combo");
        if (select && savedLang) {
          select.value = savedLang;
          select.dispatchEvent(new Event("change", { bubbles: true }));

          const domain = window.location.hostname;
          document.cookie = `googtrans=/auto/${savedLang}; path=/; max-age=31536000; domain=${domain}`;
          document.cookie = `googtrans=/${savedLang}; path=/; max-age=31536000; domain=${domain}`;

          isInitialized.current = true;
          return true;
        }
        return false;
      };

      if (!initGoogleTranslate()) {
        const attempts = [100, 300, 500, 1000, 2000, 3000, 5000];
        attempts.forEach((delay) => {
          setTimeout(() => {
            if (!isInitialized.current) {
              initGoogleTranslate();
            }
          }, delay);
        });
      }
    };

    initializeLanguage();
    window.addEventListener("load", initializeLanguage);

    return () => {
      window.removeEventListener("load", initializeLanguage);
      if (langChangeTimeout.current) {
        clearTimeout(langChangeTimeout.current);
      }
    };
  }, []);

  // Google Translate UI hiding
  useEffect(() => {
    let styleElement = null;

    const applySmoothStyles = () => {
      if (styleElement) {
        styleElement.remove();
      }

      styleElement = document.createElement("style");
      styleElement.textContent = `
        .goog-te-banner-frame, 
        .goog-te-menu-value, 
        .goog-te-gadget, 
        .goog-te-banner, 
        .goog-te-ftab,
        .skiptranslate,
        .goog-te-spinner-pos,
        .goog-te-balloon-frame {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        body {
          top: 0px !important;
          position: static !important;
        }
        
        .goog-te-combo {
          opacity: 0 !important;
          position: fixed !important;
          left: -10000px !important;
          pointer-events: none !important;
          width: 1px !important;
          height: 1px !important;
        }
      `;

      document.head.appendChild(styleElement);
    };

    applySmoothStyles();

    const domObserver = new MutationObserver((mutations) => {
      let shouldReapply = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node.classList?.contains("goog-te-banner-frame") ||
                node.querySelector?.(".goog-te-banner-frame"))
            ) {
              shouldReapply = true;
            }
          });
        }
      });

      if (shouldReapply) {
        setTimeout(applySmoothStyles, 10);
      }
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      domObserver.disconnect();
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Outside click detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const currentFlag = lang === "en" ? enFlag : frFlag;
  const currentText = lang === "en" ? "English" : "French";
  const targetFlag = lang === "en" ? frFlag : enFlag;
  const targetText = lang === "en" ? "French" : "English";

  return (
    <>
      {/* Curtain Rise Overlay */}
      {showOverlay && (
        <Loader/>
      )}

      {/* Your existing language toggle component */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          disabled={isTranslating}
          className={`
            flex items-center gap-2 md:border-2 px-3 py-2 rounded-2xl 
            transition-all duration-300 ease-in-out
            dark:border-gray-600 hover:text-gray-400
            ${
              isTranslating
                ? "opacity-70 cursor-not-allowed scale-95"
                : "opacity-100 cursor-pointer hover:scale-105"
            }
            ${open ? "bg-gray-50 dark:bg-gray-800" : ""}
          `}
        >
          <div className="relative">
            <img
              src={currentFlag}
              alt="flag"
              className="w-5 h-5 transition-all duration-300 ease-in-out"
            />
            {isTranslating && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            )}
          </div>

          <span className="text-sm font-medium hidden md:block transition-all duration-300">
            {currentText}
          </span>

          <Globe
            size={16}
            className={`hidden md:block transition-all duration-300 ${
              isTranslating ? "animate-spin" : ""
            }`}
          />
        </button>

        <div
          className={`
            absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 rounded-lg 
            shadow-lg z-50 overflow-hidden
            transition-all duration-300 ease-in-out
            ${
              open
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <button
            onClick={() => changeLanguage("en")}
            disabled={isTranslating}
            className={`
              flex w-full items-center gap-3 px-4 py-3 
              transition-all duration-200 ease-in-out
              hover:bg-gray-50 dark:hover:bg-gray-700
              ${
                lang === "en"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }
              ${
                isTranslating
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }
            `}
          >
            <img src={enFlag} alt="English" className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-left font-medium">English</span>
            {lang === "en" && (
              <Check size={16} className="text-blue-500 flex-shrink-0" />
            )}
          </button>

          <button
            onClick={() => changeLanguage("fr")}
            disabled={isTranslating}
            className={`
              flex w-full items-center gap-3 px-4 py-3 
              transition-all duration-200 ease-in-out
              hover:bg-gray-50 dark:hover:bg-gray-700
              ${
                lang === "fr"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }
              ${
                isTranslating
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }
            `}
          >
            <img src={frFlag} alt="French" className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-left font-medium">French</span>
            {lang === "fr" && (
              <Check size={16} className="text-blue-500 flex-shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Add custom CSS for shine animation */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-45deg);
          }
          100% {
            transform: translateX(200%) skewX(-45deg);
          }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
