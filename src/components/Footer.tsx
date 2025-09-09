"use client";
import React, { useState, useRef, FormEvent } from "react";
import { DOCUMENTATION_LINKS, NAVBAR } from "@/data";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "./ui/CustomButton";
import { api } from "@/utils/api";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim() };
      await api.post("/api/v1/newsletter/subscribe", payload);

      setSuccess("Thank you for subscribing!");
      setEmail("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Subscription failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <footer
      className="w-full mt-auto relative overflow-hidden p-0 bg-white flex items-center justify-center"
      style={{
        backgroundImage: 'url("/assets/images/footer.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#FBFBFB] w-full px-4 pt-10 lg:px-12 lg:pt-16 my-52">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex items-start justify-between mb-8 lg:mb-0">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={400}
              height={160}
              className="relative w-72 lg:w-[28rem] z-[999] mr-16"
              priority
            />
          </div>
          <div className="w-full lg:w-[35%] flex flex-col">
            <div className="text-[28px] font-poppins mb-8 lg:mb-0 lg:text-[36px]">
              Get the latest <span className="text-primary">Orthopaedic</span>{" "}
              news and event updates — join our newsletter.
            </div>
            <div className="lg:hidden w-full flex flex-col justify-end self-end">
              <form
                ref={formRef}
                onSubmit={handleSubscribe}
                className="flex flex-col gap-2 font-poppins text-[18px]"
              >
                <div className="flex flex-row gap-2 bg-[#FBFBFB] p-2 rounded">
                  <input
                    type="email"
                    placeholder="SUBMIT YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="border-b border-black border-b-[1px] w-full px-3 py-2 focus:outline-none focus:border-primary font-poppins text-[18px] disabled:opacity-50 bg-[#FBFBFB]"
                  />
                  <CustomButton
                    onClick={handleButtonClick}
                    className="border-none font-poppins text-[18px]"
                  />
                </div>
                {/* Success/Error Message Area */}
                <div className="text-sm h-5 text-left">
                  {success && <p className="text-green-600">{success}</p>}
                  {error && <p className="text-red-600">{error}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 mt-10 font-poppins lg:flex-row lg:gap-16 lg:mt-12">
          {/* Quick Links, Documentation, Social Media */}
          <div className="w-full lg:w-[40%] space-y-4">
            <div className="text-[14px] text-primary">Quick Links</div>
            <ul className="mb-4 flex flex-wrap items-center gap-4">
              {NAVBAR.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="text-[14px] text-primary mb-2 mt-4">
              Other Documentation
            </div>
            <ul className="mb-4 flex flex-wrap items-center gap-4">
              {DOCUMENTATION_LINKS.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="text-[14px] text-primary mb-2 mt-4">
              Social Media
            </div>
            <div className="flex space-x-3">
              <Link
                href="https://www.instagram.com/srilankaorthopaedic/"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="https://www.facebook.com/ortho.org/"
                aria-label="Facebook"
              >
                <FaFacebookF size={24} />
              </Link>
              <Link
                href="https://www.youtube.com/@thesrilankaorthopaedicasso4115"
                aria-label="YouTube"
                className="pb-2"
              >
                <FaYoutube size={28} />
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="w-full lg:w-[20%] space-y-2 flex-shrink-0 text-[14px]">
            <p className="text-[14px] text-primary">Contact Details</p>
            <p className="py-2">srilankaortho@gmail.com</p>
            <div className="space-y-1">
              <p>+94 76 282 0181</p>
              <p>+94 11 746 0735</p>
            </div>
            <p className="py-2">
              Sri Lanka Orthopedic Association, C/O The College of Surgeons of
              Sri Lanka 06, Independence Avenue, Colombo 07, Sri Lanka.
            </p>
          </div>

          {/* --- MODIFIED Email Input Section --- */}
          <div className="w-full lg:w-[40%] hidden lg:flex flex-col justify-start self-start">
            <form
              ref={formRef}
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2 font-poppins text-[18px]"
            >
              <div className="flex flex-row gap-2 bg-[#FBFBFB] p-2 rounded">
                <input
                  type="email"
                  placeholder="SUBMIT YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-b border-black border-b-[1px] w-full px-3 py-2 focus:outline-none focus:border-primary font-poppins text-[18px] disabled:opacity-50 bg-[#FBFBFB]"
                />
                <CustomButton
                  onClick={handleButtonClick}
                  className="border-none font-poppins text-[18px]"
                />
              </div>
              {/* Success/Error Message Area */}
              <div className="text-sm h-5 text-left">
                {success && <p className="text-green-600">{success}</p>}
                {error && <p className="text-red-600">{error}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-10 pb-4 flex flex-col items-center justify-between font-poppins text-[#122D1E] text-[12px] gap-2 lg:flex-row lg:pt-16">
          <p>
            © {new Date().getFullYear()} Sri Lanka Orthopedic Association. All
            rights reserved.
          </p>
          <Link
            href="https://axle.global/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Designed and Developed by Axle Global
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
