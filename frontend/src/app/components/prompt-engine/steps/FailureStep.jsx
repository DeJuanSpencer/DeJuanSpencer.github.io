"use client";
import { Loader2, Sparkles, RefreshCw, ShieldOff, AlertTriangle } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function FailureStep({ loading, failures, itemLoading, generateFailures, regenerateFailure }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionLabel>Failure Mode Preemption</SectionLabel>
        <Btn small onClick={generateFailures} disabled={loading}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{failures.length ? "Regenerate All" : "Generate"}</Btn>
      </div>
      {!failures.length && !loading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic" }}>Domain-specific failure patterns Claude should be explicitly blocked from.</div>}
      {failures.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(212,162,78,0.06)", border: "1px solid rgba(212,162,78,0.15)", borderRadius: "8px" }}>
          <ShieldOff size={16} color="#d4a24e" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>All patterns will be included in your compiled instructions. Use "Redo" to replace any that don't fit.</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {failures.map((f, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <AlertTriangle size={16} color={f.severity === "high" ? "#dc5050" : f.severity === "medium" ? "#d4a24e" : "rgba(255,255,255,0.3)"} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: 600 }}>{f.pattern}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>Severity: {f.severity}</div>
                <div style={{ color: "rgba(212,162,78,0.8)", fontSize: "12px", marginTop: "4px" }}>Prevention: {f.prevention}</div>
              </div>
              <Btn small onClick={() => regenerateFailure(i)} disabled={itemLoading[`failure_${i}`]}>{itemLoading[`failure_${i}`] ? <Loader2 size={12} className="spin" /> : <RefreshCw size={12} />} Redo</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
