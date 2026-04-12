"use client";
import { Check, Copy, X } from "lucide-react";
import { Btn } from "./ui";

// Simple inline formatter: colorizes headings and bolds in the preview
// without adding a markdown library dependency.
function FormattedPreview({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.65)" }}>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <div key={i} style={{ color: "#d4a24e", fontWeight: 600, fontSize: "12px", marginTop: i === 0 ? 0 : "14px", marginBottom: "2px", letterSpacing: "0.2px" }}>
              {line.replace(/^## /, "")}
            </div>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <div key={i} style={{ color: "rgba(212,162,78,0.75)", fontWeight: 600, fontSize: "11px", marginTop: "10px", marginBottom: "1px" }}>
              {line.replace(/^### /, "")}
            </div>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <div key={i} style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, marginTop: "6px" }}>
              {line.replace(/\*\*/g, "")}
            </div>
          );
        }
        if (line.trim() === "") {
          return <div key={i} style={{ height: "6px" }} />;
        }
        // Inline bold: replace **text** segments
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <div key={i} style={{ color: "rgba(255,255,255,0.6)" }}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <span key={j} style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{part.replace(/\*\*/g, "")}</span>
                : part
            )}
          </div>
        );
      })}
    </div>
  );
}

// Sample to show before the user has filled in meaningful content
const SAMPLE_PREVIEW = `## Project Frame Protocol
The first conversation in this project is the strategic layer. All subsequent conversations are execution within that frame.

## Identity & Role
**Title:** Senior Product Strategist
**Core traits:** Direct, systems-thinking, bias toward action

## Knowledge Baseline
- Deep SaaS go-to-market experience
- Understands technical constraints
- Familiar with enterprise sales cycles

## Guardrails
Do not speculate about competitors without data. Do not recommend headcount changes without context.

## Operating Modes
**[PLAN]** Strategic planning mode
**[EXEC]** Task execution mode
**[REVIEW]** Critical analysis mode`;

export default function PreviewPanel({ isMobile, showPreview, setShowPreview, compiledOutput, copied, onCopy, currentStep }) {
  // Show the sample preview for the first few steps when output is still sparse
  const outputIsMinimal = compiledOutput.trim().length < 180;
  const showSample = outputIsMinimal && currentStep < 3;

  return (
    <aside aria-label="Live preview" style={isMobile ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)", display: showPreview ? "flex" : "none", flexDirection: "column" } : { width: showPreview ? "320px" : "0px", minWidth: showPreview ? "320px" : "0px", borderLeft: showPreview ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgba(0,0,0,0.15)", overflow: "hidden", transition: "all 0.3s", display: "flex", flexDirection: "column" }}>
      {showPreview && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Panel header */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#d4a24e", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>Live Preview</div>
              {showSample && (
                <div style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", padding: "2px 6px" }}>sample</div>
              )}
              {!showSample && (
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#50b450", boxShadow: "0 0 6px rgba(80,180,80,0.5)", animation: "glow 2s ease-in-out infinite" }} title="Auto-updating" />
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {!showSample && <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.35)" }}>auto-updates</div>}
              {isMobile && <button onClick={() => setShowPreview(false)} aria-label="Close preview" style={{ background: "none", border: "none", cursor: "pointer", padding: "10px", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={20} color="rgba(255,255,255,0.6)" /></button>}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {showSample ? (
              <div>
                <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)", marginBottom: "12px", fontStyle: "italic" }}>
                  Example output — yours builds here as you fill each step.
                </div>
                <FormattedPreview text={SAMPLE_PREVIEW} />
              </div>
            ) : (
              <FormattedPreview text={compiledOutput} />
            )}
          </div>

          {/* Copy footer — only when showing real output */}
          {!showSample && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              <Btn small primary onClick={onCopy} style={{ width: "100%", justifyContent: "center" }}>
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </Btn>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
