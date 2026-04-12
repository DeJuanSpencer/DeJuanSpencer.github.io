"use client";
import { Loader2, Sparkles, Check } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function ExamplesStep({ loading, examples, approvedExamples, setApprovedExamples, generateExamples, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Approve Reference Examples</SectionLabel>
        <Btn small onClick={generateExamples} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{examples.length ? "Regenerate" : "Generate"}</Btn>
      </div>
      {!examples.length && !loading && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Examples anchor Claude's behavior. Approve the ones that represent ideal responses.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {examples.map((e, i) => (
          <Card key={i} highlight={approvedExamples.has(i)} style={approvedExamples.has(i) ? { boxShadow: "0 0 20px rgba(212,162,78,0.15)", border: "1px solid rgba(212,162,78,0.4)", transition: "all 0.4s ease" } : { transition: "all 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)" }}>Example {i + 1}</span>
              <Btn small onClick={() => { const next = new Set(approvedExamples); next.has(i) ? next.delete(i) : next.add(i); setApprovedExamples(next); trackActivity(); }}>
                {approvedExamples.has(i) ? <><Check size={14} /> Approved</> : "Approve"}
              </Btn>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 12px", marginBottom: "8px" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>USER</div>
              <div style={{ color: "#e0e0e0", fontSize: "13px" }}>{e.userMessage}</div>
            </div>
            <div style={{ background: "rgba(212,162,78,0.05)", borderRadius: "6px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", color: "rgba(212,162,78,0.6)", marginBottom: "4px" }}>ASSISTANT</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.5 }}>{e.idealResponse}</div>
            </div>
            {e.reasoning && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", fontStyle: "italic", marginTop: "8px" }}>{e.reasoning}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
