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
    value: "+91 8955015524",
    href: "tel: +91 8955015524",
  },
  {
    label: "Instagram",
    value: "@web.3.bmsit",
    href: "https://www.instagram.com/web.3.bmsit",
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
    <div className="min-h-screen bg-background text-foreground font-mono px-6 md:px-16 pt-24 pb-10">

      {/* Heading */}
      <div className="mb-10">
        <p className="text-accent text-[10px] tracking-[0.3em] uppercase mb-2">
          — Establish Connection
        </p>

        <h1 className="text-[48px] md:text-[80px] font-bold leading-none">
          CONTACT <span className="text-accent">US</span>
        </h1>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT: SEND MESSAGE (PRIMARY) */}
        <div>
          <p className="text-accent text-[10px] tracking-[0.3em] uppercase mb-4">
            Send Message
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="bg-card border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="bg-card border border-border px-4 py-3 text-sm focus:border-accent outline-none"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <input
              className="w-full bg-card border border-border px-4 py-3 text-sm focus:border-accent outline-none"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />

            <textarea
              className="w-full bg-card border border-border px-4 py-3 text-sm focus:border-accent outline-none resize-none"
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
                className="bg-accent text-background px-8 py-3 text-xs font-bold tracking-widest hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? "SENDING..." : "SEND MESSAGE →"}
              </button>

              {status === "success" && (
                <p className="text-accent text-sm">✓ Message sent</p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm">✗ Something went wrong</p>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: DIRECT LINKS */}
        <div>
          <p className="text-accent text-[10px] tracking-[0.3em] uppercase mb-4">
            Direct Channels
          </p>

          <div className="space-y-4 mb-6">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                className="flex items-center justify-between border border-border bg-card px-5 py-4 hover:border-accent hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div>
                  <p className="text-[10px] tracking-widest text-foreground/50 uppercase">
                    {c.label}
                  </p>
                  <p className="text-sm font-semibold">{c.value}</p>
                </div>
                <span className="text-foreground/40">↗</span>
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