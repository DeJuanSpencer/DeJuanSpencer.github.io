"use client";
import { ChevronLeft, Zap, Loader2, Sparkles, Target, Brain, ShieldOff, Sliders, CreditCard } from "lucide-react";
import { VERSION } from "../../lib/outputBuilder";

export default function PaymentGate({ email, onCheckout, pending, error, isMobile }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 20px" : "60px 24px", position: "relative", overflow: "hidden" }}>
      <a href="/" style={{ position: "absolute", top: isMobile ? "16px" : "24px", left: isMobile ? "16px" : "24px", display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", zIndex: 1 }} onMouseEnter={e => (e.currentTarget.style.color = "#d4a24e")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
        <ChevronLeft size={16} /> dejuanspencer.com
      </a>

      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,162,78,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo + title */}
      <div className="gate-fade" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #d4a24e, #b8862e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={26} color="#1a1a1a" />
        </div>
        <div>
          <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>Prompt Engine</h1>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>Project Instructions Builder · {VERSION}</div>
        </div>
      </div>

      <p className="gate-fade-2" style={{ fontSize: isMobile ? "14px" : "16px", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "440px", lineHeight: 1.7, marginBottom: "32px" }}>
        One-time payment · Unlimited access · No subscription
      </p>

      {/* Pricing card */}
      <div className="gate-fade-2" style={{ maxWidth: "400px", width: "100%", background: "rgba(212,162,78,0.06)", border: "1px solid rgba(212,162,78,0.25)", borderRadius: "16px", padding: isMobile ? "24px 20px" : "32px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Email badge */}
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 12px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
        </div>

        {/* Feature list */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { icon: Target, label: "AI-generated agent identity" },
            { icon: Brain, label: "Knowledge base via guided quiz" },
            { icon: ShieldOff, label: "Custom guardrails & negative space" },
            { icon: Sliders, label: "Behavior modes + priority ranking" },
            { icon: Sparkles, label: "One-click prompt export" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(212,162,78,0.1)", border: "1px solid rgba(212,162,78,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} color="#d4a24e" />
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>{label}</span>
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <div role="alert" style={{ fontSize: "13px", color: "#dc5050", background: "rgba(220,80,80,0.08)", border: "1px solid rgba(220,80,80,0.25)", borderRadius: "8px", padding: "10px 14px", lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={onCheckout}
          disabled={pending}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: "12px",
            border: "none",
            cursor: pending ? "not-allowed" : "pointer",
            background: pending ? "rgba(212,162,78,0.4)" : "linear-gradient(135deg, #d4a24e, #b8862e)",
            color: "#1a1a1a",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "opacity 0.2s",
            letterSpacing: "-0.2px",
          }}
        >
          {pending ? (
            <>
              <Loader2 size={18} className="spin" />
              Redirecting to checkout...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Get Access — $29
            </>
          )}
        </button>

        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
          Secure payment via Stripe · Instant access after checkout
        </p>
      </div>

      {/* Feature chips */}
      <div className="gate-fade-3" style={{ marginTop: "36px", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {[{ icon: Target, label: "Identity" }, { icon: Brain, label: "Knowledge" }, { icon: ShieldOff, label: "Guardrails" }, { icon: Sliders, label: "Modes" }].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Icon size={14} color="rgba(212,162,78,0.5)" />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
