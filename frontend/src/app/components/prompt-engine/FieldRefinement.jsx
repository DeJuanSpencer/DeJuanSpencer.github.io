"use client";
import { Loader2, Check, X, Lightbulb, Wand2, Sparkles } from "lucide-react";
import { Btn } from "./ui";

export const RefinePanel = ({ field, suggestion, onAccept, onDismiss }) => {
  if (!suggestion) return null;
  return (
    <div style={{ marginTop: "10px", background: "rgba(212,162,78,0.04)", border: "1px solid rgba(212,162,78,0.2)", borderRadius: "10px", padding: "14px 16px" }}>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", fontStyle: "italic" }}>{suggestion.reasoning}</div>
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "#d4a24e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>Refined Version</div>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "10px 12px", color: "#e0e0e0", fontSize: "13px", lineHeight: 1.6, borderLeft: "2px solid #d4a24e" }}>{suggestion.improved}</div>
        <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
          <Btn small primary onClick={() => onAccept(field, suggestion.improved)}><Check size={12} /> Accept</Btn>
          <Btn small onClick={() => onDismiss(field)}><X size={12} /> Dismiss</Btn>
        </div>
      </div>
      {suggestion.alternatives?.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>Alternatives</div>
          {suggestion.alternatives.map((alt, i) => (
            <div key={i} onClick={() => onAccept(field, alt)} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "8px 12px", color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: 1.5, marginBottom: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ flex: 1 }}>{alt}</span>
              <span style={{ fontSize: "10px", color: "rgba(212,162,78,0.6)", whiteSpace: "nowrap" }}>use this</span>
            </div>
          ))}
        </div>
      )}
      {suggestion.tips?.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
          <Lightbulb size={12} color="rgba(255,255,255,0.3)" style={{ marginTop: "2px" }} />
          {suggestion.tips.map((tip, i) => <span key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{tip}{i < suggestion.tips.length - 1 ? " · " : ""}</span>)}
        </div>
      )}
      {suggestion.missingInfo?.length > 0 && (
        <div style={{ marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
          <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(220,80,80,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>You Might Be Missing</div>
          {suggestion.missingInfo.map((info, i) => <div key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", padding: "4px 0", display: "flex", gap: "6px" }}><span style={{ color: "rgba(220,80,80,0.5)" }}>?</span> {info}</div>)}
        </div>
      )}
    </div>
  );
};

export const RefineBtn = ({ field, disabled, onRefine, isLoading }) => (
  <Btn small onClick={() => onRefine(field)} disabled={disabled || isLoading}>
    {isLoading ? <Loader2 size={12} className="spin" /> : <Wand2 size={12} />} Refine
  </Btn>
);

export const GenerateBtn = ({ field, onGenerate, isLoading }) => (
  <Btn small onClick={() => onGenerate(field)} disabled={isLoading}>
    {isLoading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />} Generate
  </Btn>
);
