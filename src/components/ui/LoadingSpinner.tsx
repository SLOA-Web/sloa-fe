"use client"
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-32 w-full p-8"
    >
      <svg
        className="animate-spin h-12 w-12 mb-4 text-primary rounded-full p-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-80 fill-primary" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="text-gray-700 text-lg font-semibold animate-pulse tracking-wide">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
