/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-medium)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  return (
    <div className="max-w-2xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Contact Me
      </h2>

      {submitted ? (
        <div
          className="text-center rounded-xl p-8"
          style={{ background: "var(--brand-surface)", border: "1px solid var(--border-subtle)" }}
        >
          <p style={{ color: "var(--brand-gold)", fontSize: "16px", fontWeight: 600 }}>
            Thanks for reaching out! I'll be in touch soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            style={{ ...inputStyle, resize: "vertical" as const }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-200"
            style={{
              background: loading ? "rgba(201,168,76,0.3)" : "linear-gradient(135deg, var(--brand-gold), #a8862e)",
              color: loading ? "rgba(255,255,255,0.4)" : "var(--brand-foundation)",
              fontSize: "15px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
