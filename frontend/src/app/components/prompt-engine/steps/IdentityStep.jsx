"use client";
import { Loader2, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function IdentityStep({ loading, identityOptions, selectedIdentity, setSelectedIdentity, generateIdentities, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Choose Claude's Identity</SectionLabel>
        <Btn small onClick={generateIdentities} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{identityOptions.length ? "Regenerate" : "Generate Options"}</Btn>
      </div>
      {!identityOptions.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Click "Generate Options" to get role suggestions based on your project context.</div>}
      <div role="radiogroup" aria-label="Identity options" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {identityOptions.map((opt, i) => (
          <Card key={i} highlight={selectedIdentity === i} style={{ cursor: "pointer" }}>
            <div role="radio" aria-checked={selectedIdentity === i} tabIndex={0} onClick={() => { setSelectedIdentity(i); trackActivity(); }} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedIdentity(i); trackActivity(); } }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                {selectedIdentity === i ? <CheckCircle2 size={18} color="#d4a24e" /> : <Circle size={18} color="rgba(255,255,255,0.3)" />}
                <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "15px" }}>{opt.title}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 8px 28px" }}>{opt.description}</p>
              <div style={{ display: "flex", gap: "6px", marginLeft: "28px", flexWrap: "wrap" }}>
                {opt.traits?.map((t, j) => <span key={j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
