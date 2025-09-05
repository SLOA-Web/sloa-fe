"use client";
import React, { useEffect, useRef } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Phone } from "lucide-react";
import gsap from "gsap";

const infoData = [
  {
    title: "Business Hours",
    icon: null,
    items: [
      { label: "", value: "Monday - Friday: 9.00 AM - 5.30 PM" },
      { label: "", value: "Saturday: 9.30 AM - 1.00 PM" },
    ],
  },
  {
    title: "Address",
    icon: null,
    items: [
      { label: "", value: "420 Galle Road, Colombo 3," },
      { label: "", value: "Sri Lanka" },
    ],
  },
  {
    title: "Info",
    icon: null,
    items: [
      {
        label: "",
        value: (
          <a
            href="tel:+94112345678"
            className="inline-flex items-center gap-1  hover:underline"
          >
            <Phone className="w-4 h-4" />
            +94 11 234 5678
          </a>
        ),
      },
    ],
  },
  {
    title: "Social",
    icon: null,
    items: [
      {
        label: "",
        value: (
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-blue-600 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-sky-400 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-blue-700 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-pink-500 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        ),
      },
    ],
  },
];

const Info: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLHRElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".info-col"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
    if (hrRef.current) {
      gsap.fromTo(
        hrRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  return (
    <section>
      <div className="flex items-center justify-center my-12">
        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
        <hr
          ref={hrRef}
          className="flex-1 border-none bg-primary h-[1px] origin-center"
        />
        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
      </div>
      <div
        ref={sectionRef}
        className="grid grid-cols-1 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 font-ibm uppercase mb-10"
      >
        {infoData.map((col) => (
          <div key={col.title} className="info-col px-2 py-4 sm:px-4 sm:py-6">
            <div className="flex items-center gap-2 mb-3">
              {col.icon}
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px]">
                {col.title}
              </h3>
            </div>
            <ul className="list-none p-0 m-0">
              {col.items.map((item, i) => (
                <li key={i} className="mb-2 text-[15px] sm:text-[16px]">
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Info;
