import React, { useState, useEffect, useRef, useCallback } from "react";
import { Globe, Check } from "lucide-react";
import enFlag from "/images/uk.png";
import frFlag from "/images/france.png";

export default function LanguageToggle() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef(null);
  const langChangeTimeout = useRef(null);
  const isInitialized = useRef(false);

  // Enhanced language change
  const changeLanguage = useCallback(
    (language) => {
      if (lang === language || isTranslating) return;

      console.log("🎯 Changing language to:", language);

      if (langChangeTimeout.current) {
        clearTimeout(langChangeTimeout.current);
      }

      setLang(language);
      setOpen(false);
      setIsTranslating(true);

      // IMMEDIATELY save to localStorage
      localStorage.setItem("preferred-language", language);
      console.log("💾 Saved to localStorage:", language);

      // Set cookies properly
      const domain = window.location.hostname;
      document.cookie = `googtrans=/auto/${language}; path=/; max-age=31536000; domain=${domain}`;
      document.cookie = `googtrans=/${language}; path=/; max-age=31536000; domain=${domain}`;

      langChangeTimeout.current = setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          console.log("🔄 Setting Google Translate to:", language);
          select.value = language;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        setTimeout(() => {
          setIsTranslating(false);
        }, 800);
      }, 200);
    },
    [lang, isTranslating]
  );

  // FIXED: Proper initialization that persists after reload
  useEffect(() => {
    // Don't initialize multiple times
    if (isInitialized.current) return;

    const initializeLanguage = () => {
      // Get saved language from localStorage FIRST
      const savedLang = localStorage.getItem("preferred-language");
      console.log(
        "🔍 Initialization - Saved lang from localStorage:",
        savedLang
      );

      if (savedLang) {
        setLang(savedLang);
        console.log("✅ Set component state to:", savedLang);
      }

      // Now initialize Google Translate with the saved language
      const initGoogleTranslate = () => {
        const select = document.querySelector(".goog-te-combo");
        if (select && savedLang) {
          console.log("🎯 Initializing Google Translate with:", savedLang);

          // Force set Google Translate to saved language
          select.value = savedLang;
          select.dispatchEvent(new Event("change", { bubbles: true }));

          // Also set cookies
          const domain = window.location.hostname;
          document.cookie = `googtrans=/auto/${savedLang}; path=/; max-age=31536000; domain=${domain}`;
          document.cookie = `googtrans=/${savedLang}; path=/; max-age=31536000; domain=${domain}`;

          isInitialized.current = true;
          return true;
        }
        return false;
      };

      // Multiple initialization attempts
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

    // Initialize on component mount
    initializeLanguage();

    // Also initialize when window loads completely
    window.addEventListener("load", initializeLanguage);

    return () => {
      window.removeEventListener("load", initializeLanguage);
      if (langChangeTimeout.current) {
        clearTimeout(langChangeTimeout.current);
      }
    };
  }, []); // Empty dependency array - runs only once on mount

  // FIXED: Continuous synchronization to prevent Google Translate from resetting
  useEffect(() => {
    const syncLanguage = () => {
      const savedLang = localStorage.getItem("preferred-language") || "en";
      const select = document.querySelector(".goog-te-combo");

      if (select && select.value !== savedLang) {
        console.log(
          "🛠️ Syncing: Google Translate says",
          select.value,
          "but localStorage says",
          savedLang
        );

        // Correct Google Translate
        select.value = savedLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));

        // Update component state if different
        if (lang !== savedLang) {
          setLang(savedLang);
        }
      }
    };

    // Check every 500ms for the first 10 seconds, then every 2 seconds
    let quickCheckInterval = setInterval(syncLanguage, 500);
    let normalCheckInterval = setInterval(syncLanguage, 2000);

    // Stop quick checking after 10 seconds
    setTimeout(() => {
      clearInterval(quickCheckInterval);
    }, 10000);

    return () => {
      clearInterval(quickCheckInterval);
      clearInterval(normalCheckInterval);
    };
  }, [lang]);

  // FIXED: Handle page reloads and navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Save current state before page unloads
      const currentLang = localStorage.getItem("preferred-language") || "en";
      console.log("💾 Saving before unload:", currentLang);
    };

    const handlePageShow = (event) => {
      // Page was restored from back/forward cache
      if (event.persisted) {
        console.log("🔄 Page restored from bfcache, reinitializing...");
        const savedLang = localStorage.getItem("preferred-language");
        if (savedLang && savedLang !== lang) {
          setLang(savedLang);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [lang]);

  // Google Translate UI hiding (same as before)
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

  return (
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
              isTranslating ? "cursor-not-allowed opacity-60" : "cursor-pointer"
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
              isTranslating ? "cursor-not-allowed opacity-60" : "cursor-pointer"
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

      {isTranslating && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse rounded-full" />
      )}
    </div>
  );
}
