"use client";
import { useState } from "react";
import { ChevronLeft, Zap, Sparkles, Target, Brain, ShieldOff, Sliders, Mail, CheckCircle2 } from "lucide-react";
import { Btn } from "./ui";
import { VERSION } from "../../lib/outputBuilder";

export default function SignInGate({ isMobile, signInWithMagicLink }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (e) {
      setError(e?.message || "Failed to send magic link. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 20px" : "60px 24px", position: "relative", overflow: "hidden" }}>
      <a href="/" style={{ position: "absolute", top: isMobile ? "16px" : "24px", left: isMobile ? "16px" : "24px", display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", zIndex: 1 }} onMouseEnter={e => (e.currentTarget.style.color = "#d4a24e")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
        <ChevronLeft size={16} /> dejuanspencer.com
      </a>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,162,78,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="gate-fade" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #d4a24e, #b8862e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={26} color="#1a1a1a" />
        </div>
        <div>
          <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>Prompt Engine</h1>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>Project Instructions Builder · {VERSION}</div>
        </div>
      </div>

      {sent ? (
        <div className="gate-fade-2" style={{ maxWidth: "420px", width: "100%", textAlign: "center", padding: "32px 24px", background: "rgba(212,162,78,0.06)", border: "1px solid rgba(212,162,78,0.25)", borderRadius: "14px" }}>
          <CheckCircle2 size={40} color="#d4a24e" style={{ marginBottom: "16px" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px", color: "#e0e0e0" }}>Check your inbox</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: "16px" }}>
            We sent a sign-in link to <strong style={{ color: "#d4a24e" }}>{email}</strong>. Click it to unlock your prompt engine.
          </p>
          <button onClick={() => { setSent(false); setEmail(""); }} style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Use a different email
          </button>
        </div>
      ) : (
        <>
          <p className="gate-fade-2" style={{ fontSize: isMobile ? "15px" : "17px", color: "rgba(255,255,255,0.55)", textAlign: "center", maxWidth: "480px", lineHeight: 1.7, marginBottom: "28px" }}>
            Sign in to save your work across devices. We&apos;ll email you a magic link &mdash; no password required.
          </p>

          <div className="gate-fade-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%", maxWidth: "380px" }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && !sending && submit()}
              placeholder="you@example.com"
              aria-label="Email address"
              disabled={sending}
              style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.05)", border: error ? "1.5px solid rgba(220,80,80,0.5)" : "1.5px solid rgba(212,162,78,0.2)", borderRadius: "12px", color: "#e0e0e0", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", textAlign: "center", boxSizing: "border-box" }}
            />
            {error && <div role="alert" style={{ fontSize: "12px", color: "#dc5050" }}>{error}</div>}
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
              Magic link auth via Supabase. Your work is saved to your account.
            </div>
            <Btn primary onClick={submit} disabled={sending} style={{ width: "100%", justifyContent: "center", padding: "14px 20px", fontSize: "15px", borderRadius: "12px" }}>
              {sending ? <><Mail size={18} /> Sending...</> : <><Sparkles size={18} /> Send Magic Link</>}
            </Btn>
          </div>

          <div className="gate-fade-3" style={{ marginTop: "48px", display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ icon: Target, label: "Identity" }, { icon: Brain, label: "Knowledge" }, { icon: ShieldOff, label: "Guardrails" }, { icon: Sliders, label: "Modes" }].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon size={14} color="rgba(212,162,78,0.5)" />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
