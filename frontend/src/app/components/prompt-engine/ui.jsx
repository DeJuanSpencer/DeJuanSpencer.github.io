"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LOADING_PHRASES } from "../../lib/outputBuilder";

export const Badge = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: "6px",
    border: active ? "1.5px solid #d4a24e" : "1.5px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(212,162,78,0.15)" : "rgba(255,255,255,0.03)",
    color: active ? "#d4a24e" : "rgba(255,255,255,0.6)",
    fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
    fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</button>
);

export const Card = ({ children, style, highlight }) => (
  <div style={{
    background: highlight ? "rgba(212,162,78,0.06)" : "rgba(255,255,255,0.03)",
    border: highlight ? "1px solid rgba(212,162,78,0.3)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px", padding: "16px", ...style,
  }}>{children}</div>
);

export const Btn = ({ children, onClick, primary, disabled, small, style: s }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "6px 14px" : "10px 20px", borderRadius: "8px",
    border: primary ? "none" : "1px solid rgba(255,255,255,0.12)",
    background: primary
      ? disabled ? "rgba(212,162,78,0.3)" : "linear-gradient(135deg, #d4a24e, #b8862e)"
      : "rgba(255,255,255,0.05)",
    color: primary ? (disabled ? "rgba(255,255,255,0.4)" : "#1a1a1a") : "rgba(255,255,255,0.75)",
    fontSize: small ? "12px" : "14px", fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", gap: "8px",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", ...s,
  }}>{children}</button>
);

export const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows} style={{
      width: "100%", background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
      padding: "12px 14px", color: "#e0e0e0", fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none",
      lineHeight: 1.6, boxSizing: "border-box",
    }} />
);

export const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={{
      width: "100%", background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
      padding: "10px 14px", color: "#e0e0e0", fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
    }} />
);

export const SectionLabel = ({ children, sub }) => (
  <div style={{ marginBottom: sub ? "8px" : "16px" }}>
    <div style={{
      fontSize: sub ? "12px" : "13px", fontFamily: "'JetBrains Mono', monospace",
      color: sub ? "rgba(255,255,255,0.4)" : "#d4a24e",
      textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600,
    }}>{children}</div>
  </div>
);

export const Toast = ({ msg }) => (
  <div style={{
    position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
    background: "#dc5050", color: "#fff", padding: "10px 18px",
    borderRadius: "8px", fontSize: "13px", fontWeight: 600, zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  }}>{msg}</div>
);

export const LoadingIndicator = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [dots, setDots] = useState("");
  useEffect(() => {
    const phraseTimer = setInterval(() => setPhraseIdx(prev => (prev + 1) % LOADING_PHRASES.length), 2400);
    const dotTimer = setInterval(() => setDots(prev => prev.length >= 3 ? "" : prev + "."), 500);
    return () => { clearInterval(phraseTimer); clearInterval(dotTimer); };
  }, []);
  return (
    <div style={{ padding: "20px 24px", marginBottom: "16px", background: "linear-gradient(135deg, rgba(212,162,78,0.08), rgba(212,162,78,0.03))", border: "1px solid rgba(212,162,78,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(212,162,78,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "glow 2s ease-in-out infinite" }}>
        <Loader2 size={20} color="#d4a24e" className="spin" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#d4a24e", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{LOADING_PHRASES[phraseIdx]}</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" }}>claude-sonnet generating{dots}</div>
      </div>
      <div style={{ width: "60px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ width: "40%", height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #d4a24e, #b8862e)", animation: "shimmerBar 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
};

export const Fireworks = () => {
  const [particles] = useState(() => Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360;
    const distance = 60 + Math.random() * 80;
    const colors = ["#d4a24e", "#f0c674", "#b8862e", "#ffd700", "#ff9500", "#50b450"];
    return { x: Math.cos(angle * Math.PI / 180) * distance, y: Math.sin(angle * Math.PI / 180) * distance, size: 4 + Math.random() * 6, delay: Math.random() * 300, duration: 800 + Math.random() * 400, color: colors[Math.floor(Math.random() * colors.length)], id: i };
  }));
  const [positions, setPositions] = useState({});
  useEffect(() => {
    const timers = particles.map(p => setTimeout(() => setPositions(prev => ({ ...prev, [p.id]: true })), p.delay));
    return () => timers.forEach(t => clearTimeout(t));
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: "absolute", width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%", background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`, transform: positions[p.id] ? `translate(${p.x}px, ${p.y}px) scale(0.3)` : "translate(0,0) scale(1)", opacity: positions[p.id] ? 0 : 1, transition: `transform ${p.duration}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${p.duration}ms ease` }} />
      ))}
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#d4a24e", fontFamily: "'DM Sans', sans-serif", textShadow: "0 0 20px rgba(212,162,78,0.5)", animation: "fadeInScale 0.4s 0.2s ease forwards", opacity: 0 }}>Instructions Copied!</div>
    </div>
  );
};
