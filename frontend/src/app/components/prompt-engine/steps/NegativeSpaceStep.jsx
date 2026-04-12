"use client";
import { Loader2, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function NegativeSpaceStep({ loading, negativeSuggestions, selectedNegatives, setSelectedNegatives, generateNegativeSpace, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Select Behaviors to Block</SectionLabel>
        <Btn small onClick={generateNegativeSpace} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{negativeSuggestions.length ? "Regenerate" : "Generate Suggestions"}</Btn>
      </div>
      {!negativeSuggestions.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Auto-generated based on your domain. Deselect any that don't apply.</div>}
      {negativeSuggestions.length > 0 && selectedNegatives.size === negativeSuggestions.length && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(80,180,80,0.06)", border: "1px solid rgba(80,180,80,0.2)", borderRadius: "8px" }}>
          <CheckCircle2 size={16} color="#50b450" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>All behaviors selected by default. Deselect any that don't apply to your project.</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {negativeSuggestions.map((n, i) => (
          <Card key={i} highlight={selectedNegatives.has(i)} style={{ cursor: "pointer" }}>
            <div onClick={() => { const next = new Set(selectedNegatives); next.has(i) ? next.delete(i) : next.add(i); setSelectedNegatives(next); trackActivity(); }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                {selectedNegatives.has(i) ? <CheckCircle2 size={16} color="#d4a24e" style={{ marginTop: "2px", flexShrink: 0 }} /> : <Circle size={16} color="rgba(255,255,255,0.2)" style={{ marginTop: "2px", flexShrink: 0 }} />}
                <div><div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600 }}>{n.behavior}</div><div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>{n.reason}</div></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
