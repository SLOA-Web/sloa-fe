"use client";
import React, { useState, useEffect, useRef } from "react";
import api from "@/utils/api";
import { gsap } from "gsap";
// import { CustomButton } from "../CustomButton"; // Uncomment if you have this component

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fieldsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(formRef.current, { opacity: 0, y: 40, scale: 0.97 });
      gsap.set(fieldsRef.current, { opacity: 0, y: 24 });
      gsap.set(buttonRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline();
      tl.to(formRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power2.out"
      })
        .to(fieldsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out"
        }, "-=0.3")
        .to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.15");
    }, formRef);
    return () => ctx.revert();
  }, []);

  const reset = () => {
    setName("");
    setEmail("");
    setContactNumber("");
    setSubject("");
    setMessage("");
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhone = (value: string) =>
    /^[\d\+\-\s\(\)]{6,20}$/.test(value.trim());

  interface InquiryResponse {
    id?: string;
    success?: boolean;
    message?: string;
    [key: string]: unknown;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !contactNumber.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters long.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPhone(contactNumber)) {
      setError("Please enter a valid contact number.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        subject: subject.trim(),
        message: message.trim(),
      };

      const response = (await api.post("/api/v1/inquiries", payload)) as InquiryResponse;

      if (response && (response.id || response.success || response.message)) {
        setSuccess("Message sent. We'll get back to you shortly.");
        reset();
      } else {
        throw new Error("Failed to submit inquiry. No valid response from server.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while sending your message.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border-b border-black pt-8 pb-2 placeholder-[#808080] focus:outline-none bg-transparent text-lg";
  const labelClass =
    "uppercase text-[18px] tracking-wide font-medium mb-1";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 px-4 py-16">
      <div className="mx-auto px-6 lg:px-12">
        <form
          ref={formRef}
          className="bg-white border border-gray-200 p-8 sm:p-12"
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
        >
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Contact Us</h1>
            <p className="text-base text-gray-500">Questions, feedback, or support? Send us a message and we&apos;ll respond promptly.</p>
          </header>

          {error && (
            <div className={errorClass + " p-3 bg-red-100 border border-red-200 mb-4"}>
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div ref={el => { fieldsRef.current[0] = el; }}>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input
                id="name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            <div ref={el => { fieldsRef.current[1] = el; }}>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="johndoe@email.com"
                autoComplete="email"
              />
            </div>
            <div ref={el => { fieldsRef.current[2] = el; }}>
              <label htmlFor="contactNumber" className={labelClass}>Contact Number</label>
              <input
                id="contactNumber"
                type="tel"
                className={inputClass}
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="+94 123 4567"
                autoComplete="tel"
              />
            </div>
            <div ref={el => { fieldsRef.current[3] = el; }}>
              <label htmlFor="subject" className={labelClass}>Subject</label>
              <input
                id="subject"
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Subject"
              />
            </div>
            <div className="col-span-1 sm:col-span-2" ref={el => { fieldsRef.current[4] = el; }}>
              <label htmlFor="message" className={labelClass}>Message</label>
              <textarea
                id="message"
                rows={5}
                className={inputClass + " resize-none"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Enter your message..."
              />
            </div>
          </div>
          <div ref={buttonRef}>
            {/* <CustomButton
              text={loading ? "Sending..." : "Send Message"}
              type="submit"
              disabled={loading}
              className="mt-6"
            /> */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white font-semibold uppercase tracking-wider shadow hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;