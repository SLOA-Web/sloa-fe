"use client";
import React, { useState } from "react";
import api from "@/utils/api";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background pt-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="rounded-lg shadow-md bg-card p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Contact Us</h1>
            <p className="text-sm text-muted-foreground">Questions, feedback or support — send us a message.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="p-3 text-sm text-red-800 bg-red-50 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-800 bg-green-50 rounded">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-1">Full name</label>
                <input
                  id="name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium block mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="text-sm font-medium block mb-1">Contact number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  className="input"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="text-sm font-medium block mb-1">Subject</label>
              <input
                id="subject"
                className="input w-full"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium block mb-1">Message</label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;