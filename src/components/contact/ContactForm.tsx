"use client";
import React, { useState, useEffect, useRef } from "react"; 
import { gsap } from "gsap";
import { api } from "@/utils/api";
import CustomButton from "../ui/CustomButton";

const ContactForm = () => {
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
    "w-full border-b border-black pt-8 pb-2 placeholder-[#808080] focus:outline-none bg-transparent";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form
      ref={formRef}
      className="bg-white border-2 border-[#D47045]/65 shadow-lg rounded-[14px] p-4 sm:p-6 py-12 sm:py-16 text-tertiary font-sans relative z-20"
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div ref={el => { fieldsRef.current[0] = el; }}>
          <label htmlFor="name" className="uppercase text-[20px]">
            Full Name
          </label>
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
          <label htmlFor="email" className="uppercase text-[20px]">
            Email
          </label>
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
          <label htmlFor="contactNumber" className="uppercase text-[20px]">
            Contact Number
          </label>
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
          <label htmlFor="subject" className="uppercase text-[20px]">
            Subject
          </label>
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
          <label htmlFor="message" className="uppercase text-[20px]">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className={inputClass}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter your message..."
          />
        </div>
      </div>
      {error && <p className={errorClass}>{error}</p>}
      {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
      <div ref={buttonRef}>
        <CustomButton
          text={loading ? "Sending..." : "Send Message"}
          type="submit"
          disabled={loading}
          className="mt-6"
        />
      </div>
    </form>
  );
};

export default ContactForm;
 