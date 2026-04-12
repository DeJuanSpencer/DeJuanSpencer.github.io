"use client";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function ModesStep({ loading, modes, defaultModeIdx, setDefaultModeIdx, itemLoading, generateModes, regenerateMode, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Operational Modes</SectionLabel>
        <Btn small onClick={generateModes} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{modes.length ? "Regenerate All" : "Generate Modes"}</Btn>
      </div>
      {!modes.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Modes give you switchable behavior profiles within the same project.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modes.map((m, i) => (
          <Card key={i} highlight={i === defaultModeIdx}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "15px" }}>{m.name}</span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "rgba(212,162,78,0.15)", color: "#d4a24e", fontFamily: "'JetBrains Mono', monospace" }}>"{m.trigger}"</span>
                  {i === defaultModeIdx && <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(80,180,80,0.15)", color: "#50b450", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>default</span>}
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", margin: "4px 0 8px" }}>{m.description}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {m.characteristics?.map((c, j) => <span key={j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>{c}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "10px", flexShrink: 0 }}>
                <Btn small onClick={() => { setDefaultModeIdx(i); trackActivity(); }} style={{ opacity: i === defaultModeIdx ? 0.4 : 1 }}>Set Default</Btn>
                <Btn small onClick={() => regenerateMode(i)} disabled={itemLoading[`mode_${i}`]}>{itemLoading[`mode_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
