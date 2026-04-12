"use client";
import { Loader2, Sparkles, ToggleLeft, ToggleRight, CheckCircle2, Circle } from "lucide-react";
import { SectionLabel, Btn, Card } from "../ui";

export function TemplatesStep({ loading, templates, templatesEnabled, setTemplatesEnabled, selectedTemplates, setSelectedTemplates, generateTemplates, trackActivity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SectionLabel>Output Templates</SectionLabel>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>optional</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => { setTemplatesEnabled(!templatesEnabled); trackActivity(); }} aria-label={templatesEnabled ? "Disable templates" : "Enable templates"} aria-pressed={templatesEnabled} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            {templatesEnabled ? <ToggleRight size={28} color="#d4a24e" /> : <ToggleLeft size={28} color="rgba(255,255,255,0.3)" />}
          </button>
          <Btn small onClick={generateTemplates} disabled={loading || !templatesEnabled}>{loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} Generate</Btn>
        </div>
      </div>
      {!templatesEnabled && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontStyle: "italic" }}>Toggle on to define response formats for common interaction types.</div>}
      {templatesEnabled && (
        <div role="group" aria-label="Template options">
          {templates.map((t, i) => (
            <Card key={i} highlight={selectedTemplates.has(i)} style={{ cursor: "pointer", marginBottom: "10px" }}>
              <div role="checkbox" aria-checked={selectedTemplates.has(i)} aria-label={t.name} tabIndex={0} onClick={() => { const next = new Set(selectedTemplates); next.has(i) ? next.delete(i) : next.add(i); setSelectedTemplates(next); trackActivity(); }} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const next = new Set(selectedTemplates); next.has(i) ? next.delete(i) : next.add(i); setSelectedTemplates(next); trackActivity(); } }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  {selectedTemplates.has(i) ? <CheckCircle2 size={16} color="#d4a24e" /> : <Circle size={16} color="rgba(255,255,255,0.3)" />}
                  <span style={{ fontWeight: 700, color: "#e0e0e0", fontSize: "14px" }}>{t.name}</span>
                </div>
                <div style={{ marginLeft: "26px" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "6px" }}>Trigger: {t.trigger}</div>
                  <pre style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)", padding: "8px 10px", borderRadius: "6px" }}>{t.format}</pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
