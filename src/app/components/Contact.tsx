"use client";

import { useState } from "react";

const CONTACTS = [
  {
    label: "Email",
    value: "web3club@bmsit.in",
    href: "mailto:web3club@bmsit.in",
  },
  {
    label: "Phone",
    value: "+91 99999 99999",
    href: "tel:+919999999999",
  },
  {
  label: "Instagram",
  value: "@web3",
  href: "https://instagram.com/web3",
}
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_ACCESS_KEY",
          name: form.name,
          email: form.email,
          subject: form.subject || "New Contact Message",
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono px-6 md:px-16 pt-24 pb-10">
      
      {/* Heading */}
      <div className="mb-10">
        <p className="text-[#CDEF33] text-[10px] tracking-[0.3em] uppercase mb-2">
          — Establish Connection
        </p>

        <h1 className="text-[48px] md:text-[80px] font-bold leading-none">
          CONTACT US
        </h1>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT: SEND MESSAGE (PRIMARY) */}
        <div>
          <p className="text-[#CDEF33] text-[10px] tracking-[0.3em] uppercase mb-4">
            Send Message
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="bg-[#202221] border border-[#2a2b2a] px-4 py-3 text-sm focus:border-[#CDEF33] outline-none"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="bg-[#202221] border border-[#2a2b2a] px-4 py-3 text-sm focus:border-[#CDEF33] outline-none"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <input
              className="w-full bg-[#202221] border border-[#2a2b2a] px-4 py-3 text-sm focus:border-[#CDEF33] outline-none"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />

            <textarea
              className="w-full bg-[#202221] border border-[#2a2b2a] px-4 py-3 text-sm focus:border-[#CDEF33] outline-none resize-none"
              name="message"
              rows={5}
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
            />

            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#CDEF33] text-black px-8 py-3 text-xs font-bold tracking-widest hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? "SENDING..." : "SEND MESSAGE →"}
              </button>

              {status === "success" && (
                <p className="text-[#CDEF33] text-sm">✓ Message sent</p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm">✗ Something went wrong</p>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: DIRECT LINKS */}
        <div>
          <p className="text-[#CDEF33] text-[10px] tracking-[0.3em] uppercase mb-4">
            Direct Channels
          </p>

          <div className="space-y-4 mb-6">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                className="flex items-center justify-between border border-[#202221] bg-[#0a0a0a] px-5 py-4 hover:border-[#CDEF33] hover:bg-[#111] transition"
              >
                <div>
                  <p className="text-[10px] tracking-widest text-gray-500 uppercase">
                    {c.label}
                  </p>
                  <p className="text-sm font-semibold">{c.value}</p>
                </div>
                <span className="text-gray-600">↗</span>
              </a>
            ))}
          </div>

          {/* Location */}
         
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 mt-12 gap-2">
        
        <p>Web3 · Cryptography · Open Source</p>
      </div>
    </div>
  );
}