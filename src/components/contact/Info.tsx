"use client";
import React, { useEffect, useRef } from "react";
import { Facebook, Instagram, Phone, Youtube } from "lucide-react";
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
      { label: "", value: "Sri Lanka Orthopedic Association," },
      { label: "", value: "C/O The College of Surgeons of Sri Lanka" },
      { label: "", value: "06, Independence Avenue, Colombo 07," },
      { label: "", value: "Sri Lanka" },
    ],
  },
  {
    title: "Contact",
    icon: null,
    items: [
      {
        label: "Email",
        value: (
          <a
            href="mailto:srilankaortho@gmail.com"
            className="hover:underline"
          >
            srilankaortho@gmail.com
          </a>
        ),
      },
      {
        label: "Phone",
        value: (
          <div className="flex flex-col gap-1">
            <a
              href="tel:+94762820181"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <Phone className="w-4 h-4" />
              +94 76 282 0181
            </a>
            <a
              href="tel:+94117460735"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <Phone className="w-4 h-4" />
              +94 11 746 0735
            </a>
          </div>
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
              href="https://www.facebook.com/ortho.org/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-blue-600 transition"
            >
              <Facebook className="w-5 lg:w-7 h-5 lg:h-7" />
            </a>
            <a
              href="https://www.instagram.com/srilankaorthopaedic/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-pink-500 transition"
            >
              <Instagram className="w-5 lg:w-7 h-5 lg:h-7" />
            </a>
            <a
              href="https://www.youtube.com/@thesrilankaorthopaedicasso4115"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-red-600 transition"
            >
              <Youtube className="w-6 lg:w-8 h-6 lg:h-8" />
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
        className="grid grid-cols-1 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 font-roboto uppercase mb-10"
      >
        {infoData.map((col) => (
          <div key={col.title} className="info-col px-2 py-4 sm:px-4 sm:py-6">
            <div className="flex items-center gap-2 mb-3">
              {col.icon}
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-roboto">
                {col.title}
              </h3>
            </div>
            <ul className="list-none p-0 m-0">
              {col.items.map((item, i) => (
                <li key={i} className="mb-2 text-[15px] sm:text-[16px] font-poppins">
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
