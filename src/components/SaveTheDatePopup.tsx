"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const POPUP_STORAGE_KEY = "sloa_save_the_date_2026_dismissed";

export default function SaveTheDatePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Save the Date – SLOA Annual Conference 2026"
    >
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Close popup"
        >
          <X className="h-4 w-4 text-gray-700" />
        </button>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://github.com/user-attachments/assets/e0120764-5b2e-429b-9b70-574a0b4c56f9"
          alt="Save the Date – SLOA Annual Conference, 12th–14th November 2026 at The Grand Kandyan Hotel. Fostering Inclusion & Collaboration."
          className="w-full h-auto rounded-xl shadow-2xl block"
          loading="eager"
        />
      </div>
    </div>
  );
}
